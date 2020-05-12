import _extends from 'babel-runtime/helpers/extends';
import _Object$getPrototypeOf from 'babel-runtime/core-js/object/get-prototype-of';
import _classCallCheck from 'babel-runtime/helpers/classCallCheck';
import _createClass from 'babel-runtime/helpers/createClass';
import _possibleConstructorReturn from 'babel-runtime/helpers/possibleConstructorReturn';
import _inherits from 'babel-runtime/helpers/inherits';
import React, { Component } from 'react';
import { storiesOf } from '@storybook/react';
import PieChart from './PieChart';

var PieUpdater = function (_Component) {
  _inherits(PieUpdater, _Component);

  function PieUpdater() {
    var _ref;

    var _temp, _this, _ret;

    _classCallCheck(this, PieUpdater);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = PieUpdater.__proto__ || _Object$getPrototypeOf(PieUpdater)).call.apply(_ref, [this].concat(args))), _this), _this.state = {
      data: [['Gryffindor', Math.floor(Math.random() * 100 + 1)], ['Slytherin', Math.floor(Math.random() * 100 + 1)], ['Ravenclaw', Math.floor(Math.random() * 100 + 1)], ['Hufflepuff', Math.floor(Math.random() * 100 + 1)], ['Teachers', Math.floor(Math.random() * 100 + 1)]]
    }, _temp), _possibleConstructorReturn(_this, _ret);
  }

  _createClass(PieUpdater, [{
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


      return React.createElement(PieChart, { data: data });
    }
  }]);

  return PieUpdater;
}(Component);

var staticData = [['Gryffindor', Math.floor(Math.random() * 100 + 1)], ['Slytherin', Math.floor(Math.random() * 100 + 1)], ['Ravenclaw', Math.floor(Math.random() * 100 + 1)], ['Hufflepuff', Math.floor(Math.random() * 100 + 1)], ['Teachers', Math.floor(Math.random() * 20 + 1)]];

var props = {
  data: staticData
};

storiesOf('PieChart', module).addWithInfo('Default', '\n      Pie Chart.\n    ', function () {
  return React.createElement(
    'div',
    null,
    React.createElement(PieChart, _extends({ id: 'one' }, props)),
    React.createElement(PieChart, _extends({ id: 'two' }, props))
  );
}).addWithInfo('Updating', 'Pie Chart w/ Updates', function () {
  return React.createElement(PieUpdater, null);
});