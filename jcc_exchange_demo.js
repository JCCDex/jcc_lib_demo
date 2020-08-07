const { NodeRpcFactory, ConfigFactory, ExchangeFactory, ExplorerFactory, InfoFactory } = require("jcc_rpc");
const BigNumber = require("bignumber.js");
const jtWallet = require("jcc_wallet").jtWallet;
const jccExchange = require('jcc_exchange').JCCExchange;
const { serializePayment } = require("jcc_exchange/lib/tx");
const {sign} = require('jcc_exchange');


const swtcwallet1 = { address:'jGYPMXBtExPBgFEHKpLbh8vdWUfqW5pFLx', secret: 'ssEEef7JHubPGTCLwTLkuu4oqKtD6' };
const swtcwallet2 = { address:'jGRevGoFSnKf9tzvGMt8C6BeYYcBURJ8KX', secret: 'ssVvAZrAUj7dxFfLdaVvoVH2VTij2'};
let rpcHosts = null;
let explorerHosts = null;
let exchangeHosts = null;
let infoHosts = null;

let rpcInst = null;
const hosts = ["jccdex.cn", "weidex.vip"];
const port = 443;
const https = true;
// 发行方地址
const issuer = "jGa9J9TkqtBcUoHe2zqhVFFbgUVED6o9or";

const delay = async (timer) => {
    return await new Promise((resolve) => setTimeout(resolve, timer));
  };

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

/**
 * 安全转账 防止重复转账
 * @param {string} secret 转出钱包密钥
 * @param {*} amount 转账数量
 * @param {*} memo 转账备注
 * @param {*} to 转入钱包地址
 * @param {*} token 转账token(大写)
 */
const safe_transfer = async (secret, amount, memo, to, token)  => {
    token = token.toUpperCase();
    const address = jtWallet.getAddress(secret);
    const sequence = await rpcInst.getSequence(address);
    // jccExchange.init(rpcHosts);
    // const hash = await jccExchange.transfer(address, secret, amount.toString(), memo, to, token);
    try {
        const tx = serializePayment(address, amount, to, token, memo, issuer);
        // 设置sequence
        tx.Sequence = sequence;
        // 签名, 获取blob和交易hash
        const { blob, hash } = sign(tx, secret, "jingtum", true);
    
        let hasSent = false;
        while (true) {
          try {
              if(!hasSent) {
                await rpcInst.sendRawTransaction(blob);
                hasSent = true;
                //console.log('send tranction',new Date().getTime());
              } else {
                await delay(15000);
                const res = await explorerInst.orderDetail(address, hash);
                //console.log(res)
                if (res.result && res.data && res.data.succ === "tesSUCCESS") {
                  // 交易成功
                  console.log('transfer success hash:', hash);
                  break;
                } else {
                    console.log('transfer failed , will re-try');
                    hasSent = false;
                }
              }
          } catch (error) {
              console.log(error);
              break;
          }
        }
    
      } catch (error) {
        console.log(error);
      }
};

(async () => {
    await getConfig();
    //await createOrder('ssEEef7JHubPGTCLwTLkuu4oqKtD6', '1', 'SWT', 'CNY', '0.01', 'sell');
    //await cancelOrder('ssEEef7JHubPGTCLwTLkuu4oqKtD6', 7);
    explorerInst = ExplorerFactory.init(explorerHosts, port, https);
    rpcInst = NodeRpcFactory.init(rpcHosts);
    //await transfer('ssEEef7JHubPGTCLwTLkuu4oqKtD6', '1','test', 'jGRevGoFSnKf9tzvGMt8C6BeYYcBURJ8KX','SWT')
    await safe_transfer('ssEEef7JHubPGTCLwTLkuu4oqKtD6', '1','test', 'jGRevGoFSnKf9tzvGMt8C6BeYYcBURJ8KX','SWT')
})()
