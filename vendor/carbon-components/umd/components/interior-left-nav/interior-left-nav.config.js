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
    global.interiorLeftNavConfig = mod.exports;
  }
})(this, function () {
  'use strict';

  var _require = require('../../globals/js/feature-flags'),
      breakingChangesX = _require.breakingChangesX;

  module.exports = {
    meta: {
      removed: breakingChangesX
    },
    hidden: true
  };
});