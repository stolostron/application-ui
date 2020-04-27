"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _Icon = _interopRequireDefault(require("../Icon"));

var _classnames = _interopRequireDefault(require("classnames"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

var TooltipSimple = function TooltipSimple(_ref) {
  var children = _ref.children,
      className = _ref.className,
      position = _ref.position,
      text = _ref.text,
      showIcon = _ref.showIcon,
      iconName = _ref.iconName,
      iconDescription = _ref.iconDescription,
      other = _objectWithoutProperties(_ref, ["children", "className", "position", "text", "showIcon", "iconName", "iconDescription"]);

  var tooltipClasses = (0, _classnames.default)("bx--tooltip--simple__".concat(position));
  var tooltipWrapperClasses = (0, _classnames.default)("bx--tooltip--simple", className);
  return _react.default.createElement("div", null, showIcon ? _react.default.createElement("div", {
    className: tooltipWrapperClasses
  }, children, _react.default.createElement("div", _extends({
    className: tooltipClasses,
    "data-tooltip-text": text,
    tabIndex: "0",
    role: "button"
  }, other), _react.default.createElement(_Icon.default, {
    role: "img",
    name: iconName,
    description: iconDescription
  }))) : _react.default.createElement("div", {
    className: tooltipWrapperClasses
  }, _react.default.createElement("div", _extends({
    className: tooltipClasses,
    "data-tooltip-text": text,
    tabIndex: "0",
    role: "button"
  }, other), children)));
};

TooltipSimple.propTypes = {
  children: _propTypes.default.node,
  className: _propTypes.default.string,
  position: _propTypes.default.oneOf(['bottom', 'top']),
  text: _propTypes.default.string.isRequired,
  showIcon: _propTypes.default.bool,
  iconName: _propTypes.default.string,
  iconDescription: _propTypes.default.string
};
TooltipSimple.defaultProps = {
  position: 'top',
  showIcon: true,
  iconName: 'info--glyph',
  iconDescription: 'tooltip',
  text: 'Provide text'
};
var _default = TooltipSimple;
exports.default = _default;