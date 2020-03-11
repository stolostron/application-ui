(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define([], factory);
  } else if (typeof exports !== "undefined") {
    factory();
  } else {
    var mod = {
      exports: {}
    };
    factory();
    global.tooltipConfig = mod.exports;
  }
})(this, function () {
  'use strict';

  var featureFlags = require('../../globals/js/feature-flags');

  var _require = require('../../globals/js/settings'),
      prefix = _require.prefix;

  module.exports = {
    context: {
      featureFlags: featureFlags,
      prefix: prefix
    }
  };
});