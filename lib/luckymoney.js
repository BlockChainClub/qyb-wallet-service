'use strict';
var _ = require('lodash');
var redis = require("redis");
var async = require('async');
var Common = require('./common');
var Config = require('../config');
var WalletService = require('./server');
var Utils = Common.Utils;
var log = require('npmlog');
var LM = {};
const uuidv1 = require('uuid/v1');

var redisClient = redis.createClient(6379,'127.0.0.1',{});

redisClient.on("error", function (err) {
    redisClient.quit()
    logger.error("Error " + err);
    redisClient = redis.createClient(6379,'127.0.0.1',{});
});

const LM_QUEUE_SURPLUS ="lm:surplus:";
const LM_QUEUE_COST ="lm:cost:";
const LM_QUEUE_USED ="lm:used:";

const LMLUASCRIPT = "if redis.call('hexists', KEYS[3], KEYS[4]) ~= 0 then return 1; else local hongBao = redis.call('rpop', KEYS[1]); if hongBao then local x = cjson.decode(hongBao); x['userId'] = KEYS[4]; local re = cjson.encode(x); redis.call('hset', KEYS[3], KEYS[4], KEYS[4]); redis.call('lpush', KEYS[2], re); return re; else return 0; end  end";



function getserverWalletAddress(outerPacketId,cb) {
    return cb(null,{luckymoneyId:outerPacketId,address:"1N5Y2z1wKLjVTDYgNjfW1iH9DTGTsySNBv"})
}

LM.buildLuckyMoneyOrder2 = function(opts, cb){
    if(!_.isNumber(opts.quantity))return cb(null, {status:'failed'});
    if(!_.isNumber(opts.amount))return cb(null, {status:'failed'});
    if(opts.quantity<1)return cb(null, {status:'failed'});

    var arr =[]
    if(opts.ltype=='fixed'){
        for(var i = 0; i < opts.quantity; i++){
            redisClient.zadd("lm:" + outerPacketId, i, i +":" + Utils.strip(opts.amount))
        }
        getserverWalletAddress(outerPacketId,cb);
    }else if(opts.ltype=='radom'){
        var money = opts.amount * 1000000
        var weights = []
        var totalWeight = 0
        for(var i = 0; i < opts.quantity; i++){
            var t =  Math.random()
            totalWeight += t
            weights.push(t)
        }
        var arr =[]
        var usedMoney = 0
        for(var i = 0; i < opts.quantity - 1; i++){
            var t = Math.floor(money * weights[i]/totalWeight)
            usedMoney += t
            arr.push(Utils.strip(t / 1000000))
        }
        arr.push(Utils.strip((money - usedMoney) / 1000000))
        getserverWalletAddress(outerPacketId,cb)
    }else{
        return cb(null, {status:'failed'});
    }
    
}

LM.buildLuckyMoneyOrder = function(opts, cb){
    if(!_.isNumber(opts.quantity))return cb(null, {status:'failed'});
    if(!_.isNumber(opts.amount))return cb(null, {status:'failed'});
    if(opts.quantity<1)return cb(null, {status:'failed'});

    var outerPacketId = uuidv1().replace(/-/g,'');
    if(opts.ltype=='fixed'){
        for(var i = 0; i < opts.quantity; i++){
            redisClient.zadd("lm:" + outerPacketId, i, i +":" + Utils.strip(opts.amount))
        }
        getserverWalletAddress(outerPacketId,cb);
    }else if(opts.ltype=='radom'){
        var money = opts.amount * 1000000
        var weights = []
        var totalWeight = 0
        for(var i = 0; i < opts.quantity; i++){
            var t =  Math.random()
            totalWeight += t
            weights.push(t)
        }
        var usedMoney = 0
        for(var i = 0; i < opts.quantity - 1; i++){
            var t = Math.floor(money * weights[i]/totalWeight)
            usedMoney += t
            redisClient.zadd("lm:" + outerPacketId, i, i +":" + Utils.strip(t / 1000000))
        }
        redisClient.zadd("lm:" + outerPacketId, (opts.quantity - 1), (opts.quantity - 1) +":" + Utils.strip((money - usedMoney) / 1000000))
        getserverWalletAddress(outerPacketId,cb)
    }else{
        return cb(null, {status:'failed'});
    }
    
}

LM.buildLuckyMoneyArr = function(opts, cb){
    if(!_.isNumber(opts.quantity))return cb(null, {status:'failed'});
    if(!_.isNumber(opts.amount))return cb(null, {status:'failed'});
    if(opts.quantity<1)return cb(null, {status:'failed'});

    var arr =[]
    if(opts.ltype=='fixed'){
        for(var i = 0; i < opts.quantity; i++){
            arr.push({i:i,money:Utils.strip(opts.amount)});
        }
        return cb(arr);
    }else if(opts.ltype=='radom'){
        var money = opts.amount * 1000000
        var weights = []
        var totalWeight = 0
        for(var i = 0; i < opts.quantity; i++){
            var t =  Math.random()
            totalWeight += t
            weights.push(t)
        }
        var arr =[]
        var usedMoney = 0
        for(var i = 0; i < opts.quantity - 1; i++){
            var t = Math.floor(money * weights[i]/totalWeight)
            usedMoney += t
            arr.push({i:i,money:Utils.strip(t / 1000000)});
        }
        arr.push({i:i,money:Utils.strip((money - usedMoney) / 1000000)});
        return cb(arr);
    }else{
        return cb({status:'failed'});
    }
    
}

/**
 * 发布红包信息
 */
LM.pushLuckyMoney = function(luckymoneyId,data,cb){
    redisClient.lpush(24*60*60,LM_QUEUE_SURPLUS+luckymoneyId,data,function(err,res){
        if(err){  
            return cb(err);
        } else{
            
            return cb(res); 
        }  
    });
}

/**
 * 抢红包
 */
LM.scrambleLuckymoney = function(){
    
}

module.exports = LM;