(function() {
  function handleMessage(matchArray) {
    for (var i=0; i < matchArray.length; i++) {
      var match = matchArray[i];
      if (match.xpath) {
        var found = document.evaluate(
          match.xpath, document,
          null, XPathResult.BOOLEAN_TYPE, null);
        if (found) {
          found = found.booleanValue;
        }
        if (! found) {
          continue;
        }
      }
      console.log("asking for " + match.scenario);
      self.postMessage({scenario: match.scenario});
      break;
    }
  }
  self.on("message", function(msg) {
    if (document.readyState !== "loading") {
      handleMessage(msg);
    } else {
      document.addEventListener("DOMContentLoaded", function(event) {
        handleMessage(msg);
      });
    }
  });
})();
