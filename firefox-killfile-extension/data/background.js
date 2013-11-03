// Copyright 2013 Daniel Martin
// All Rights Reserved
// This file and others in the same directory may be
// distributed under the file LICENSE found in this
// directory.

define && define(
  "background", ["./scenariolist", "./trollstore"], function(sllib, tslib) {
    var trollStore = tslib.trollStore;

    function onInitMessage(request, sender, sendResponse) {
      var retval = sllib.findScenarios(request.url);
      if (retval) {
        console.log("Gonna send " + JSON.stringify(retval)
                    + " back to tab at " + request.url);
        sendResponse(retval);
        return true;
      }
      return false;
    }

    function onLoadLibrary(request, sender, sendResponse) { 
      var allFrames = request.allFrames || false;
      chrome.tabs.executeScript(
        sender.tab.id, {file: request.library.toLowerCase()  + '.js',
                        allFrames: allFrames},
        function () {
          sendResponse({});
        });
      return true;
    }
    
    function onShowPageAction(request, sender, sendResponse) {
      chrome.pageAction.show(sender.tab.id);
      return false;
    }

    function onTrollCheck(request, sender, sendResponse) {
      sendResponse({troll: request.troll,
                    isTroll: trollStore.checkTroll(request.troll)});
      return true;
    }

    function onTrollDel(request, sender, sendResponse) {
      sendResponse({troll: request.troll,
                    isTroll: trollStore.delTroll(request.troll)});
      return true;
    }
    
    function onTrollAdd(request, sender, sendResponse) {
      sendResponse({troll: request.troll,
                    isTroll: trollStore.addTroll(request.troll)});
      return true;
    }
    
    var messageFuncs = {init: onInitMessage,
                        loadLibrary: onLoadLibrary,
                        showPageAction: onShowPageAction,
                        trollCheck: onTrollCheck,
                        trollDel: onTrollDel,
                        trollAdd: onTrollAdd}

    function onMessage(request, sender, sendResponse) {
      console.log("Got message: " + JSON.stringify(request));
      if (request.type && messageFuncs[request.type]) {
        return messageFuncs[request.type](request, sender, sendResponse);
      } else {
        console.log("Unintelligible message: " + JSON.stringify(request));
      }
    }

    chrome.runtime.onMessage.addListener(onMessage);
  });

/// Local Variables: ///
/// mode: Javascript ///
/// tab-width: 4 ///
/// indent-tabs-mode: nil ///
/// js-indent-level: 2 ///
/// End: ///
