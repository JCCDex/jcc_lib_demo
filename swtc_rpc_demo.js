const Remote = require("@swtc/rpc").Remote;
const remote = new Remote({ server: "http://swtclib.ca:5050" })

const rpcServerState = async () => {
    /**
        server_state-节点状态及最后变化时间

            disconnected：未连接上其他节点
            connected：已经连接上其他节点，准备同步数据
            tracking：当前节点账本落后其他节点
            syncing：正在同步账本
            full：服务(PS)节点正常状态
            validating：共识(VS)节点正在验证账本
            proposing：共识(VS)节点正常状态 
     */
    var res = await remote.rpcServerState();
    console.log("Server state:\n", JSON.stringify(res, null, 2));
};

//最新区块
const rpcLedgerCurrent = async () => {
    var res = await remote.rpcLedgerCurrent();
    console.log("Current ledger:\n", JSON.stringify(res, null, 2));
}

//获取区块
const getLedger = async (param) => {
    var res = await remote.getLedger(param);
    console.log("ledger:\n", JSON.stringify(res, null, 2));
}

//获取交易
const rpcTx = async (param) => {
    var res = await remote.rpcTx(param);
    console.log("tx data:\n", JSON.stringify(res, null, 2));
}


(async () => {
    await rpcServerState();
    console.log("--------------------------");
    await rpcLedgerCurrent();
    console.log("--------------------------");

    // 通过区块号获取区块
    await getLedger({ ledger_index: 18383208 });
    console.log("--------------------------");
    // 通过hash获取区块
    await getLedger({ ledger_hash: "370F378A65110467AA5BE90726AB1673D0777F9BD7A0630694507CC8249EFCA6" });
    console.log("--------------------------");

    通过hash获取区块数据, 包括所有交易hash
    await getLedger({ ledger_hash: "370F378A65110467AA5BE90726AB1673D0777F9BD7A0630694507CC8249EFCA6", transactions: true });
    console.log("--------------------------");

    // 通过hash获取区块数据,包括所有交易明细
    await getLedger({ ledger_hash: "370F378A65110467AA5BE90726AB1673D0777F9BD7A0630694507CC8249EFCA6", transactions: true, expand: true });
    console.log("--------------------------");

    // 通过hash获取交易明细
    await rpcTx({ transaction: "C7D836A5A2C57A5EC228498DCCD0F715360B14B2BBA7581115C048AEDDB86C5E" });
    console.log("--------------------------");

})()
