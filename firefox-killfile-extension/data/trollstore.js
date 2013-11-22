// Copyright 2013 Daniel Martin
// All Rights Reserved
// This file and others in the same directory may be
// distributed under the file LICENSE found in this
// directory.

(typeof define === "function") && define("trollstore", ["sdk/simple-storage"], function (ss) {
  "use strict";

  var trollStore = new (function () {
    var trolls = {};

    if (ss.storage.trolls) {
      trolls = ss.storage.trolls;
    }

    this.syncMaybe = function() {
      ss.storage.trolls = trolls;
    };

    this.addTroll = function(troll) {
      trolls[troll] = 1;
      this.syncMaybe();
      return true;
    };

    this.delTroll = function(troll) {
      delete trolls[troll];
      this.syncMaybe();
      return false;
    };

    this.checkTroll = function(troll) {
      return troll in trolls;
    };
  })();

  return {trollStore: trollStore};
});

/// Local Variables: ///
/// mode: Javascript ///
/// tab-width: 4 ///
/// indent-tabs-mode: nil ///
/// js-indent-level: 2 ///
/// End: ///
