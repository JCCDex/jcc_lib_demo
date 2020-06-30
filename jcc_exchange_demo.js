const { NodeRpcFactory, ConfigFactory, ExchangeFactory, ExplorerFactory, InfoFactory } = require("jcc_rpc");
const BigNumber = require("bignumber.js");
const jtWallet = require("jcc_wallet").jtWallet;
const jccExchange = require('jcc_exchange').JCCExchange;


const swtcwallet1 = { address:'jGYPMXBtExPBgFEHKpLbh8vdWUfqW5pFLx', secret: 'ssEEef7JHubPGTCLwTLkuu4oqKtD6' };
const swtcwallet2 = { address:'jGRevGoFSnKf9tzvGMt8C6BeYYcBURJ8KX', secret: 'ssVvAZrAUj7dxFfLdaVvoVH2VTij2'};
let rpcHosts = null;
let explorerHosts = null;
let exchangeHosts = null;
let infoHosts = null;


const hosts = ["jccdex.cn", "weidex.vip"];
const port = 443;
const https = true;


// const chain_servers = ["https://srje115qd43qw2.swtc.top"];
// const explorer_server = ["https://swtcscan.jccdex.cn"];

/**
 * 获取配置信息
 */
const getConfig = async() => {
    const configInst = ConfigFactory.init(hosts, port, https);
    const configData =  await configInst.getConfig();
    rpcHosts = configData.jcNodes;
    explorerHosts = configData.scanHosts;
    exchangeHosts = configData.exHosts;
    infoHosts = configData.infoHosts;
    console.log(rpcHosts,explorerHosts,exchangeHosts,infoHosts);
};

/**
 * 挂单
 * @param {string} secret 钱包密钥
 * @param {string} amount 挂单数量
 * @param {string} base  token名称(大写) 如果交易对是"SWT-CNY",则base是SWT
 * @param {string} counter  token名称(大写) 如果交易对是"SWT-CNY",则counter是CNY
 * @param {string} cost  挂单总价值=挂单价格*挂单数量
 * @param {string} type 挂单类型[buy/sell]
 */
const createOrder = async (secret, amount, base, counter,cost, type)  => {
    base = base.toUpperCase();
    counter = counter.toUpperCase();
    const address = jtWallet.getAddress(secret);
    jccExchange.init(rpcHosts);
    const hash = await jccExchange.createOrder(address, secret, amount.toString(), base, counter, cost.toString(), type);
    console.log('createOrder', hash);
};

/**
 * 撤单
 * @param {string} secret 钱包密钥
 * @param {number} sequence 挂单的sequence
 */
const cancelOrder = async (secret, sequence)  => {
    const address = jtWallet.getAddress(secret);
    jccExchange.init(rpcHosts);
    const hash = await jccExchange.cancelOrder(address, secret, sequence);
    console.log('cancelOrder', hash);
};

/**
 * 转账
 * @param {string} secret 转出钱包密钥
 * @param {*} amount 转账数量
 * @param {*} memo 转账备注
 * @param {*} to 转入钱包地址
 * @param {*} token 转账token(大写)
 */
const transfer = async (secret, amount, memo, to, token)  => {
    token = token.toUpperCase();
    const address = jtWallet.getAddress(secret);
    jccExchange.init(rpcHosts);
    const hash = await jccExchange.transfer(address, secret, amount.toString(), memo, to, token);
    console.log('transfer', hash);
};

(async () => {
    await getConfig();
    //await createOrder('ssEEef7JHubPGTCLwTLkuu4oqKtD6', '1', 'SWT', 'CNY', '0.01', 'sell');
    //await cancelOrder('ssEEef7JHubPGTCLwTLkuu4oqKtD6', 7);
    await transfer('ssEEef7JHubPGTCLwTLkuu4oqKtD6', '1','test', 'jGRevGoFSnKf9tzvGMt8C6BeYYcBURJ8KX','SWT')
})()
