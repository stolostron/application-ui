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
    global.footerConfig = mod.exports;
  }
})(this, function () {
  'use strict';

  var _require = require('../../globals/js/settings'),
      prefix = _require.prefix;

  var items = [{
    title: 'Need Help?',
    label: 'Contact Bluemix Sales'
  }, {
    title: 'Estimate Monthly Cost',
    label: 'Cost Calculator'
  }];
  module.exports = {
    meta: {
      useIframe: true
    },
    context: {
      prefix: prefix
    },
    variants: [{
      name: 'default',
      label: 'Footer',
      notes: "\n        Footer is used on configuration screens.\n      ",
      context: {
        items: items
      }
    }]
  };
});