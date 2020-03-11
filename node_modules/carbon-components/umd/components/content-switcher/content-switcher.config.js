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
    global.contentSwitcherConfig = mod.exports;
  }
})(this, function () {
  'use strict';

  var featureFlags = require('../../globals/js/feature-flags');

  var _require = require('../../globals/js/settings'),
      prefix = _require.prefix;

  var items = [{
    label: 'First section',
    target: '.demo--panel--opt-1',
    selected: true
  }, {
    label: 'Second section',
    target: '.demo--panel--opt-2'
  }, {
    label: 'Third section',
    target: '.demo--panel--opt-3'
  }];
  module.exports = {
    context: {
      featureFlags: featureFlags,
      prefix: prefix
    },
    variants: [{
      name: 'default',
      label: 'Content Switcher',
      notes: "\n        The Content Switcher component manipulates the content shown following an exclusive or \u201Ceither/or\u201D pattern.\n        Create Switch components for each section in the content switcher.\n      ",
      context: {
        items: items
      }
    }, {
      name: 'with-icon',
      label: 'With icon',
      context: {
        hasIcon: true,
        items: items
      }
    }]
  };
});