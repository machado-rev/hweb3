require('dotenv').config();

module.exports = {
  /**
   * Returns the default Althash address.
   * @return {String} Default Althash address.
   */
  getDefaultHtmlAddress: () => {
    if (!process.env.SENDER_ADDRESS) {
      throw Error('Must have SENDER_ADDRESS in .env');
    }
    return String(Buffer.from(process.env.SENDER_ADDRESS));
  },

  /**
   * Returns the Althash network RPC url.
   * @return {String} The Althash network RPC url.
   */
  getHtmlRPCAddress: () => {
    if (!process.env.HTML_RPC_ADDRESS) {
      throw Error('Must have HTML_RPC_ADDRESS in .env');
    }
    return String(Buffer.from(process.env.HTML_RPC_ADDRESS));
  },

  /**
   * Returns the wallet passphrase to unlock the encrypted wallet.
   * @return {String} The wallet passphrase.
   */
  getWalletPassphrase: () => (process.env.WALLET_PASSPHRASE ? String(Buffer.from(process.env.WALLET_PASSPHRASE)) : ''),

  isWalletEncrypted: async (hweb3) => {
    const res = await hweb3.getWalletInfo();
    return Object.prototype.hasOwnProperty.call(res, 'unlocked_until');
  },
};
