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

var CloudHeaderMenu = function CloudHeaderMenu(props) {
  var className = props.className,
      other = _objectWithoutProperties(props, ['className']);

  var cloudHeaderMenuClasses = (0, _classnames2.default)('bx--cloud-header__app-menu', className);

  return _react2.default.createElement(
    'button',
    _extends({ className: cloudHeaderMenuClasses, type: 'button' }, other),
    _react2.default.createElement(
      'svg',
      { width: '20', height: '20' },
      _react2.default.createElement(
        'title',
        null,
        'cloud header menu'
      ),
      _react2.default.createElement('path', { d: 'M3 4h14v1H3zM3 10h14v1H3zM3 16h14v1H3z' })
    )
  );
};

CloudHeaderMenu.propTypes = {
  className: _propTypes2.default.string
};

exports.default = CloudHeaderMenu;