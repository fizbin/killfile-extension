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
      var resolvedDep = deps[i];
      if (/^\./.test(resolvedDep)) {
        resolvedDep = name.replace(/[^\/]*$/, '') + resolvedDep;
        while (/\/\.\.\//.test(resolvedDep)) {
          resolvedDep = resolvedDep.replace(/[^\/.]*\/\.\.\//, '', 'g');
        }
        while (/(^|\/)\.\//.test(resolvedDep)) {
          resolvedDep = resolvedDep.replace(/\/\.\//, '/', 'g');
          resolvedDep = resolvedDep.replace(/^\.\//, '', 'g');
        }
      }
      if (resolvedDep in defined) {
        args.push(defined[resolvedDep]);
      } else {
        console.log("Deferring def of " + name + " to wait for " + resolvedDep);
        var oldcb = (function () {});
        if (resolvedDep in callbacks) {
          oldcb = callbacks[resolvedDep];
        }
        callbacks[resolvedDep] = (function() {oldcb();
                                              _define(name, deps, ctor);});
        loadLibrary(resolvedDep);
        return 0;
      }
    }
    var module = {name: name, exports: {}};
    var genresult = ctor.apply(module, args);
    if (genresult) {
      module.exports = genresult;
    }
    defined[name] = module.exports;
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
