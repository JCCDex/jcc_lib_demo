/**
 *   jcc_wallet 是井畅为数字交换平台设计的钱包处理工具，目前可以处理jingtum, moac, ethereum, bvcadt、stm, call以及biz链的钱包创建和校验
 *   各个子工具用法如下:
 * - [jtWallet] (https://github.com/JCCDex/jcc_wallet/blob/master/docs/jingtum.md)
 * - [callWallet] (https://github.com/JCCDex/jcc_wallet/blob/master/docs/call.md)
 * - [stmWallet] (https://github.com/JCCDex/jcc_wallet/blob/master/docs/stream.md)
 * - [ethWallet] (https://github.com/JCCDex/jcc_wallet/blob/master/docs/ethereum.md)
 * - [moacWallet] (https://github.com/JCCDex/jcc_wallet/blob/master/docs/moac.md)
 * - [rippleWallet] (https://github.com/JCCDex/jcc_wallet/blob/master/docs/ripple.md)
 * - [bvcadtWallet] (https://github.com/JCCDex/jcc_wallet/blob/master/docs/bvcadt.md)
 * - [JingchangWallet] (https://github.com/JCCDex/jcc_wallet/blob/master/docs/jingchang.md)
 */
const { bvcadtWallet, callWallet, ethWallet, jtWallet, moacWallet, rippleWallet, stmWallet } = require("jcc_wallet");

/**
 * 函数 **Wallet.createWallet() 生成钱包并返回，如:{secret:******, address:******}
 * secret: 数字钱包密钥,密钥(非常、非常、非常)重要而且要保护好，一旦丢失将无法找回，密钥丢失也就意味着您的数字资产丢失
 * address: 数字钱包地址，该地址可以由secret导出，
 */
const createWallet = async () => {

    //创建swtc公链钱包，创建的钱包如果要投入使用，需要激活，找朋友赠送或者购买的方式向钱包转20个swtc即可激活
    let _jtWallet = await jtWallet.createWallet();
    console.log("_jtWallet:", _jtWallet);

    //创建moac公链钱包
    let _moacWallet = await moacWallet.createWallet();
    console.log("_moacWallet: ", _moacWallet);

    //创建ripple(瑞波)钱包
    let _rippleWallet = await rippleWallet.createWallet();
    console.log("_rippleWallet:", _rippleWallet);

    //创建eth(以太)钱包
    let _ethWallet = await ethWallet.createWallet();
    console.log("_ethWallet:", _ethWallet);

    //创建bvcad联盟链钱包
    let _bvcadtWallet = await bvcadtWallet.createWallet();
    console.log("_bvcadtWallet:", _bvcadtWallet);

    //创建call链钱包
    let _callWallet = await callWallet.createWallet();
    console.log("_callWallet:", _callWallet);

    //创建stm链钱包
    let _stmWallet = await stmWallet.createWallet();
    console.log("_stmWallet:", _stmWallet);

};

createWallet();
