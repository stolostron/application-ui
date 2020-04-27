import _Object$getPrototypeOf from 'babel-runtime/core-js/object/get-prototype-of';
import _classCallCheck from 'babel-runtime/helpers/classCallCheck';
import _createClass from 'babel-runtime/helpers/createClass';
import _possibleConstructorReturn from 'babel-runtime/helpers/possibleConstructorReturn';
import _inherits from 'babel-runtime/helpers/inherits';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import * as d3 from 'd3';
import _ from 'lodash';

var propTypes = {
  data: PropTypes.array,
  radius: PropTypes.number,
  formatFunction: PropTypes.func,
  id: PropTypes.string,
  color: PropTypes.array,
  onHover: PropTypes.func
};

var defaultProps = {
  data: [['Gryffindor', 100]],
  radius: 96,
  formatFunction: function formatFunction(value) {
    return value;
  },
  color: ['#00a68f', '#3b1a40', '#473793', '#3c6df0', '#56D2BB'],
  id: 'graph-container'
};

var PieChart = function (_Component) {
  _inherits(PieChart, _Component);

  function PieChart() {
    _classCallCheck(this, PieChart);

    return _possibleConstructorReturn(this, (PieChart.__proto__ || _Object$getPrototypeOf(PieChart)).apply(this, arguments));
  }

  _createClass(PieChart, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      this.width = this.props.radius * 2;
      this.height = this.props.radius * 2 + 24;

      this.renderSVG();
    }
  }, {
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps(nextProps) {
      if (!_.isEqual(this.props, nextProps)) {
        this.renderSVG(nextProps);
      }
    }
  }, {
    key: 'shouldComponentUpdate',
    value: function shouldComponentUpdate(nextProps) {
      return !_.isEqual(this.props, nextProps);
    }
  }, {
    key: 'renderSVG',
    value: function renderSVG() {
      var _props = this.props,
          data = _props.data,
          radius = _props.radius,
          formatFunction = _props.formatFunction,
          id = _props.id,
          onHover = _props.onHover;

      var color = d3.scaleOrdinal(this.props.color);

      this.svg = d3.select(this.svgNode).attr('width', this.width).attr('height', this.height).append('g').attr('class', 'group-container').attr('transform', 'translate(' + this.width / 2 + ', ' + this.height / 2 + ')');

      var pie = d3.pie().sort(null).value(function (d) {
        return d[1];
      });
      var path = d3.arc().outerRadius(radius - 10).innerRadius(radius - 40);
      var pathTwo = d3.arc().outerRadius(radius).innerRadius(radius - 40);

      var arc = this.svg.selectAll('.arc').data(pie(data)).enter().append('g').attr('class', 'arc');

      var arcs = arc.append('path').attr('fill', function (d, i) {
        return color(i);
      }).attr('stroke-width', 2).attr('stroke', '#FFFFFF').attr('d', path);

      arcs.on('mouseover', function (d) {
        d3.select(this).transition().style('cursor', 'pointer').attr('d', pathTwo);

        d3.select('#' + id + ' .bx--pie-tooltip').style('display', 'inherit');
        d3.select('#' + id + ' .bx--pie-key').text('' + d.data[0]);
        d3.select('#' + id + ' .bx--pie-value').text('' + formatFunction(d.data[1]));
        if (onHover) {
          onHover(true, d.data[0]);
        }
      }).on('mouseout', function () {
        d3.select('#' + id + ' .bx--pie-tooltip').style('display', 'none');
        d3.select(this).transition().attr('d', path);
        if (onHover) {
          onHover(false);
        }
      });
    }
  }, {
    key: 'render',
    value: function render() {
      var _this2 = this;

      var id = this.props.id;

      var tooltipStyles = {
        display: 'none',
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)'
      };

      var keyStyles = {
        fontSize: '14px',
        fontWeight: '400',
        textAlign: 'center',
        color: '#5A6872'
      };

      var valueStyles = {
        fontSize: '29px',
        fontWeight: '300',
        textAlign: 'center',
        lineHeight: '1'
      };

      this.renderSVG();

      return React.createElement(
        'div',
        {
          className: 'bx--graph-container',
          id: id,
          style: {
            position: 'relative',
            width: this.width,
            height: this.height
          } },
        React.createElement('svg', { ref: function ref(node) {
            return _this2.svgNode = node;
          } }),
        React.createElement(
          'div',
          { className: 'bx--pie-tooltip', style: tooltipStyles },
          React.createElement('p', { className: 'bx--pie-value', style: valueStyles }),
          React.createElement('p', { className: 'bx--pie-key', style: keyStyles })
        )
      );
    }
  }]);

  return PieChart;
}(Component);

PieChart.propTypes = propTypes;
PieChart.defaultProps = defaultProps;

export default PieChart;