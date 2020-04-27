'use strict';

var _require = require('../../globals/js/settings'),
    prefix = _require.prefix;

var _require2 = require('../../globals/js/feature-flags'),
    breakingChangesX = _require2.breakingChangesX;

module.exports = {
  hidden: true,
  meta: {
    removed: breakingChangesX,
    useIframe: true
  },
  context: {
    prefix: prefix
  }
};