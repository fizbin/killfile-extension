var loadLibrary;
(function(){
  "use strict";
  var loading = {};
  function _loadLibrary(libname) {
    if (!(libname in loading)) {
      loading[libname] = 1;
      var elem = document.createElement("script");
      elem.type = "text/javascript";
      elem.src = libname.toLowerCase() + ".js";
      elem.onload = function () {delete loading[libname];};
      document.head.appendChild(elem);
    }
  }
  loadLibrary = _loadLibrary;
})();

/// Local Variables: ///
/// mode: Javascript ///
/// tab-width: 4 ///
/// indent-tabs-mode: nil ///
/// js-indent-level: 2 ///
/// End: ///
