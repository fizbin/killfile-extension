var loadLibrary;
(function(){
  //"use strdict";
  var loading = {};
  function _loadLibrary(libname) {
    console.warn("Asked to load " + libname
                 + " - check dependency computation");
  }
  loadLibrary = _loadLibrary;
  console.log("loadLibrary?");
})();

/// Local Variables: ///
/// mode: Javascript ///
/// tab-width: 4 ///
/// indent-tabs-mode: nil ///
/// js-indent-level: 2 ///
/// End: ///
