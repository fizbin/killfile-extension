// Copyright 2013 Daniel Martin
// All Rights Reserved
// This file and others in the same directory may be
// distributed under the file LICENSE found in this
// directory.

chrome.runtime.sendMessage(
  {type: "init", url: String(location.href)},
  function(response) {
    var matchArray = response;
    window.addEventListener(
      "DOMContentLoaded",
      function() {
        // console.log(document.getElementsByTagName('html')[0].innerHTML);
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
          // console.log("asking for " + match.scenario);
          define("scenariocallback", ["./scenarios"], function(slib) {
            slib.initScenario(match.scenario);
            chrome.runtime.sendMessage({type: "showPageAction"});            
          });
          break;
        }
      });
  });

/// Local Variables: ///
/// mode: Javascript ///
/// tab-width: 4 ///
/// indent-tabs-mode: nil ///
/// js-indent-level: 2 ///
/// End: ///
