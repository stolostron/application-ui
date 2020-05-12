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

var MdContactPhone = function MdContactPhone(props) {
    return _react2.default.createElement(
        _reactIconBase2.default,
        _extends({ viewBox: '0 0 40 40' }, props),
        _react2.default.createElement(
            'g',
            null,
            _react2.default.createElement('path', { d: 'm29.8 23.4c-0.4-1.1-0.7-2.2-0.7-3.4s0.3-2.3 0.7-3.4h2.7l2.5-3.2-3.3-3.4c-2.2 1.6-3.8 3.9-4.6 6.6-0.3 1.1-0.5 2.2-0.5 3.4s0.2 2.3 0.5 3.4c0.8 2.6 2.4 5 4.6 6.6l3.3-3.4-2.5-3.2h-2.7z m-6.4 6.6v-1.6c0-3.4-6.7-5.2-10-5.2s-10 1.8-10 5.2v1.6h20z m-10-20c-2.8 0-5 2.3-5 5s2.2 5 5 5 5-2.3 5-5-2.3-5-5-5z m23.2-5c1.8 0 3.4 1.6 3.4 3.4v23.2c0 1.8-1.6 3.4-3.4 3.4h-33.2c-1.8 0-3.4-1.6-3.4-3.4v-23.2c0-1.8 1.6-3.4 3.4-3.4h33.2z' })
        )
    );
};

exports.default = MdContactPhone;
module.exports = exports['default'];