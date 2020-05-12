'use strict';

var _require = require('../../globals/js/settings'),
    prefix = _require.prefix;

module.exports = {
  context: {
    prefix: prefix
  },
  variants: [{
    name: 'default',
    label: 'Unordered',
    context: {
      tag: 'ul',
      type: 'unordered',
      displayType: 'Unordered'
    }
  }, {
    name: 'ordered',
    label: 'Ordered',
    context: {
      tag: 'ol',
      type: 'ordered',
      displayType: 'Ordered'
    }
  }]
};