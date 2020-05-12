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

var Checkbox = function Checkbox(_ref) {
  var className = _ref.className,
      id = _ref.id,
      labelText = _ref.labelText,
      _onChange = _ref.onChange,
      indeterminate = _ref.indeterminate,
      hideLabel = _ref.hideLabel,
      wrapperClassName = _ref.wrapperClassName,
      other = _objectWithoutProperties(_ref, ["className", "id", "labelText", "onChange", "indeterminate", "hideLabel", "wrapperClassName"]);

  var input;
  var labelClasses = (0, _classnames.default)('bx--checkbox-label', className);
  var innerLabelClasses = (0, _classnames.default)({
    'bx--visually-hidden': hideLabel
  });
  var wrapperClasses = (0, _classnames.default)('bx--form-item', 'bx--checkbox-wrapper', wrapperClassName);
  return _react.default.createElement("div", {
    className: wrapperClasses
  }, _react.default.createElement("input", _extends({}, other, {
    type: "checkbox",
    onChange: function onChange(evt) {
      _onChange(input.checked, id, evt);
    },
    className: "bx--checkbox",
    id: id,
    ref: function ref(el) {
      input = el;

      if (input) {
        input.indeterminate = indeterminate;
      }
    }
  })), _react.default.createElement("label", {
    htmlFor: id,
    className: labelClasses
  }, _react.default.createElement("span", {
    className: innerLabelClasses
  }, labelText)));
};

Checkbox.propTypes = {
  checked: _propTypes.default.bool,
  defaultChecked: _propTypes.default.bool,
  indeterminate: _propTypes.default.bool,

  /**
   * The CSS class name to be placed on inner label element.
   */
  className: _propTypes.default.string,
  disabled: _propTypes.default.bool,
  id: _propTypes.default.string.isRequired,
  labelText: _propTypes.default.node.isRequired,
  hideLabel: _propTypes.default.bool,
  onChange: _propTypes.default.func,

  /**
   * The CSS class name to be placed on the wrapping element
   */
  wrapperClassName: _propTypes.default.string
};
Checkbox.defaultProps = {
  onChange: function onChange() {},
  indeterminate: false
};
var _default = Checkbox;
exports.default = _default;