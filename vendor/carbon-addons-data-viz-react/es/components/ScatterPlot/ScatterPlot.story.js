import _extends from 'babel-runtime/helpers/extends';
import React from 'react';
import { storiesOf, action } from '@storybook/react';
import ScatterPlot from './ScatterPlot';

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

storiesOf('ScatterPlot', module).addWithInfo('Default', '\n      Line Graph.\n    ', function () {
  return React.createElement(ScatterPlot, _extends({ onHover: action('Hover') }, props));
});