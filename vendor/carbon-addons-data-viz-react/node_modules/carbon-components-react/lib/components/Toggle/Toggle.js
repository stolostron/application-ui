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

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

var Toggle = function Toggle(_ref) {
  var className = _ref.className,
      defaultToggled = _ref.defaultToggled,
      toggled = _ref.toggled,
      _onChange = _ref.onChange,
      onToggle = _ref.onToggle,
      id = _ref.id,
      labelA = _ref.labelA,
      labelB = _ref.labelB,
      other = _objectWithoutProperties(_ref, ["className", "defaultToggled", "toggled", "onChange", "onToggle", "id", "labelA", "labelB"]);

  var input;
  var wrapperClasses = (0, _classnames.default)(_defineProperty({
    'bx--form-item': true
  }, className, className));
  var checkedProps = {};

  if (typeof toggled !== 'undefined') {
    checkedProps.checked = toggled;
  } else {
    checkedProps.defaultChecked = defaultToggled;
  }

  return _react.default.createElement("div", {
    className: wrapperClasses
  }, _react.default.createElement("input", _extends({}, other, checkedProps, {
    type: "checkbox",
    id: id,
    className: "bx--toggle",
    onChange: function onChange(evt) {
      _onChange && _onChange(evt);
      onToggle(input.checked, id, evt);
    },
    ref: function ref(el) {
      input = el;
    }
  })), _react.default.createElement("label", {
    className: "bx--toggle__label",
    htmlFor: id
  }, _react.default.createElement("span", {
    className: "bx--toggle__text--left"
  }, labelA), _react.default.createElement("span", {
    className: "bx--toggle__appearance"
  }), _react.default.createElement("span", {
    className: "bx--toggle__text--right"
  }, labelB)));
};

Toggle.propTypes = {
  className: _propTypes.default.string,
  defaultToggled: _propTypes.default.bool,
  onToggle: _propTypes.default.func,
  id: _propTypes.default.string.isRequired,
  toggled: _propTypes.default.bool,
  labelA: _propTypes.default.string.isRequired,
  labelB: _propTypes.default.string.isRequired
};
Toggle.defaultProps = {
  defaultToggled: false,
  labelA: 'Off',
  labelB: 'On',
  onToggle: function onToggle() {}
};
var _default = Toggle;
exports.default = _default;