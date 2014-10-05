[![Build Status](https://travis-ci.org/raymank26/yandex-money-sdk-nodejs.svg?branch=master)]
    (https://travis-ci.org/raymank26/yandex-money-sdk-nodejs)
[![Coverage Status](https://coveralls.io/repos/raymank26/yandex-money-sdk-nodejs/badge.png?branch=master)]
    (https://coveralls.io/r/raymank26/yandex-money-sdk-nodejs?branch=master)
# NodeJS Yandex.Money API SDK

## Requirements

1. requests == 2.9.x

## Links

1. Yandex.Money API page: [Ru](http://api.yandex.ru/money/),
[En](http://api.yandex.com/money/)

## Getting started

### Installation

Simply run `npm install yandex-money-sdk`

### Payments from the Yandex.Money wallet

Using Yandex.Money API requires following steps

1. Obtain token URL and redirect user's browser to Yandex.Money service.
Note: `client_id`, `redirect_uri`, `client_secret` are constants that you get,
when [register](https://sp-money.yandex.ru/myservices/new.xml) app in Yandex.Money API.

    ```javascript
    var yandexMoney = require("yandex-money");
    // scope is array(e.g. scope = ['account-info', 'operation-history'])
    url = yandexMoney.Wallet.buildObtainTokenUrl(clientId, redirectURI, scope);
    // redirect user to url
    ```

2. After that, user fills Yandex.Money HTML form and user is redirected back to
`REDIRECT_URI?code=CODE`.

3. You should immediately exchange `CODE` with `ACCESS_TOKEN`.

    ```javascript
    function tokenComplete(err, data) {
        if(err) {
            // process error
        }
        var access_token = data.access_token;
        // save it to DB, config, etc..
    }
    yandexMoney.Wallet.getAccessToken(clientId, code, redirectURI, clientSecret,
        tokenComplete);
    ```

4. Now you can use Yandex.Money API.

    ```javascript
    var api = yandexMoney.Wallet(access_token);

    // get account info
    api.accountInfo(function infoComplete(err, data) {
        if(err) {
            // process error
        }
        // process data
        var balance = data.balance;
        var user_account = data.account;
        // etc..
    });

    // fetch last 3 records of operation history
    api.operationHistory(function operationHisComplete(err, data) {
        if(err) {
            // process error
        }
        // process data
        var opertaions = data.operations;
        var first_title = operations[0].title;
        // etc..
    });

    //make request payment and process it
    var options = {
        "pattern_id": "p2p",
        "to": "410011161616877",
        "amount_due": "0.02",
        "comment": "test payment comment from yandex-money-nodejs",
        "message": "test payment message from yandex-money-nodejs",
        "label": "testPayment",
        "test_payment": true,
        "test_result": "success"
    };
    api.requestPayment(options, function requestComplete(err, data) {
        if(err) {
            // process error
        }
        if(data.status !== "success") {
            // process failure
        }
        var request_id = data.request_id;

        api.processPayment({
            "request_id": request_id
            }, processComplete);
    });

    function processComplete(err, data) {
        if(err) {
            // process error
        }
        // process status
    }
    ```

### Payments from bank cards without authorization

1. Fetch instantce-id(ussually only once for every client. You can store
result in DB).

    ```javascript 
    yandexMoney.ExternalPayment.getInstanceId(clientId,
            function getInstanceComplete(err, data) {
        if(err) {
            // process error
        }
        var instanceId = data.instance_id;
        // save it to DB
    
    });
    ```

2. Make request payment

    ```javascript 
    var external_payment = yandexMoney.ExternalPayment(instanceId)

    var options = {
        // pattern_id, etc..
    };

    externalPayment.request(options, function requestComplete(err, data) {
        if(err) {
            // process error
        }
        var requestId = data.request_id;
    });
    ```

3. Process the request with process-payment. 

    ```javascript 
    external_payment.process({"request_id": requestId}, function (err, data) {
        if(err) {
            // process error
        }
        // process data
    });
    ```

## Side notes

1. Each API function recieves a callback in args `err`, `data` and `response`.
Where `err` is equal to `null` when status of response is `2**`, `data` is JSONed
response and `response` is a full server response(you can check
`response.statusCode` for example).

## Running tests

1. Clone this repo, install deps and devDeps.
2. Create `test/constants.js` using `test/constants.js.sample` as a template. 
3. Run `npm run test` and check the output.
