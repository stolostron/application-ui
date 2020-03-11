'use strict';

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _react3 = require('@storybook/react');

var _ScatterPlot = require('./ScatterPlot');

var _ScatterPlot2 = _interopRequireDefault(_ScatterPlot);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function createData(num) {
  var data = [];
  for (var i = 0; i < num; i++) {
    var tempArr = [];
    var d = new Date();
    var randomNum = Math.floor(Math.random() * 1000 + 1);
    d = d.setDate(d.getDate() - i * 30);
    tempArr.push(randomNum, d);
    data.push(tempArr);
  }

  return data;
}

var data = createData(20).sort(function (a, b) {
  return a[1] - b[1];
});
var props = {
  data: data,
  margin: {
    top: 30,
    right: 20,
    bottom: 70,
    left: 65
  },
  height: 300,
  width: 800,
  labelOffset: 55,
  axisOffset: 16,
  xAxisLabel: 'MONTH',
  yAxisLabel: 'USAGE ($)',
  timeFormat: '%b'
};

(0, _react3.storiesOf)('ScatterPlot', module).addWithInfo('Default', '\n      Line Graph.\n    ', function () {
  return _react2.default.createElement(_ScatterPlot2.default, (0, _extends3.default)({ onHover: (0, _react3.action)('Hover') }, props));
});