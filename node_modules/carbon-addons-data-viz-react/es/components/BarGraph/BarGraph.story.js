import _extends from 'babel-runtime/helpers/extends';
import _Object$getPrototypeOf from 'babel-runtime/core-js/object/get-prototype-of';
import _classCallCheck from 'babel-runtime/helpers/classCallCheck';
import _createClass from 'babel-runtime/helpers/createClass';
import _possibleConstructorReturn from 'babel-runtime/helpers/possibleConstructorReturn';
import _inherits from 'babel-runtime/helpers/inherits';
import React, { Component } from 'react';
import { storiesOf, action } from '@storybook/react';
import BarGraph from './BarGraph';

var UpdatingBarGraphContainer = function (_Component) {
  _inherits(UpdatingBarGraphContainer, _Component);

  function UpdatingBarGraphContainer() {
    var _ref;

    var _temp, _this, _ret;

    _classCallCheck(this, UpdatingBarGraphContainer);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = UpdatingBarGraphContainer.__proto__ || _Object$getPrototypeOf(UpdatingBarGraphContainer)).call.apply(_ref, [this].concat(args))), _this), _this.state = {
      data: _this.createGroupedData(6).sort(function (a, b) {
        return a[a.length - 1] - b[b.length - 1];
      })
    }, _temp), _possibleConstructorReturn(_this, _ret);
  }

  _createClass(UpdatingBarGraphContainer, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      var _this2 = this;

      var i = 0;
      setInterval(function () {
        _this2.updateData(i);
        i++;
      }, 5000);
    }
  }, {
    key: 'createGroupedData',
    value: function createGroupedData(num) {
      var data = [];
      for (var i = 0; i < num; i++) {
        var numArr = [];
        var one = Math.floor(Math.random() * 1000 + 10);
        var two = Math.floor(Math.random() * 1000 + 10);
        var three = Math.floor(Math.random() * 1000 + 10);
        var four = Math.floor(Math.random() * 1000 + 10);
        numArr.push(one, two, three, four);
        var d = i;
        var entry = [numArr, d];
        data.push(entry);
      }
      return data;
    }
  }, {
    key: 'updateData',
    value: function updateData(i) {
      var data = this.createGroupedData(6).sort(function (a, b) {
        return a[a.length - 1] - b[b.length - 1];
      });

      this.setState({
        data: data,
        xAxisLabel: '' + i,
        yAxisLabel: '' + i
      });
    }
  }, {
    key: 'render',
    value: function render() {
      var data = this.state.data;

      var props = {
        margin: {
          top: 30,
          right: 20,
          bottom: 75,
          left: 65
        },
        height: 300,
        width: 800,
        labelOffsetY: 55,
        labelOffsetX: 65,
        axisOffset: 16,
        yAxisLabel: this.state.yAxisLabel,
        xAxisLabel: this.state.xAxisLabel,
        onHover: action('Hover'),
        id: this.props.id,
        containerId: this.props.containerId,
        drawLine: this.props.drawLine
      };

      return React.createElement(BarGraph, _extends({ data: data }, props));
    }
  }]);

  return UpdatingBarGraphContainer;
}(Component);

function createData(num) {
  var data = [];
  for (var i = 0; i < num; i++) {
    var tempArr = [];
    var randomNum = Math.floor(Math.random() * 1000 + 1);
    var d = new Date();
    d = d.setDate(d.getDate() + i * 30);
    tempArr.push([randomNum], d);
    data.push(tempArr);
  }
  return data;
}

function createGroupedData(num) {
  var data = [];
  for (var i = 0; i < num; i++) {
    var numArr = [];
    var one = Math.floor(Math.random() * 1000 + 10);
    var two = Math.floor(Math.random() * 1000 + 10);
    var three = Math.floor(Math.random() * 1000 + 10);
    var four = Math.floor(Math.random() * 1000 + 10);
    var five = Math.floor(Math.random() * 1000 + 10);
    numArr.push(one, two, three, four, five);
    var d = new Date();
    d = d.setDate(d.getDate() - i * 30);
    var entry = [numArr, d];
    data.push(entry);
  }
  return data;
}

var data = createData(12).sort(function (a, b) {
  return a[1] - b[1];
});

var groupedData = createGroupedData(3).sort(function (a, b) {
  return a[1] - b[1];
});

var singleData = createData(1).sort(function (a, b) {
  return a[1] - b[1];
});

var props = {
  margin: {
    top: 30,
    right: 20,
    bottom: 75,
    left: 65
  },
  height: 300,
  width: 800,
  labelOffsetY: 55,
  labelOffsetX: 65,
  axisOffset: 16,
  yAxisLabel: 'Amount ($)',
  xAxisLabel: 'Date',
  onHover: action('Hover'),
  id: 'bar-graph-1',
  containerId: 'bar-graph-container'
};

storiesOf('BarGraph', module).addWithInfo('Default', '\n      Bar Graph.\n    ', function () {
  return React.createElement(BarGraph, _extends({
    timeFormat: '%b',
    onHover: action('Hover'),
    data: data
  }, props));
}).addWithInfo('Grouped', '\n     Grouped Bar Graph.\n    ', function () {
  return React.createElement(BarGraph, _extends({
    timeFormat: '%b',
    onHover: action('Hover'),
    data: groupedData
  }, props, {
    seriesLabels: ['Series 1', 'Series 2', 'Series 3', 'Series 4', 'Series 5']
  }));
}).addWithInfo('Updating', '\n     Updating Grouped Bar Graph.\n    ', function () {
  return React.createElement(UpdatingBarGraphContainer, null);
}).addWithInfo('Empty', '\n     Empty Bar Graph.\n    ', function () {
  return React.createElement(BarGraph, _extends({ onHover: action('Hover'), data: singleData }, props));
});