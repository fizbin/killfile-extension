(typeof define === "function") && define("clientUtil", [], function() {
  var msgCount = 0;
  return {sendMessage: function(msg, responseFn) {
    msgCount++;
    var responseChannel = "Response_" + msgCount;
    self.port.once(responseChannel, responseFn);
    msg._responseChannel = responseChannel;
    self.postMessage(msg);
  }};
});

/// Local Variables: ///
/// mode: Javascript ///
/// tab-width: 4 ///
/// indent-tabs-mode: nil ///
/// js-indent-level: 2 ///
/// End: ///
