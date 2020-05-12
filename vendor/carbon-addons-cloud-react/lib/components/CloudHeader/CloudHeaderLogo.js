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

var CloudHeaderLogo = function CloudHeaderLogo(props) {
  var children = props.children,
      className = props.className,
      href = props.href,
      companyName = props.companyName,
      productName = props.productName,
      other = _objectWithoutProperties(props, ['children', 'className', 'href', 'companyName', 'productName']);

  var CloudHeaderLogoClasses = (0, _classnames2.default)('bx--cloud-header-brand', className);

  return _react2.default.createElement(
    'a',
    _extends({ href: href, className: CloudHeaderLogoClasses }, other),
    children ? _react2.default.createElement(
      'div',
      { className: 'bx--cloud-header-brand__icon' },
      children
    ) : null,
    _react2.default.createElement(
      'h4',
      { className: 'bx--cloud-header-brand__text' },
      companyName,
      '\xA0',
      _react2.default.createElement(
        'span',
        null,
        productName
      )
    )
  );
};

CloudHeaderLogo.propTypes = {
  children: _propTypes2.default.node,
  className: _propTypes2.default.string,
  companyName: _propTypes2.default.string,
  productName: _propTypes2.default.string,
  href: _propTypes2.default.string
};

CloudHeaderLogo.defaultProps = {
  companyName: 'IBM',
  productName: 'Cloud'
};

exports.default = CloudHeaderLogo;