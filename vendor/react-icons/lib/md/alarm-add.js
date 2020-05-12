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

var MdAlarmAdd = function MdAlarmAdd(props) {
    return _react2.default.createElement(
        _reactIconBase2.default,
        _extends({ viewBox: '0 0 40 40' }, props),
        _react2.default.createElement(
            'g',
            null,
            _react2.default.createElement('path', { d: 'm21.6 15v5h5v3.4h-5v5h-3.2v-5h-5v-3.4h5v-5h3.2z m-1.6 18.4c6.5 0 11.6-5.3 11.6-11.8s-5.1-11.6-11.6-11.6-11.6 5.2-11.6 11.6 5.1 11.8 11.6 11.8z m0-26.8c8.3 0 15 6.8 15 15s-6.7 15-15 15-15-6.7-15-15 6.7-15 15-15z m16.6 2.9l-2.1 2.6-7.6-6.5 2.1-2.5z m-23.5-3.9l-7.6 6.4-2.1-2.5 7.6-6.4z' })
        )
    );
};

exports.default = MdAlarmAdd;
module.exports = exports['default'];