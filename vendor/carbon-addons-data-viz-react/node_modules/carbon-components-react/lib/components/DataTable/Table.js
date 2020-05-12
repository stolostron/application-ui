"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.Table = void 0;

var _wrapComponent = _interopRequireDefault(require("../../tools/wrapComponent"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Table = (0, _wrapComponent.default)({
  name: 'Table',
  className: ['bx--data-table-v2', 'bx--data-table-v2--zebra'],
  type: 'table'
});
exports.Table = Table;
var _default = Table;
exports.default = _default;