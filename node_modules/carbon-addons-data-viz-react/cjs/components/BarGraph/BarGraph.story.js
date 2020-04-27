'use strict';

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _getPrototypeOf = require('babel-runtime/core-js/object/get-prototype-of');

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _react3 = require('@storybook/react');

var _BarGraph = require('./BarGraph');

var _BarGraph2 = _interopRequireDefault(_BarGraph);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var UpdatingBarGraphContainer = function (_Component) {
  (0, _inherits3.default)(UpdatingBarGraphContainer, _Component);

  function UpdatingBarGraphContainer() {
    var _ref;

    var _temp, _this, _ret;

    (0, _classCallCheck3.default)(this, UpdatingBarGraphContainer);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = (0, _possibleConstructorReturn3.default)(this, (_ref = UpdatingBarGraphContainer.__proto__ || (0, _getPrototypeOf2.default)(UpdatingBarGraphContainer)).call.apply(_ref, [this].concat(args))), _this), _this.state = {
      data: _this.createGroupedData(6).sort(function (a, b) {
        return a[a.length - 1] - b[b.length - 1];
      })
    }, _temp), (0, _possibleConstructorReturn3.default)(_this, _ret);
  }

  (0, _createClass3.default)(UpdatingBarGraphContainer, [{
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
        onHover: (0, _react3.action)('Hover'),
        id: this.props.id,
        containerId: this.props.containerId,
        drawLine: this.props.drawLine
      };

      return _react2.default.createElement(_BarGraph2.default, (0, _extends3.default)({ data: data }, props));
    }
  }]);
  return UpdatingBarGraphContainer;
}(_react.Component);

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
  onHover: (0, _react3.action)('Hover'),
  id: 'bar-graph-1',
  containerId: 'bar-graph-container'
};

(0, _react3.storiesOf)('BarGraph', module).addWithInfo('Default', '\n      Bar Graph.\n    ', function () {
  return _react2.default.createElement(_BarGraph2.default, (0, _extends3.default)({
    timeFormat: '%b',
    onHover: (0, _react3.action)('Hover'),
    data: data
  }, props));
}).addWithInfo('Grouped', '\n     Grouped Bar Graph.\n    ', function () {
  return _react2.default.createElement(_BarGraph2.default, (0, _extends3.default)({
    timeFormat: '%b',
    onHover: (0, _react3.action)('Hover'),
    data: groupedData
  }, props, {
    seriesLabels: ['Series 1', 'Series 2', 'Series 3', 'Series 4', 'Series 5']
  }));
}).addWithInfo('Updating', '\n     Updating Grouped Bar Graph.\n    ', function () {
  return _react2.default.createElement(UpdatingBarGraphContainer, null);
}).addWithInfo('Empty', '\n     Empty Bar Graph.\n    ', function () {
  return _react2.default.createElement(_BarGraph2.default, (0, _extends3.default)({ onHover: (0, _react3.action)('Hover'), data: singleData }, props));
});