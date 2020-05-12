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
    global.textAreaConfig = mod.exports;
  }
})(this, function () {
  'use strict';

  var _require = require('../../globals/js/settings'),
      prefix = _require.prefix;

  module.exports = {
    context: {
      prefix: prefix
    },
    variants: [{
      name: 'default',
      label: 'Text Area',
      notes: "\n        Text areas enable the user to interact with and input data. A text area is used when you\n        anticipate the user to input more than 1 sentence.\n      "
    }, {
      name: 'light',
      label: 'Light',
      context: {
        light: true
      }
    }]
  };
});