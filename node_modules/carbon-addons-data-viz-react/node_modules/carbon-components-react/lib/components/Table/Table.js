"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _propTypes = _interopRequireDefault(require("prop-types"));

var _react = _interopRequireDefault(require("react"));

var _classnames = _interopRequireDefault(require("classnames"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

var Table = function Table(props) {
  var children = props.children,
      className = props.className,
      containerClassName = props.containerClassName,
      other = _objectWithoutProperties(props, ["children", "className", "containerClassName"]);

  var tableClasses = (0, _classnames.default)(className, 'bx--responsive-table');
  var tableContainerClasses = (0, _classnames.default)(containerClassName, 'bx--responsive-table-container');
  return _react.default.createElement("div", {
    className: tableContainerClasses
  }, _react.default.createElement("table", _extends({}, other, {
    className: tableClasses,
    style: {
      borderCollapse: 'collapse',
      borderSpacing: 0
    }
  }), children));
};

Table.propTypes = {
  children: _propTypes.default.node,
  className: _propTypes.default.string,
  containerClassName: _propTypes.default.string
};
var _default = Table;
exports.default = _default;