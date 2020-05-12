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

var CloudHeaderListItem = function CloudHeaderListItem(props) {
  var children = props.children,
      className = props.className,
      href = props.href,
      isIcon = props.isIcon,
      ariaExpanded = props.ariaExpanded,
      other = _objectWithoutProperties(props, ['children', 'className', 'href', 'isIcon', 'ariaExpanded']);

  var CloudHeaderListItemClasses = (0, _classnames2.default)('bx--cloud-header-list__item', className);

  var itemStyles = {};

  return _react2.default.createElement(
    'li',
    { className: CloudHeaderListItemClasses },
    isIcon ? _react2.default.createElement(
      'div',
      _extends({
        'aria-expanded': ariaExpanded,
        'aria-haspopup': 'true',
        role: 'button',
        tabIndex: '0',
        className: 'bx--cloud-header-list__btn'
      }, other),
      children
    ) : _react2.default.createElement(
      'a',
      _extends({ className: 'bx--cloud-header-list__link', href: href }, other),
      children
    )
  );
};

CloudHeaderListItem.propTypes = {
  children: _propTypes2.default.node,
  className: _propTypes2.default.string,
  href: _propTypes2.default.string
};

CloudHeaderListItem.defaultProps = {
  href: ''
};

exports.default = CloudHeaderListItem;