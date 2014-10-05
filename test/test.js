var assert = require("assert");
var yandex_money = require("../index");
var constants = require("./constants");

var accessToken = constants.accessToken;
var clientId = constants.clientId;

var Wallet = yandex_money.Wallet;
var ExternalPayment = yandex_money.ExternalPayment;

describe('Wallet', function(){
  this.timeout(5000);

  describe('#utils', function(){
    it('should return auth url for browser redirect', function(){
      var clientId = "clientId";
      var redirectURI = "redirectURI";
      var scope = ['account-info', 'operation-history'];
      var url = Wallet.buildObtainTokenUrl(clientId, redirectURI, scope);
    });

    it("should exchange code to access token(fake)", function(done) {
      Wallet.getAccessToken("client id", "code", "redirect uri", null,
        function (error, data, response) {
          assert.equal(response.statusCode, 200);
          done();
        });
    });
  });

  describe("#accountInfo", function () {
    it("should return account information", function (done) {
      var wallet = new Wallet(accessToken);
      wallet.accountInfo(function myCallback(error, data, response) {
        assert.equal(response.statusCode, 200);
        done();
      });
    });
  });

  describe("#operationHistory", function () {
    it("should return operation history", function (done) {
      var wallet = new Wallet(accessToken);
      wallet.operationHistory({records: 3},
          function myCallback(error, data, response) {
        //console.log(data);
        assert.equal(response.statusCode, 200);
        done();
      });
    });
  });

  describe("#operationDetails", function () {
    it("should return operation history(fake)", function (done) {
      var wallet = new Wallet(accessToken);
      wallet.operationDetails("some operation id",
          function myCallback(error, data, response) {
        //console.log(data);
        // yandex api always returns 200 if request is correct
        assert.equal(response.statusCode, 200);
        done();
      });
    });
  });

  describe("#payment", function () {
    var wallet = new Wallet(accessToken);
    var request_id;

    it("should make a request payment ", function (done) {
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
      wallet.requestPayment(options,
        function myCallback(error, data, response) {
          assert.equal(response.statusCode, 200);
          request_id = data.request_id;
          done();
      });
    });

    it("should make a response payment", function (done) {
      wallet.processPayment({
        request_id: request_id,
        test_payment: true,
        test_result: "success"
      }, function myCallback(error, data, response) {
        assert.equal(data.status, "success");
        done();
      });
    });
  });

  describe("#transfer", function () {

    it("should accept incoming transfer(fake)", function (done) {
      var wallet = new Wallet(accessToken);
      wallet.incomingTransferAccept("some operation id", null,
        function myCallback(error, data, response) {
          //console.log(data);
          assert.equal(response.statusCode, 200);
          done();
        });
    });

    it("should reject incoming transfer(fake)", function (done) {
      var wallet = new Wallet(accessToken);
      wallet.incomingTransferReject("some operation id",
        function myCallback(error, data, response) {
          assert.equal(response.statusCode, 200);
          done();
        });
    });
    
  });
});

describe("External payment", function () {
  var request_id = null;
  var instance_id = null;
  describe("#getInstanceId", function () {
    it("should get instance id", function(done) {
      ExternalPayment.getInstanceId(clientId, function(error, data) {
        assert.equal(data.status, "success");
        instance_id = data.instance_id;
        done();
      });
    });
  });

  describe("#request", function () {
    it("should make request external payment", function(done) {
      var requestComplete = function (error, data, response) {
        assert.equal(response.statusCode, 200);
        request_id = data.request_id;
        //assert.equal(data.request_id, "p2p-test");
        // TODO: add assertion
        done();
      };
      var requestOptions = {
        "pattern_id": "p2p",
        "to": "410011161616877",
        "amount_due": "0.02",
        "comment": "test payment comment from yandex-money-nodejs",
        "message": "test payment message from yandex-money-nodejs",
        "label": "testPayment",
      };
      var api = new ExternalPayment(instance_id);
      api.request(requestOptions, requestComplete);
    });
  });

  describe("#process", function () {
    it("should make a process payment", function (done) {
      var api = new ExternalPayment(instance_id);
      var processComplete = function (error, data, response) {
        assert.equal(response.statusCode, 200);
        assert.equal(data.status, "ext_auth_required");
        done();

      };
      api.process({
        request_id: request_id,
        ext_auth_success_uri: "http://lcoalhost:8000",
        ext_auth_fail_uri: "http://localhost:8000"
      }, processComplete);
    });
    
  });

  describe("#exceptions", function () {
    it("should return TokenError in Wallet.revokeToken", function (done) {
      var api = new Wallet("somemisspelledtoken");
      Wallet.revokeToken("somemisspelledtoken", null,
          function myCallback (error) {
        assert.equal(error.message, "Token error");
        done();
      });
    });

    it("should return ScopeError", function (done) {
      var api = new Wallet("some invalid token");
      api.accountInfo(function myCallback (error) {
        assert.equal(error.message, "Format error");
        done();
      });
    });
    
  });
  
});

