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

var TiWeatherShower = function TiWeatherShower(props) {
    return _react2.default.createElement(
        _reactIconBase2.default,
        _extends({ viewBox: '0 0 40 40' }, props),
        _react2.default.createElement(
            'g',
            null,
            _react2.default.createElement('path', { d: 'm28.3 30c-0.9 0-1.6-0.7-1.6-1.7s0.7-1.6 1.6-1.6c2.8 0 5-2.3 5-5s-2.2-5-5-5c-0.4 0-0.8 0-1.3 0.2l-1.8 0.5-0.3-1.8c-0.6-3.3-3.3-5.6-6.6-5.6-3.6 0-6.6 3-6.6 6.7 0 0.4 0 0.9 0.1 1.3l0.4 2-2.4 0c-1.6 0-3.1 1.5-3.1 3.3s1.5 3.4 3.3 3.4c0.9 0 1.7 0.7 1.7 1.6s-0.8 1.7-1.7 1.7c-3.7 0-6.7-3-6.7-6.7 0-3.1 2.2-5.7 5-6.4 0-0.1 0-0.2 0-0.2 0-5.5 4.5-10 10-10 4.3 0 8.1 2.7 9.4 6.7 4.9-0.4 9 3.5 9 8.3 0 4.6-3.8 8.3-8.4 8.3z m-10.8 0l1.7-5 1.6 5c0.3 0.9-0.2 1.9-1.1 2.2-0.9 0.3-1.9-0.2-2.2-1.1-0.1-0.4-0.1-0.8 0-1.1z m5 3.3l1.7-5 1.6 5c0.3 1-0.2 1.9-1.1 2.3-0.9 0.3-1.9-0.2-2.2-1.2-0.1-0.3-0.1-0.7 0-1.1z m-10 0l1.7-5 1.6 5c0.3 1-0.2 1.9-1.1 2.3-0.9 0.3-1.9-0.2-2.2-1.2-0.1-0.3-0.1-0.7 0-1.1z' })
        )
    );
};

exports.default = TiWeatherShower;
module.exports = exports['default'];