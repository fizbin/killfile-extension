var loadLibrary;
(function(){
  "use strict";
  var loading = {};
  function _loadLibrary(libname) {
    if (!(libname in loading)) {
      loading[libname] = 1;
      var allFrames = (window.self !== window.top);
      chrome.runtime.sendMessage({type: "loadLibrary", library: libname,
                                  allFrames: allFrames},
                                 function() {delete loading[libname];});
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
