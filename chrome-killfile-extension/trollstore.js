// Copyright 2013 Daniel Martin
// All Rights Reserved
// This file and others in the same directory may be
// distributed under the file LICENSE found in this
// directory.

define("trollstore", [], function () {
  "use strict";
  var trollStore = new (function () {
    var trolls = {};
    var deletedTrolls = {};
    var addedTrolls = {};
    var lastSyncTime = 0;

    chrome.storage.local.get(
      {"trolls": trolls,
       "addedTrolls": addedTrolls,
       "deletedTrolls": deletedTrolls,
       "lastSyncTime" : lastSyncTime},
      function(localResults) {
        trolls = localResults.trolls;
        addedTrolls = localResults.addedTrolls;
        deletedTrolls = localResults.deletedTrolls;
        lastSyncTime = localResults.lastSyncTime;
      }
    );

    var trollStoreRef = this;

    this.syncMaybe = function() {
      chrome.storage.local.set(
        {"trolls": trolls,
         "addedTrolls": addedTrolls,
         "deletedTrolls": deletedTrolls,
         "lastSyncTime" : lastSyncTime});
      var nowsecs = Math.round((new Date()).getTime()/1000);
      if (nowsecs > 15 + lastSyncTime) {
        lastSyncTime = nowsecs - 10;
        chrome.storage.sync.get(
          {"trollKeys": []},
          function(results) {
            var trollKeys = results.trollKeys;
            var storedTrolls = {}
            var getKeys = {}
            for (var i = 0; i < trollKeys.length; i++) {
              getKeys[trollKeys[i]] = [];
            }
            chrome.storage.sync.get(
              getKeys,
              function(results) {
                var founddiff = false;
                for (var i = 0; i < trollKeys.length; i++) {
                  var trollList = results[trollKeys[i]];
                  for (var j = 0; j < trollList.length; j++) {
                    var troll = trollList[j];
                    if (troll in deletedTrolls) {
                      founddiff = true;
                    } else {
                      storedTrolls[troll] = 1;
                    }
                  }
                }
                for (var troll in addedTrolls) {
                  if (! (troll in storedTrolls)) {
                    founddiff = true;
                    storedTrolls[troll] = 1;
                  }
                }
                if (!founddiff) {
                  trolls = storedTrolls;
                  deletedTrolls = {};
                  addedTrolls = {};
                  lastSyncTime = nowsecs;
                  trollStoreRef.syncMaybe();
                  return;
                }
                var allTrollsNow = Object.keys(storedTrolls);
                allTrollsNow.sort();
                var trollKeyIndex = 0;
                var trollKeyLength = 2;
                var setKeys = {};
                setKeys['troll' + trollKeyIndex] = [];
                for (var i = 0; i < allTrollsNow.length; i++) {
                  var troll = allTrollsNow[i];
                  if (3 + troll.length + trollKeyLength > 4000) {
                    trollKeyIndex++;
                    trollKeyLength=0;
                    setKeys['troll' + trollKeyIndex] = [];
                  }
                  setKeys['troll' + trollKeyIndex].push(troll);
                  trollKeyLength += 3 + troll.length;
                }
                trollKeys = Object.keys(setKeys);
                setKeys['trollKeys'] = trollKeys;
                // TODO: fix race condition that exists between
                // here and set callback
                chrome.storage.sync.set(
                  setKeys,
                  function () {
                    console.log('Saved!');
                    var lastError = chrome.runtime.lastError;
                    if (lastError) {
                      console.error("Err storing trolls: "
                                    + JSON.stringify(lastError));
                    } else {
                      trolls = storedTrolls;
                      deletedTrolls = {};
                      addedTrolls = {};
                      lastSyncTime = nowsecs;
                      trollStoreRef.syncMaybe();
                    }
                  });
              });
          });
      }
    };
    this.addTroll = function(troll) {
      trolls[troll] = 1;
      addedTrolls[troll] = 1;
      delete deletedTrolls[troll];
      this.syncMaybe();
      chrome.alarms.create('troll-resave', {delayInMinutes: 1.0});
      return true;
    };
    this.delTroll = function(troll) {
      delete trolls[troll];
      delete addedTrolls[troll];
      deletedTrolls[troll] = 1;
      this.syncMaybe();
      chrome.alarms.create('troll-resave', {delayInMinutes: 1.0});
      return false;
    };
    this.checkTroll = function(troll) {
      this.syncMaybe();
      return troll in trolls;
    };
  })();
  
  function onAlarm(alarm) {
    if (alarm.name == "troll-resave") {
      trollStore.syncMaybe();
    } else {
      console.warn("Unknown alarm name " + alarm.name);
    }
  }
  chrome.alarms.onAlarm.addListener(onAlarm);

  return {trollStore: trollStore};
});

/// Local Variables: ///
/// mode: Javascript ///
/// tab-width: 4 ///
/// indent-tabs-mode: nil ///
/// js-indent-level: 2 ///
/// End: ///
