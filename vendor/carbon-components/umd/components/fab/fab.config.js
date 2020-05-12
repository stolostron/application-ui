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
    global.fabConfig = mod.exports;
  }
})(this, function () {
  'use strict';

  var _require = require('../../globals/js/settings'),
      prefix = _require.prefix;

  var _require2 = require('../../globals/js/feature-flags'),
      breakingChangesX = _require2.breakingChangesX;

  module.exports = {
    hidden: true,
    meta: {
      removed: breakingChangesX
    },
    context: {
      prefix: prefix
    }
  };
});