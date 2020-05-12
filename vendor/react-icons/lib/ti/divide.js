'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactIconBase = require('react-icon-base');

var _reactIconBase2 = _interopRequireDefault(_reactIconBase);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var TiDivide = function TiDivide(props) {
    return _react2.default.createElement(
        _reactIconBase2.default,
        _extends({ viewBox: '0 0 40 40' }, props),
        _react2.default.createElement(
            'g',
            null,
            _react2.default.createElement('path', { d: 'm23.8 10c0 2.1-1.7 3.8-3.8 3.8s-3.7-1.7-3.7-3.8c0-2.1 1.6-3.7 3.7-3.7s3.8 1.6 3.8 3.7z m0 20c0 2.1-1.7 3.8-3.8 3.8s-3.7-1.7-3.7-3.8c0-2.1 1.6-3.7 3.7-3.7s3.8 1.6 3.8 3.7z m6.2-13.3h-20c-1.8 0-3.3 1.5-3.3 3.3s1.5 3.3 3.3 3.3h20c1.8 0 3.3-1.5 3.3-3.3s-1.5-3.3-3.3-3.3z' })
        )
    );
};

exports.default = TiDivide;
module.exports = exports['default'];