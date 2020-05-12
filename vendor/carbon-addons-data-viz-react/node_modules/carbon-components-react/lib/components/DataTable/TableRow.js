"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _lodash = _interopRequireDefault(require("lodash.omit"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var TableRow = function TableRow(props) {
  // Remove unnecessary props if provided to this component, these are
  // only useful in `TableExpandRow`
  var cleanProps = (0, _lodash.default)(props, ['ariaLabel', 'onExpand', 'isExpanded']);
  return _react.default.createElement("tr", cleanProps);
};

var _default = TableRow;
exports.default = _default;