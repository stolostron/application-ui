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