'use strict';

var _require = require('../../globals/js/settings'),
    prefix = _require.prefix;

module.exports = {
  context: {
    prefix: prefix
  },
  variants: [{
    name: 'default',
    label: 'Breadcrumb',
    notes: 'Breadcrumb enables users to quickly see their location within a path of navigation and move up to a parent level if desired.',
    context: {
      items: [{
        label: 'Breadcrumb 1'
      }, {
        label: 'Breadcrumb 2'
      }, {
        label: 'Breadcrumb 3'
      }]
    }
  }]
};