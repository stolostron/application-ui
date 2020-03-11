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