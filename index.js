var util = requre('util');
var request = require('request');
var querystring = require("querystring");

var MONEY_URL = "https://money.yandex.ru";
var SP_MONEY_URL = "https://sp-money.yandex.ru";

function merge_options(obj1,obj2){
    var obj3 = {};
    var attrname;
    for (attrname in obj1) { obj3[attrname] = obj1[attrname]; }
    for (attrname in obj2) { obj3[attrname] = obj2[attrname]; }
    return obj3;
}

function sendUnauthenticatedRequest (params){
    var headers = params.headers || {};
    var data = params.data || {};
    var url = params.url;
    var callback = params.callback;

    request.post({
        url: SP_MONEY_URL + url, 
        headers: headers || {},
        data: data || {}
    }, processResponse(callback));
}

function sendAuthenticatedRequest(params) {
    params.headers = {
        "Authorization": "Bearer " + params.authToken
    };
    sendUnauthenticatedRequest(params);
}

function processResponse(callback) {
    return function httpCallback(error, response, body) {
        if(error) {
            callback(error);
        }
        switch(response.statusCode) {
            case 400: 
                break;
            case 401:
                break;
            case 403:
                break;
            default: 
                callback(null, response, body);
        }
    };
}

function Wallet(accessToken) {
    var sar = sendUnauthenticatedRequest;
    this.accountInfo = function(callback) {
        sar({
            url: "/api/account-info"
        }, callback);
    };
}

Wallet.prototype.buildObtainTokenUrl = function (clientId, redirectURI, scope){
    var query_string = querystring.stringify({
        client_id: client_id,
        redirect_uri: redirectURI,
        scope: scope.join(' ')
    });
    return util.format("%s/oauth/authorize?%s", SP_MONEY_URL, query_string);

};
module.exports = {
    Wallet: Wallet
};
