'use strict';

function _objectSpread(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i] != null ? arguments[i] : {};
    var ownKeys = Object.keys(source);

    if (typeof Object.getOwnPropertySymbols === 'function') {
      ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) {
        return Object.getOwnPropertyDescriptor(source, sym).enumerable;
      }));
    }

    ownKeys.forEach(function (key) {
      _defineProperty(target, key, source[key]);
    });
  }

  return target;
}

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
}

var featureFlags = require('../../globals/js/feature-flags');

var _require = require('../../globals/js/settings'),
    prefix = _require.prefix;

var _require2 = require('../../globals/js/feature-flags'),
    componentsX = _require2.componentsX;

var itemsPerPageChoices = [{
  value: '10',
  label: '10',
  selected: true
}, {
  value: '20',
  label: '20'
}, {
  value: '30',
  label: '30'
}, {
  value: '40',
  label: '40'
}, {
  value: '50',
  label: '50'
}];
var pageNumberChoices = [{
  value: '1',
  label: '1',
  selected: true,
  totalPages: 5
}, {
  value: '2',
  label: '2'
}, {
  value: '3',
  label: '3'
}, {
  value: '4',
  label: '4'
}, {
  value: '5',
  label: '5'
}];
var variants = [{
  name: 'default',
  label: 'V1',
  context: {
    itemsPerPageChoices: itemsPerPageChoices,
    version: 'v1'
  },
  notes: "\n        Pagination is used for splitting up content or data into several pages, with a control for navigating to the next or previous page.\n      "
}, {
  name: 'v2',
  label: 'V2',
  context: {
    version: 'v2',
    itemsPerPageChoices: itemsPerPageChoices
  }
}].filter(function (variant) {
  if (componentsX) {
    return variant.context.version !== 'v2';
  }

  return variant;
}).map(function (variant, index) {
  if (index === 0) {
    return _objectSpread({}, variant, {
      name: 'default'
    });
  }

  return variant;
});
module.exports = {
  context: {
    featureFlags: featureFlags,
    prefix: prefix,
    pageNumberChoices: pageNumberChoices
  },
  variants: variants
};