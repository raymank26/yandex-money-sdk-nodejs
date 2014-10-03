var wallet = require("./lib/wallet.js");
var externalPayment = require("./lib/external_payment.js");

module.exports = {
  Wallet: wallet.Wallet,
  ExternalPayment: externalPayment.ExternalPayment
};
