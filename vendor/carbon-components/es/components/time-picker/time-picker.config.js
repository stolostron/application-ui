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