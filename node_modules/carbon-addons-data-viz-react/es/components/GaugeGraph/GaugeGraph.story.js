import _extends from 'babel-runtime/helpers/extends';
import React from 'react';
import { storiesOf } from '@storybook/react';
import GaugeGraph from './GaugeGraph';

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

storiesOf('GaugeGraph', module).addWithInfo('Default', '\n      Gauge Graph.\n    ', function () {
  return React.createElement(GaugeGraph, props);
}).addWithInfo('Half', '\n      Gauge Graph.\n    ', function () {
  return React.createElement(
    'div',
    null,
    React.createElement(GaugeGraph, _extends({ id: 'one' }, halfGaugeProps)),
    React.createElement(GaugeGraph, _extends({ id: 'two' }, halfGaugePropsTwo))
  );
});