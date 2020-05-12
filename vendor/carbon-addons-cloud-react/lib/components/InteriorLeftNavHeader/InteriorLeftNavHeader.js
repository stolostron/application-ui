'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

/**
 * The optional header in `<InteriorLeftNav>`.
 */
var InteriorLeftNavHeader = function InteriorLeftNavHeader(_ref) {
  var className = _ref.className,
      icon = _ref.icon,
      children = _ref.children,
      other = _objectWithoutProperties(_ref, ['className', 'icon', 'children']);

  var classNames = (0, _classnames2.default)('bx--interior-left-nav__header', className);

  return _react2.default.createElement(
    'div',
    _extends({ className: classNames }, other),
    icon,
    _react2.default.createElement(
      'div',
      { className: 'bx--interior-left-nav__header__title' },
      children
    )
  );
};

InteriorLeftNavHeader.propTypes = {
  /**
   * The CSS class names.
   */
  className: _propTypes2.default.string,

  /**
   * The optional icon, e.g. `<Icon>`.
   */
  icon: _propTypes2.default.node,

  /**
   * The child nodes.
   */
  children: _propTypes2.default.node
};

exports.default = InteriorLeftNavHeader;