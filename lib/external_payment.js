base = require("./base.js");

function ExternalPayment(instanceId) {

  this.request = function(options, callback) {
    options.instance_id = instanceId;
    base.sendUnauthenticatedRequest({
      url: "/api/request-external-payment",
      data: options
    }, callback);
  };

  this.process = function(options, callback) {
    options.instance_id = instanceId;
    base.sendUnauthenticatedRequest({
      url: "/api/process-external-payment",
      data: options
    }, callback);
  };

}

ExternalPayment.getInstanceId = function(clientId, callback) {
  base.sendUnauthenticatedRequest({
    "url": "/api/instance-id",
    "data": {
      "client_id": clientId
    }
  }, callback);

};

module.exports = {
  ExternalPayment: ExternalPayment
}
