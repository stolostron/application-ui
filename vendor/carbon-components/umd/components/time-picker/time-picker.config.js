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
    global.timePickerConfig = mod.exports;
  }
})(this, function () {
  'use strict';

  var _require = require('../../globals/js/settings'),
      prefix = _require.prefix;

  var _require2 = require('../../globals/js/feature-flags'),
      componentsX = _require2.componentsX;

  module.exports = {
    context: {
      componentsX: componentsX,
      prefix: prefix
    },
    variants: [{
      name: 'default',
      label: 'Text Input',
      context: {
        light: false,
        componentsX: componentsX
      }
    }, {
      name: 'light',
      label: 'Text Input (Light)',
      context: {
        light: true,
        componentsX: componentsX
      }
    }]
  };
});