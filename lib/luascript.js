var redisClient;

var instance = {
  script : {

  }
};


instance.script.grabbingRedPacket = {
    code : `
        if redis.call('hexists', KEYS[2], KEYS[3]) ~= 0 then
            local res ={}
            res['status'] = 'again';
            res['money'] = redis.call('hget', KEYS[2], KEYS[3]);
            return cjson.encode(res);
        else
            if redis.call('exists', KEYS[1]) == 1 then 
            local lm = redis.call('rpop', KEYS[1]);
            if lm then
                local x = cjson.decode(lm);
                redis.call('hset', KEYS[2], KEYS[3], string.format("%0.6f", x['money']));
                local res ={}
                res['status'] = 'got';
                res['money'] = string.format("%0.6f", x['money']);
                return cjson.encode(res);
            else
                local res ={}
                res['status'] = 'no';
                return cjson.encode(res);
            end 
            else
            local res ={}
            res['status'] = 'expired';
            return cjson.encode(res);
            end
        end
    `,
    keysLength : 3
};

// 用于记录已在redis缓存过的脚本sha码
let bufferScript = {};
/**
 *
 * lua执行器 自动判断是否已经缓存过  从而决定是向redis传递脚本还是sha
 *
 * @param name    本脚本所支持的指令  位于 instance.script 下
 * @param ...param  该指令所期待的参数, 按照KEYS到ARGV的顺序罗列
 */
instance.run = function(name, ...param) {
    return new Promise((resolve, reject) => {
        if (!redisClient) {
        reject('redisClient is no ready');
        } else if (!instance.script[name]) {
        reject('this command is not supported');
        } else {
        if (bufferScript[name]) {
            redisClient.evalsha(bufferScript[name], instance.script[name].keysLength, ...param, (err, result) => {
            if (err) {
                reject(err);
            } else {
                resolve(result);
            }
            });
        } else {
            redisClient.script('load', instance.script[name].code, (err, sha) => {
            if (err) {
                reject(err);
            } else {
                bufferScript[name] = sha;
                redisClient.evalsha(sha, instance.script[name].keysLength, ...param, (err, result) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(result);
                }
                });
            }
            });
        }
        }
    });
}
  
  
module.exports = function(client) {
    if (!client) {
        return;
    }
    redisClient = client;
    return instance;
}