const { NodeRpcFactory, ConfigFactory, ExchangeFactory, ExplorerFactory, InfoFactory } = require("jcc_rpc");
const BigNumber = require("bignumber.js");
const jtWallet = require("jcc_wallet");

const chain_servers = ["https://srje115qd43qw2.swtc.top"];
const explorer_server = ["https://swtcscan.jccdex.cn"];

const explorerInst = ExplorerFactory.init(explorer_server);

const swtcwallet1 = { address:'jGYPMXBtExPBgFEHKpLbh8vdWUfqW5pFLx', secret: 'ssEEef7JHubPGTCLwTLkuu4oqKtD6' };
const swtcwallet2 = { address:'jGRevGoFSnKf9tzvGMt8C6BeYYcBURJ8KX', secret: 'ssVvAZrAUj7dxFfLdaVvoVH2VTij2'};

/**
 * 获取钱包余额
 * @param {string} uuid  客户端唯一识别号 
 * @param {sring} address 钱包地址
 * 返回数据结构描述参见: [https://github.com/JCCDex/JingChang-Document/blob/master/zh-CN/Jingchang-Explorer-Server.md#51-指定钱包的余额查询包括所有token的余额所有token的冻结数量]
 */
const getBalance = async (uuid, address)  => {
    const res = await explorerInst.getBalances(address, address);
    if (!res.result) {
        return null;
    }
    const data = res.data;

    console.log('getBalance', data);
    return data;
};
getBalance('9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d','jGYPMXBtExPBgFEHKpLbh8vdWUfqW5pFLx');


/**
 * 获取交易详情数据
 * @param {string} uuid  客户端唯一识别号
 * @param {string} hash 交易hash
 * 返回数据结构描述参见: [https://github.com/JCCDex/JingChang-Document/blob/master/zh-CN/Jingchang-Explorer-Server.md#3-根据哈希查询交易详细]
 */
const getOrderDetail = async (uuid, hash) => {
    const res = await explorerInst.orderDetail(uuid, hash);
    if (!res.result) {
        return null;
    }
    const data = res.data;

    console.log('getOrderDetail', data);
    return data;
};
getOrderDetail('9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d', 'F20C26BB3C58A69B22E33BDA9CAD48AC792652ACC0E6A4CD6F49F6334A022EA6');


/**
 * 获取交易记录
 * @param {string} uuid  客户端唯一识别号
 * @param {string} address  钱包地址
 * @param {number} page     页码 从0开始
 * @param {number} size     10/20/50/100 每页条数, 默认值为20 
 * @param {{ begin: string, end: string, currency: string, type: string, buyOrsell: number, otherWallet: string }} option  查询条件，可选
 * begin: 开始日期
 * end:   结束日期
 * currency:  交易对或币种（可以不传值，不传值表示币种不作为查询条件。在t=OfferCreate或OfferAffect或OfferCancel时，传值必须形如：SWTC-CNY或swtc-cny，必须是交易对本来的顺序base-counter的形式，比如这里不能是CNY-SWTC，否则买卖关系可能就乱了，另外交易对可以只指定base或counter，如swtc-或-cny，所有的交易对请参见附录；在t=Send或Receive时，传值必须长度<8，如JJCC）
 * type: OfferCreate/OfferAffect/OfferCancel/Send/Receive  交易类型（多个类型以逗号分隔，可以不传值，不传值表示查询所有类型）
 * buyOrsell: 0/1/2 0:买或卖 1:买 2:卖  只有在t=OfferCreate或OfferAffect或OfferCancel时有效果
 * otherWallet: 交易对手的钱包地址
 * 返回数据结构描述参见: [https://github.com/JCCDex/JingChang-Document/blob/master/zh-CN/Jingchang-Explorer-Server.md#53-指定钱包的历史交易查询]
 */
const getHistory = async (uuid, address, page, size, option) => {
    const res = await explorerInst.getHistory(uuid, address, page, size);
    if (!res.result) {
        return null;
    }
    const data = res.data;

    console.log('getHistory', data);
    return data;
}
getHistory('9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d', 'jGYPMXBtExPBgFEHKpLbh8vdWUfqW5pFLx',0,10 );


/**
 * 获取当前委托订单
 * @param {string} uuid  客户端唯一识别号
 * @param {string} address  钱包地址
 * @param {number} page     页码 从0开始
 * @param {number} size     10/20/50/100 每页条数, 默认值为20 
 * @param {{ pair: string, buyOrsell: number}} option  查询条件，可选
 * pair: 交易对 交易对（可以不传值，不传值表示查询全部类型交易对的委托单。形如：SWTC-CNY或swtc-cny，必须是交易对本来的顺序base-counter的形式，比如这里不能是CNY-SWTC，否则买卖关系可能就乱了，另外交易对可以只指定base或counter，如swtc-或-cny
 * buyOrsell:   0/1/2  0:买或卖 1:买 2:卖
 * 返回数据结构描述参见: [https://github.com/JCCDex/JingChang-Document/blob/master/zh-CN/Jingchang-Explorer-Server.md#52-指定钱包的当前委托单查询]
 */
const getOrders = async (uuid, address, page, size, option) => {
    const res = await explorerInst.getOrders(uuid, address, page, size);
    if (!res.result) {
        return null;
    }
    const data = res.data;

    console.log('getOrders', data);
    return data;
}
getOrders('9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d', 'jGYPMXBtExPBgFEHKpLbh8vdWUfqW5pFLx',0,10 );


/**
 * 获取所有tokens列表
 * @param {string} uuid  客户端唯一识别号
 * @param {{ currency: string }} option  token名称，可选
 * 返回值 [https://github.com/JCCDex/JingChang-Document/blob/master/zh-CN/Jingchang-Explorer-Server.md#61-获取所有tokens列表]
 */
const getTokens = async (uuid, option) => {
    const res = await explorerInst.getTokens(uuid, option);
    if (!res.result) {
        return null;
    }
    const data = res.data;

    console.log('getTokens', data);
    return data;
}
getTokens('9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d');
getTokens('9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d', { currency: 'CNY' });


