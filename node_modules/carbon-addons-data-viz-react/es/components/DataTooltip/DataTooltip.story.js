import _extends from 'babel-runtime/helpers/extends';
import React from 'react';
import { storiesOf } from '@storybook/react';
import DataTooltip from './DataTooltip';

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

storiesOf('DataTooltip', module).addWithInfo('Default', '\n    Data Tooltip.\n  ', function () {
  return React.createElement(DataTooltip, { data: singleNoColorData });
}).addWithInfo('Single, No Label', '\n      Data Tooltip.\n    ', function () {
  return React.createElement(DataTooltip, { data: singleData });
}).addWithInfo('Single', '\n        Data Tooltip.\n      ', function () {
  return React.createElement(DataTooltip, _extends({ data: data.slice(0, data.length - 5) }, props));
}).addWithInfo('Triple', '\n      Data Tooltip.\n    ', function () {
  return React.createElement(DataTooltip, _extends({ data: data.slice(0, data.length - 3) }, props));
}).addWithInfo('Quad', '\n      Data Tooltip.\n    ', function () {
  return React.createElement(DataTooltip, _extends({ data: data.slice(0, data.length - 2) }, props));
}).addWithInfo('Quint', '\n        Data Tooltip.\n      ', function () {
  return React.createElement(DataTooltip, _extends({ data: data.slice(0, data.length - 1) }, props));
}).addWithInfo('Max', '\n      Data Tooltip.\n    ', function () {
  return React.createElement(DataTooltip, _extends({ data: data }, props));
});