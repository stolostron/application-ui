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
    global.gridConfig = mod.exports;
  }
})(this, function () {
  'use strict';

  var _require = require('../../globals/js/settings'),
      prefix = _require.prefix;

  module.exports = {
    meta: {
      useIframe: true
    },
    context: {
      prefix: prefix
    },
    variants: [{
      name: 'default',
      label: 'Grid'
    }]
  };
});