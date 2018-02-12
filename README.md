#   QYB wallet service

--生成红包订单
curl -i -X POST -H 'Content-type:application/json' -H 'x-openId:oPBuhuDJooh6u32f8wXZB7gBvnLc' -d '{"amount":10,"quantity":3,"ltype":"radom","comment":"best wishes"}' "http://luckymoney.let5see.xyz/bws/api/luckymoney/order/"

--红包订单支付
curl -i -X POST -H 'Content-type:application/json' -H 'x-openId:oPBuhuDJooh6u32f8wXZB7gBvnLc' -d '{"luckymoneyId":"5e33f710-0f59-11e8-ad79-c3cca19bb492","txid":"xxxxxxxxxxx"}' "http://luckymoney.let5see.xyz/bws/api/luckymoney/pay/"

--红包列表查询
curl -i -X POST -H 'Content-type:application/json' -H 'x-openId:oPBuhuDJooh6u32f8wXZB7gBvnLc' -d '{"luckymoneyId":"5e33f710-0f59-11e8-ad79-c3cca19bb492","ltype":"received"}' "http://luckymoney.let5see.xyz/bws/api/luckymoney/query/"


--红包详情查询
curl -i -X GET -H 'x-openId:oPBuhuDJooh6u32f8wXZB7gBvnLc' "http://luckymoney.let5see.xyz/bws/api/luckymoney/detail/5e33f710-0f59-11e8-ad79-c3cca19bb492"
