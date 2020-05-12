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

var newChild = function newChild(children, tabIndex) {
  var child = _react2.default.Children.only(children);
  return _react2.default.cloneElement(_react2.default.Children.only(child), {
    tabIndex: tabIndex,
    className: 'left-nav-list__item-link'
  });
};

var InteriorLeftNavItem = function InteriorLeftNavItem(_ref) {
  var className = _ref.className,
      href = _ref.href,
      activeHref = _ref.activeHref,
      _onClick = _ref.onClick,
      tabIndex = _ref.tabIndex,
      children = _ref.children,
      label = _ref.label,
      other = _objectWithoutProperties(_ref, ['className', 'href', 'activeHref', 'onClick', 'tabIndex', 'children', 'label']);

  var classNames = (0, _classnames2.default)('left-nav-list__item', className, {
    'left-nav-list__item--active': activeHref === href
  });

  return _react2.default.createElement(
    'li',
    _extends({
      tabIndex: children ? -1 : tabIndex,
      role: 'menuitem',
      className: classNames,
      onClick: function onClick(evt) {
        return _onClick(evt, href);
      },
      onKeyPress: function onKeyPress(evt) {
        return _onClick(evt, href);
      }
    }, other),
    children ? newChild(children, tabIndex) : _react2.default.createElement(
      'a',
      {
        className: 'left-nav-list__item-link',
        href: href,
        tabIndex: children ? tabIndex : -1 },
      label
    )
  );
};

InteriorLeftNavItem.propTypes = {
  className: _propTypes2.default.string,
  href: _propTypes2.default.string.isRequired,
  activeHref: _propTypes2.default.string,
  tabIndex: _propTypes2.default.number,
  onClick: _propTypes2.default.func,
  blankTarget: _propTypes2.default.bool,
  children: _propTypes2.default.node,
  label: _propTypes2.default.string.isRequired
};

InteriorLeftNavItem.defaultProps = {
  activeHref: '#',
  tabIndex: 0,
  label: 'InteriorLeftNavItem Label',
  onClick: /* istanbul ignore next */function onClick() {}
};

exports.default = InteriorLeftNavItem;