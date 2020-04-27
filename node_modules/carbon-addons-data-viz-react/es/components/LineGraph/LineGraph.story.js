import _Object$getPrototypeOf from 'babel-runtime/core-js/object/get-prototype-of';
import _classCallCheck from 'babel-runtime/helpers/classCallCheck';
import _createClass from 'babel-runtime/helpers/createClass';
import _possibleConstructorReturn from 'babel-runtime/helpers/possibleConstructorReturn';
import _inherits from 'babel-runtime/helpers/inherits';
import React, { Component } from 'react';
import { storiesOf, action } from '@storybook/react';
import LineGraph from './LineGraph';

var LineGraphContainer = function (_Component) {
  _inherits(LineGraphContainer, _Component);

  function LineGraphContainer() {
    var _ref;

    var _temp, _this, _ret;

    _classCallCheck(this, LineGraphContainer);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = LineGraphContainer.__proto__ || _Object$getPrototypeOf(LineGraphContainer)).call.apply(_ref, [this].concat(args))), _this), _this.state = {
      data: _this.createData(12).sort(function (a, b) {
        return a[a.length - 1] - b[b.length - 1];
      })
    }, _temp), _possibleConstructorReturn(_this, _ret);
  }

  _createClass(LineGraphContainer, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      var _this2 = this;

      var i = 0;
      this.interval = setInterval(function () {
        _this2.updateData(i);
        i++;
      }, 5000);
    }
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      window.clearInterval(this.interval);
    }
  }, {
    key: 'createData',
    value: function createData(num) {
      var data = [];
      for (var i = 0; i < num; i++) {
        var tempArr = [];
        var d = new Date();
        var randomNum = Math.floor(Math.random() * 1000 + 1);
        var randomNumTwo = Math.floor(Math.random() * 1000 + 1);
        var randomNumThree = Math.floor(Math.random() * 1000 + 1);
        d = d.getTime() - i * 3000;
        tempArr.push(randomNum, randomNumTwo, randomNumThree, d);
        data.push(tempArr);
      }

      return data;
    }
  }, {
    key: 'updateData',
    value: function updateData(i) {
      var data = this.createData(12).sort(function (a, b) {
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
        timeFormat: '%I:%M:%S',
        yAxisLabel: this.state.yAxisLabel,
        xAxisLabel: this.state.xAxisLabel,
        data: this.state.data,
        onHover: action('Hover'),
        id: this.props.id,
        containerId: this.props.containerId,
        drawLine: this.props.drawLine,
        animateAxes: this.props.animateAxes,
        seriesLabels: ['Series 1', 'Series 2', 'Series 3']
      };

      return React.createElement(LineGraph, props);
    }
  }]);

  return LineGraphContainer;
}(Component);

storiesOf('LineGraph', module).addWithInfo('Updating', '\n      Line Graph.\n    ', function () {
  return React.createElement(
    'div',
    null,
    React.createElement(LineGraphContainer, {
      onHover: action('Hover'),
      onMouseOut: action('Mouseout'),
      onBlur: action('Blur')
    }),
    React.createElement(LineGraphContainer, {
      id: 'two',
      containerId: 'test-two',
      onHover: action('Hover'),
      onMouseOut: action('Mouseout'),
      onBlur: action('Blur')
    })
  );
}).addWithInfo('Updating without drawing line', '\n      Line Graph without draw line animation.\n    ', function () {
  return React.createElement(
    'div',
    null,
    React.createElement(LineGraphContainer, {
      onHover: action('Hover'),
      onMouseOut: action('Mouseout'),
      onBlur: action('Blur'),
      drawLine: false
    }),
    React.createElement(LineGraphContainer, {
      id: 'two',
      containerId: 'test-two',
      onHover: action('Hover'),
      onMouseOut: action('Mouseout'),
      onBlur: action('Blur'),
      drawLine: false
    })
  );
}).addWithInfo('Updating without animating axes', '\n      Line Graph without axes animation.\n    ', function () {
  return React.createElement(
    'div',
    null,
    React.createElement(LineGraphContainer, {
      onHover: action('Hover'),
      onMouseOut: action('Mouseout'),
      onBlur: action('Blur'),
      animateAxes: false
    }),
    React.createElement(LineGraphContainer, {
      id: 'two',
      containerId: 'test-two',
      onHover: action('Hover'),
      onMouseOut: action('Mouseout'),
      onBlur: action('Blur'),
      animateAxes: false
    })
  );
}).addWithInfo('Static', ' Static Example. ', function () {
  return React.createElement(LineGraph, {
    datasets: [[[43, 1507563000000], [27, 1507563900000], [33, 1507564800000]], [[48.633333333333, 1507563004000], [21, 1507563900140], [38, 1507564830000]]],
    onHover: action('Hover'),
    onMouseOut: action('Mouseout'),
    onBlur: action('Blur')
  });
}).addWithInfo('Number values for X', ' Static Example. ', function () {
  return React.createElement(LineGraph, {
    datasets: [[[45, 12], [23, 14], [33, 18], [31, 20], [12, 21]], [[48.633333333333, 11], [21, 15], [38, 16], [21, 19], [31, 21]]],
    onHover: action('Hover'),
    onMouseOut: action('Mouseout'),
    onBlur: action('Blur'),
    seriesLabels: ['Series 1', 'Series 2', 'Series 3'],
    showLegend: true,
    isXTime: false
  });
}).addWithInfo('Empty', ' Empty Example. ', function () {
  return React.createElement(LineGraph, {
    onHover: action('Hover'),
    onMouseOut: action('Mouseout'),
    onBlur: action('Blur')
  });
});