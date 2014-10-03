var util = require('util');
var querystring = require("querystring");
var SP_MONEY_URL = "https://sp-money.yandex.ru";

base = require("./base.js");
function Wallet(accessToken) {

  this.sendAuthenticatedRequest = function(params, callback) {
    params.headers = {
      "Authorization": "Bearer " + accessToken 
    };
    this.sendUnauthenticatedRequest(params, callback);
  };

  this.accountInfo = function(callback) {
    this.sendAuthenticatedRequest({
      url: "/api/account-info"
    }, callback);
  };

  this.operationHistory = function(options, callback) {
    this.sendAuthenticatedRequest({
      url: "/api/operation-history",
      data: options
    }, callback);
  };

  this.operationDetails = function(operation_id, callback) {
    this.sendAuthenticatedRequest({
      url: "/api/operation-details",
      data: {operation_id: operation_id}
    }, callback);
  };

  this.requestPayment = function(options, callback) {
    this.sendAuthenticatedRequest({
      url: "/api/request-payment",
      data: options
    }, callback);
  };

  this.processPayment = function(options, callback) {
    this.sendAuthenticatedRequest({
      url: "/api/process-payment",
      data: options
    }, callback);
  };
}


Wallet.buildObtainTokenUrl = function (clientId, redirectURI, scope){
  var query_string = querystring.stringify({
    client_id: clientId,
      redirect_uri: redirectURI,
      scope: scope.join(' ')
  });
  return util.format("%s/oauth/authorize?%s", SP_MONEY_URL, query_string);

};

util.inherits(Wallet, base.Base);
module.exports.Wallet = Wallet;
