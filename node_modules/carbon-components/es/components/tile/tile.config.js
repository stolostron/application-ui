'use strict';

var featureFlags = require('../../globals/js/feature-flags');

var _require = require('../../globals/js/settings'),
    prefix = _require.prefix;

module.exports = {
  context: {
    featureFlags: featureFlags,
    prefix: prefix
  }
};