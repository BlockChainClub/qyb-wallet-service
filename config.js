var config = {
  basePath: '/bws/api',
  disableLogs: false,
  port: 3232,

  // Uncomment to make BWS a forking server
  // cluster: true,

  // Uncomment to set the number or process (will use the nr of availalbe CPUs by default)
  // clusterInstances: 4,

  // https: true,
  // privateKeyFile: 'private.pem',
  // certificateFile: 'cert.pem',
  ////// The following is only for certs which are not
  ////// trusted by nodejs 'https' by default
  ////// CAs like Verisign do not require this
  // CAinter1: '', // ex. 'COMODORSADomainValidationSecureServerCA.crt'
  // CAinter2: '', // ex. 'COMODORSAAddTrustCA.crt'
  // CAroot: '', // ex. 'AddTrustExternalCARoot.crt'

  // @empty add for luckymoney server wallet
  luckymoneyOpts:{
    walletOpts:{
      name: 'luckymoney server wallet',
      m: 1,
      n: 1,
      pubKey: '026092daeed8ecb2212869395770e956ffc9bf453f803e700f64ffa70c97a00d80',
      singleAddress: false,
      coin: 'btc',
    }
  },
  wechatConfig:{
    //set your oauth redirect url, defaults to localhost
    //"wechatRedirectUrl": "http://luckymoney.let5see.xyz/bws/api/luckymoney/scramble/",
    "wechatRedirectUrl": "http://api.qyb.chainclub.one/bws/api/luckymoney/scramble/",
    //"wechatToken": "wechat_token", //not necessary required
    //"appId": "wxf113fb4694aa7496",
    //"appSecret": "d8ed1f49fd2afd3f625c23b0bb305622",
    "appId":"wx636b2b7a48393da9",
    "appSecret": "9c7aa114328e083a96cc71ce1187be69",
  },
  storageOpts: {
    mongoDb: {
      uri: 'mongodb://localhost:27017/bws',
    },
  },
  lockOpts: {
    //  To use locker-server, uncomment this:
    lockerServer: {
      host: 'localhost',
      port: 3231,
    },
  },
  messageBrokerOpts: {
    //  To use message broker server, uncomment this:
    messageBrokerServer: {
      url: 'http://localhost:3380',
    },
  },
  blockchainExplorerOpts: {
    btc: {
      livenet: {
        provider: 'insight',
        url: 'http://localhost:3001',
        apiPrefix: '/insight-api'
      },
      testnet: {
        provider: 'insight',
        url: 'http://localhost:3001',
        apiPrefix: '/insight-api'
        // Multiple servers (in priority order)
        // url: ['http://a.b.c', 'https://test-insight.bitpay.com:443'],
      },
    },
    bch: {
      livenet: {
        provider: 'insight',
        //url: 'https://cashexplorer.bitcoin.com',
        url: 'http://localhost:3001',
        apiPrefix: '/insight-api'
      },
    },
  },
  pushNotificationsOpts: {
    templatePath: './lib/templates',
    defaultLanguage: 'en',
    defaultUnit: 'btc',
    subjectPrefix: '',
    pushServerUrl: 'https://fcm.googleapis.com/fcm',
    authorizationKey: '',
  },
  fiatRateServiceOpts: {
    defaultProvider: 'BitPay',
    fetchInterval: 60, // in minutes
  },
  // To use email notifications uncomment this:
  // emailOpts: {
  //  host: 'localhost',
  //  port: 25,
  //  ignoreTLS: true,
  //  subjectPrefix: '[Wallet Service]',
  //  from: 'wallet-service@bitcore.io',
  //  templatePath: './lib/templates',
  //  defaultLanguage: 'en',
  //  defaultUnit: 'btc',
  //  publicTxUrlTemplate: {
  //    livenet: 'https://insight.bitpay.com/tx/{{txid}}',
  //    testnet: 'https://test-insight.bitpay.com/tx/{{txid}}',
  //  },
  //},
  //
  // To use sendgrid:
  // var sgTransport = require('nodemail-sendgrid-transport');
  // mailer:sgTransport({
  //  api_user: xxx,
  //  api_key: xxx,
  // });
};
module.exports = config;
