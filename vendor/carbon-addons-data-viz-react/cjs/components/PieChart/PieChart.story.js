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

var _PieChart = require('./PieChart');

var _PieChart2 = _interopRequireDefault(_PieChart);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var PieUpdater = function (_Component) {
  (0, _inherits3.default)(PieUpdater, _Component);

  function PieUpdater() {
    var _ref;

    var _temp, _this, _ret;

    (0, _classCallCheck3.default)(this, PieUpdater);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = (0, _possibleConstructorReturn3.default)(this, (_ref = PieUpdater.__proto__ || (0, _getPrototypeOf2.default)(PieUpdater)).call.apply(_ref, [this].concat(args))), _this), _this.state = {
      data: [['Gryffindor', Math.floor(Math.random() * 100 + 1)], ['Slytherin', Math.floor(Math.random() * 100 + 1)], ['Ravenclaw', Math.floor(Math.random() * 100 + 1)], ['Hufflepuff', Math.floor(Math.random() * 100 + 1)], ['Teachers', Math.floor(Math.random() * 100 + 1)]]
    }, _temp), (0, _possibleConstructorReturn3.default)(_this, _ret);
  }

  (0, _createClass3.default)(PieUpdater, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      var _this2 = this;

      setInterval(function () {
        _this2.updateData();
      }, 5000);
    }
  }, {
    key: 'updateData',
    value: function updateData() {
      var data = [['Gryffindor', Math.floor(Math.random() * 100 + 1)], ['Slytherin', Math.floor(Math.random() * 100 + 1)], ['Ravenclaw', Math.floor(Math.random() * 100 + 1)], ['Hufflepuff', Math.floor(Math.random() * 100 + 1)], ['Teachers', Math.floor(Math.random() * 100 + 1)]];

      this.setState({
        data: data
      });
    }
  }, {
    key: 'render',
    value: function render() {
      var data = this.state.data;


      return _react2.default.createElement(_PieChart2.default, { data: data });
    }
  }]);
  return PieUpdater;
}(_react.Component);

var staticData = [['Gryffindor', Math.floor(Math.random() * 100 + 1)], ['Slytherin', Math.floor(Math.random() * 100 + 1)], ['Ravenclaw', Math.floor(Math.random() * 100 + 1)], ['Hufflepuff', Math.floor(Math.random() * 100 + 1)], ['Teachers', Math.floor(Math.random() * 20 + 1)]];

var props = {
  data: staticData
};

(0, _react3.storiesOf)('PieChart', module).addWithInfo('Default', '\n      Pie Chart.\n    ', function () {
  return _react2.default.createElement(
    'div',
    null,
    _react2.default.createElement(_PieChart2.default, (0, _extends3.default)({ id: 'one' }, props)),
    _react2.default.createElement(_PieChart2.default, (0, _extends3.default)({ id: 'two' }, props))
  );
}).addWithInfo('Updating', 'Pie Chart w/ Updates', function () {
  return _react2.default.createElement(PieUpdater, null);
});