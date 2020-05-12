'use strict';

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _react3 = require('@storybook/react');

var _DataTooltip = require('./DataTooltip');

var _DataTooltip2 = _interopRequireDefault(_DataTooltip);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var singleNoColorData = [{ data: '$250.17' }];

var singleData = [{ data: '$250.17', label: 'Feb 21, 10:35 AM', color: '#00a68f' }];

var data = [{ data: '5.3%', label: 'CPU', color: '#3b1a40' }, { data: '8.9%', label: 'CPU', color: '#473793' }, { data: '35.1%', label: 'CPU', color: '#3c6df0' }, { data: '46.5%', label: 'CPU', color: '#00a68f' }, {
  data: '0.2%',
  label: 'CPU',
  color: '#48d4bb'
}, { data: '$250.17', label: 'CPU', color: '#9b82f3' }];

var props = {
  heading: 'Mar 1 @ 11:26 AM',
  direction: 'top',
  isActive: true
};

(0, _react3.storiesOf)('DataTooltip', module).addWithInfo('Default', '\n    Data Tooltip.\n  ', function () {
  return _react2.default.createElement(_DataTooltip2.default, { data: singleNoColorData });
}).addWithInfo('Single, No Label', '\n      Data Tooltip.\n    ', function () {
  return _react2.default.createElement(_DataTooltip2.default, { data: singleData });
}).addWithInfo('Single', '\n        Data Tooltip.\n      ', function () {
  return _react2.default.createElement(_DataTooltip2.default, (0, _extends3.default)({ data: data.slice(0, data.length - 5) }, props));
}).addWithInfo('Triple', '\n      Data Tooltip.\n    ', function () {
  return _react2.default.createElement(_DataTooltip2.default, (0, _extends3.default)({ data: data.slice(0, data.length - 3) }, props));
}).addWithInfo('Quad', '\n      Data Tooltip.\n    ', function () {
  return _react2.default.createElement(_DataTooltip2.default, (0, _extends3.default)({ data: data.slice(0, data.length - 2) }, props));
}).addWithInfo('Quint', '\n        Data Tooltip.\n      ', function () {
  return _react2.default.createElement(_DataTooltip2.default, (0, _extends3.default)({ data: data.slice(0, data.length - 1) }, props));
}).addWithInfo('Max', '\n      Data Tooltip.\n    ', function () {
  return _react2.default.createElement(_DataTooltip2.default, (0, _extends3.default)({ data: data }, props));
});