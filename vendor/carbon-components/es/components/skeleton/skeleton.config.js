'use strict';

var _require = require('../../globals/js/settings'),
    prefix = _require.prefix;

var tabItems = [{}, {}, {
  selected: true
}];
module.exports = {
  context: {
    prefix: prefix
  },
  variants: [{
    name: 'default',
    label: 'Skeleton',
    context: {
      breadCrumbItems: new Array(3),
      progressIndicatorSteps: new Array(4),
      tabItems: tabItems
    }
  }]
};