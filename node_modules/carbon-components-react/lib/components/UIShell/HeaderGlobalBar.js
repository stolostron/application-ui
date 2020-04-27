"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _carbonComponents = require("carbon-components");

var _wrapComponent = _interopRequireDefault(require("../../tools/wrapComponent"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var prefix = _carbonComponents.settings.prefix;
/**
 * Generic container for `HeaderGlobalAction` components
 */

var _default = (0, _wrapComponent.default)({
  name: 'HeaderGlobalBar',
  className: "".concat(prefix, "--header__global"),
  type: 'div'
});

exports.default = _default;