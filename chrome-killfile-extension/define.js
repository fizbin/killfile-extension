// A simple module system that conforms to part of the API requirejs
// exposes. It depends on the foreign symbol "loadLibrary" already
// being defined.

var define;
(function () {
  "use strict";

  var callbacks = {};
  var defined = {};
  function _define(name, deps, ctor) {
    if (name in defined) {
      return defined[name];
    }
    console.log("Maybe define " + name + "?");
    var args = [];
    for(var i = 0; i < deps.length; i++) {
      if (deps[i] in defined) {
        args.push(defined[deps[i]]);
      } else {
        console.log("Deferring def of " + name + " to wait for " + deps[i]);
        var oldcb = (function () {});
        if (deps[i] in callbacks) {
          oldcb = callbacks[deps[i]];
        }
        callbacks[deps[i]] = (function() {oldcb(); _define(name, deps, ctor);});
        loadLibrary(deps[i]);
        return 0;
      }
    }
    var ctorResult = ctor.apply(ctor, args);
    defined[name] = ctorResult;
    if (name in callbacks) {
      var cb = callbacks[name];
      delete callbacks[name];
      cb();
    }
    return ctorResult;
  }

  define = _define;
})();

/// Local Variables: ///
/// mode: Javascript ///
/// tab-width: 4 ///
/// indent-tabs-mode: nil ///
/// js-indent-level: 2 ///
/// End: ///
