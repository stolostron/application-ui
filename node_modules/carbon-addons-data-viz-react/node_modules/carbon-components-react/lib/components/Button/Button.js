"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _propTypes = _interopRequireDefault(require("prop-types"));

var _react = _interopRequireDefault(require("react"));

var _Icon = _interopRequireDefault(require("../Icon"));

var _classnames = _interopRequireDefault(require("classnames"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

var Button = function Button(_ref) {
  var children = _ref.children,
      className = _ref.className,
      disabled = _ref.disabled,
      small = _ref.small,
      kind = _ref.kind,
      href = _ref.href,
      tabIndex = _ref.tabIndex,
      type = _ref.type,
      icon = _ref.icon,
      iconDescription = _ref.iconDescription,
      other = _objectWithoutProperties(_ref, ["children", "className", "disabled", "small", "kind", "href", "tabIndex", "type", "icon", "iconDescription"]);

  var buttonClasses = (0, _classnames.default)(className, {
    'bx--btn': true,
    'bx--btn--sm': small,
    'bx--btn--primary': kind === 'primary',
    'bx--btn--danger': kind === 'danger',
    'bx--btn--secondary': kind === 'secondary',
    'bx--btn--ghost': kind === 'ghost',
    'bx--btn--danger--primary': kind === 'danger--primary',
    'bx--btn--tertiary': kind === 'tertiary'
  });
  var commonProps = {
    tabIndex: tabIndex,
    className: buttonClasses
  };
  var buttonImage = icon ? _react.default.createElement(_Icon.default, {
    name: icon,
    description: iconDescription,
    className: "bx--btn__icon"
  }) : null;

  var button = _react.default.createElement("button", _extends({}, other, commonProps, {
    disabled: disabled,
    type: type
  }), children, buttonImage);

  var anchor = _react.default.createElement("a", _extends({}, other, commonProps, {
    href: href,
    role: "button"
  }), children, buttonImage);

  return href ? anchor : button;
};

Button.propTypes = {
  children: _propTypes.default.node,
  className: _propTypes.default.string,
  disabled: _propTypes.default.bool,
  small: _propTypes.default.bool,
  kind: _propTypes.default.oneOf(['primary', 'secondary', 'danger', 'ghost', 'danger--primary', 'tertiary']).isRequired,
  href: _propTypes.default.string,
  tabIndex: _propTypes.default.number,
  type: _propTypes.default.oneOf(['button', 'reset', 'submit']),
  role: _propTypes.default.string,
  icon: _propTypes.default.string,
  iconDescription: function iconDescription(props) {
    if (props.icon && !props.iconDescription) {
      return new Error('icon property specified without also providing an iconDescription property.');
    }

    return undefined;
  }
};
Button.defaultProps = {
  iconDescription: 'Provide icon description if icon is used',
  tabIndex: 0,
  type: 'button',
  disabled: false,
  small: false,
  kind: 'primary'
};
var _default = Button;
exports.default = _default;