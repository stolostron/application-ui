'use strict';

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _react3 = require('@storybook/react');

var _GaugeGraph = require('./GaugeGraph');

var _GaugeGraph2 = _interopRequireDefault(_GaugeGraph);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var props = {
  radius: 80,
  padding: 30,
  amount: 75,
  total: 100
};

var halfGaugeProps = {
  gaugePercentages: [{ low: 0, high: 50, color: '#4B8400' }, { low: 50, high: 75, color: '#EFC100' }, { low: 75, high: 100, color: '#FF5050' }],
  size: 'half',
  radius: 80,
  padding: 30,
  amount: 25,
  total: 100,
  valueText: '25%',
  labelText: '25 out of 100GB',
  tooltipId: 'one-container'
};

var halfGaugePropsTwo = {
  gaugePercentages: [{ low: 0, high: 50, color: '#4B8400' }, { low: 50, high: 75, color: '#EFC100' }, { low: 75, high: 100, color: '#FF5050' }],
  size: 'half',
  radius: 80,
  padding: 30,
  amount: 75,
  total: 100,
  valueText: '75%',
  labelText: '75 out of 100GB',
  tooltipId: 'two-container'
};

(0, _react3.storiesOf)('GaugeGraph', module).addWithInfo('Default', '\n      Gauge Graph.\n    ', function () {
  return _react2.default.createElement(_GaugeGraph2.default, props);
}).addWithInfo('Half', '\n      Gauge Graph.\n    ', function () {
  return _react2.default.createElement(
    'div',
    null,
    _react2.default.createElement(_GaugeGraph2.default, (0, _extends3.default)({ id: 'one' }, halfGaugeProps)),
    _react2.default.createElement(_GaugeGraph2.default, (0, _extends3.default)({ id: 'two' }, halfGaugePropsTwo))
  );
});