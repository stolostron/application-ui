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
    global.progressIndicatorConfig = mod.exports;
  }
})(this, function () {
  'use strict';

  var _require = require('../../globals/js/settings'),
      prefix = _require.prefix;

  var _require2 = require('../../globals/js/feature-flags'),
      componentsX = _require2.componentsX;

  var steps = [{
    state: 'complete',
    label: 'First step',
    optional: true,
    optionalLabel: 'Optional'
  }, {
    state: 'current',
    label: 'Second Step',
    overflow: true,
    overflowLabel: 'Overflow Ex. 1'
  }, {
    state: 'incomplete',
    label: 'Third Step',
    overflow: true,
    overflowLabel: 'Overflow Ex. 2 Multi Line'
  }, {
    state: 'incomplete',
    label: 'Fourth step',
    invalid: true
  }, {
    state: 'incomplete',
    label: 'Fifth step',
    disabled: true
  }];
  module.exports = {
    context: {
      prefix: prefix
    },
    variants: [{
      name: 'default',
      label: 'Progress Indicator',
      context: {
        steps: steps,
        componentsX: componentsX
      }
    }]
  };
});