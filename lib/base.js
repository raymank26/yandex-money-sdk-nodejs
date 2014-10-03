var request = require('request');
var querystring = require("querystring");

var MONEY_URL = "https://money.yandex.ru";
var SP_MONEY_URL = "https://sp-money.yandex.ru";
function Base() {

}

Base.prototype.sendUnauthenticatedRequest = function (params, callback) {
  var headers = params.headers || {};
  var data = params.data || {};
  var url = params.url;

  request.post({
    url: MONEY_URL + url, 
    headers: headers || {},
    form: data || {},
  }, this.processResponse(callback));
};

Base.prototype.processResponse = function (callback) {
  return function httpCallback(error, response, body) {
    if(error) {
      callback(error);
    }
    switch(response.statusCode) {
      case 400: 
        callback(new Error("Format error"));
        break;
      case 401:
        callback(new Error("Token error"));
        break;
      case 403:
        callback(new Error("Scope error"));
        break;
      default: 
        callback(null, JSON.parse(body), response);
    }
  };
};

module.exports.Base = Base;
