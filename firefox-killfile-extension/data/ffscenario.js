(typeof define === "function") && define("ffscenario", ["./scenarios"], function(scenarios) {
  if (self.options && self.options.scenario) {
    scenarios.initScenario(self.options.scenario);
  } else {
    console.log("No scenario given!");
  }
});

/// Local Variables: ///
/// mode: Javascript ///
/// tab-width: 4 ///
/// indent-tabs-mode: nil ///
/// js-indent-level: 2 ///
/// End: ///
