import _Object$getPrototypeOf from 'babel-runtime/core-js/object/get-prototype-of';
import _classCallCheck from 'babel-runtime/helpers/classCallCheck';
import _createClass from 'babel-runtime/helpers/createClass';
import _possibleConstructorReturn from 'babel-runtime/helpers/possibleConstructorReturn';
import _inherits from 'babel-runtime/helpers/inherits';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import * as d3 from 'd3';

var propTypes = {
  data: PropTypes.array,
  height: PropTypes.number,
  width: PropTypes.number,
  margin: PropTypes.object,
  labelOffset: PropTypes.number,
  axisOffset: PropTypes.number,
  timeFormat: PropTypes.string,
  xAxisLabel: PropTypes.string,
  yAxisLabel: PropTypes.string
};

var defaultProps = {
  data: [[100, 10], [50, 20]],
  height: 300,
  width: 800,
  margin: {
    top: 30,
    right: 20,
    bottom: 70,
    left: 65
  },
  labelOffset: 55,
  axisOffset: 16,
  timeFormat: '%b',
  xAxisLabel: 'X Axis',
  yAxisLabel: 'Y Axis'
};

var ScatterPlot = function (_Component) {
  _inherits(ScatterPlot, _Component);

  function ScatterPlot() {
    var _ref;

    var _temp, _this, _ret;

    _classCallCheck(this, ScatterPlot);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = ScatterPlot.__proto__ || _Object$getPrototypeOf(ScatterPlot)).call.apply(_ref, [this].concat(args))), _this), _this.state = {
      data: _this.props.data,
      height: _this.props.height,
      width: _this.props.width,
      margin: _this.props.margin,
      labelOffset: _this.props.labelOffset,
      axisOffset: _this.props.axisOffset,
      timeFormat: _this.props.timeFormat,
      xAxisLabel: _this.props.xAxisLabel,
      yAxisLabel: _this.props.yAxisLabel
    }, _temp), _possibleConstructorReturn(_this, _ret);
  }

  _createClass(ScatterPlot, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      var _state = this.state,
          width = _state.width,
          height = _state.height,
          margin = _state.margin;


      this.svg = d3.select(this.refs.container).attr('class', 'bx--graph').attr('width', width).attr('height', height).append('g').attr('class', 'bx--group-container').attr('transform', 'translate(' + margin.left + ', ' + margin.top + ')');

      this.setState(function () {
        return {
          width: width - (margin.left + margin.right),
          height: height - (margin.top + margin.bottom)
        };
      }, this.initialRender);
    }
  }, {
    key: 'initialRender',
    value: function initialRender() {
      var _state2 = this.state,
          data = _state2.data,
          width = _state2.width,
          height = _state2.height;


      this.x = d3.scaleBand().rangeRound([0, width]).domain(data.map(function (d) {
        return d[1];
      }));

      this.y = d3.scaleLinear().range([height, 0]).domain([0, d3.max(data, function (d) {
        return d[0];
      })]);

      this.renderAxes();
      this.renderLabels();
      this.renderPoints();
      this.renderOverlay();
    }
  }, {
    key: 'renderAxes',
    value: function renderAxes() {
      var _state3 = this.state,
          width = _state3.width,
          height = _state3.height,
          axisOffset = _state3.axisOffset,
          timeFormat = _state3.timeFormat;


      var xAxis = d3.axisBottom().scale(this.x).tickSize(0).tickFormat(d3.timeFormat(timeFormat));

      var yAxis = d3.axisLeft().ticks(4).tickSize(-width).scale(this.y.nice());

      this.svg.append('g').attr('class', 'bx--axis bx--axis--y').attr('stroke-dasharray', '4').call(yAxis).selectAll('text').attr('x', -axisOffset);

      this.svg.append('g').attr('class', 'bx--axis bx--axis--x').attr('transform', 'translate(0, ' + height + ')').call(xAxis).selectAll('text').attr('y', axisOffset).style('text-anchor', 'end').attr('transform', 'rotate(-65)');

      this.svg.selectAll('.bx--axis--y path').style('display', 'none');
      this.svg.selectAll('.bx--axis path').attr('stroke', '#5A6872');
      this.svg.selectAll('.tick line').attr('stroke', '#5A6872');
      this.svg.selectAll('.tick text').attr('fill', '#5A6872');
    }
  }, {
    key: 'renderLabels',
    value: function renderLabels() {
      var _state4 = this.state,
          labelOffset = _state4.labelOffset,
          xAxisLabel = _state4.xAxisLabel,
          yAxisLabel = _state4.yAxisLabel,
          height = _state4.height,
          width = _state4.width;


      this.svg.select('.bx--axis--y').append('text').text('' + yAxisLabel).attr('class', 'bx--graph-label').attr('transform', 'translate(' + -labelOffset + ', ' + height / 2 + ') rotate(-90)');

      this.svg.select('.bx--axis--x').append('text').text('' + xAxisLabel).attr('class', 'bx--graph-label').attr('transform', 'translate(' + width / 2 + ', ' + labelOffset + ')');

      this.svg.selectAll('.bx--graph-label').attr('font-size', '10').attr('font-weight', '700').attr('fill', '#5A6872').attr('text-anchor', 'middle');
    }
  }, {
    key: 'renderPoints',
    value: function renderPoints() {
      var _this2 = this;

      var data = this.state.data;


      this.svg.append('g').attr('class', 'scatter-container').selectAll('circle').data(data).enter().append('circle').attr('class', 'circle').attr('cx', function (d) {
        return _this2.x(d[1]);
      }).attr('cy', function (d) {
        return _this2.y(d[0]);
      }).attr('fill', '#00a68f').attr('r', 0).transition().delay(function (d, i) {
        return i * 35;
      }).attr('r', 4);
    }
  }, {
    key: 'renderOverlay',
    value: function renderOverlay() {
      var _this3 = this;

      var _state5 = this.state,
          width = _state5.width,
          height = _state5.height,
          data = _state5.data;


      this.svg.append('rect').attr('width', width).attr('height', height).attr('class', 'overlay').style('fill', 'none').style('pointer-events', 'all').on('mousemove', function () {
        _this3.onMouseMove(data);
      });
    }
  }, {
    key: 'onMouseMove',
    value: function onMouseMove(data) {
      var margin = this.state.margin;

      var bisectDate = d3.bisector(function (d) {
        return d[1];
      }).right;

      var mouse = d3.mouse(this.refs.container)[0] - margin.left;
      var timestamp = this.x.invert(mouse);
      var index = bisectDate(data, timestamp);
      var d0 = data[index - 1];
      var d1 = data[index];
      var d = timestamp - d0[1] > d1[1] - timestamp ? d1 : d0;

      this.props.onHover(d);
    }
  }, {
    key: 'render',
    value: function render() {
      return React.createElement('svg', { ref: 'container' });
    }
  }]);

  return ScatterPlot;
}(Component);

ScatterPlot.propTypes = propTypes;
ScatterPlot.defaultProps = defaultProps;

export default ScatterPlot;