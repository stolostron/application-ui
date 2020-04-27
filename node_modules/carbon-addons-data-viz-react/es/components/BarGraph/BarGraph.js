import _Object$getPrototypeOf from 'babel-runtime/core-js/object/get-prototype-of';
import _classCallCheck from 'babel-runtime/helpers/classCallCheck';
import _createClass from 'babel-runtime/helpers/createClass';
import _possibleConstructorReturn from 'babel-runtime/helpers/possibleConstructorReturn';
import _inherits from 'babel-runtime/helpers/inherits';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import DataTooltip from '../DataTooltip/DataTooltip';
import * as d3 from 'd3';
import _ from 'lodash';

var propTypes = {
  data: PropTypes.array,
  height: PropTypes.number,
  width: PropTypes.number,
  id: PropTypes.string,
  containerId: PropTypes.string,
  margin: PropTypes.object,
  labelOffsetX: PropTypes.number,
  labelOffsetY: PropTypes.number,
  axisOffset: PropTypes.number,
  timeFormat: PropTypes.string,
  xAxisLabel: PropTypes.string,
  yAxisLabel: PropTypes.string,
  onHover: PropTypes.func,
  onMouseOut: PropTypes.func,
  emptyText: PropTypes.string,
  color: PropTypes.array,
  showTooltip: PropTypes.bool
};

var defaultProps = {
  data: [[12, 1507563900000]],
  height: 300,
  width: 800,
  id: 'container',
  containerId: 'graph-container',
  margin: {
    top: 30,
    right: 20,
    bottom: 70,
    left: 65
  },
  labelOffsetX: 65,
  labelOffsetY: 55,
  axisOffset: 16,
  timeFormat: null,
  xAxisLabel: 'X Axis',
  yAxisLabel: 'Y Axis',
  onHover: function onHover() {},
  emptyText: 'There is currently no data available for the parameters selected. Please try a different combination.',
  color: ['#00A78F', '#3b1a40', '#473793', '#3c6df0', '#56D2BB'],
  showTooltip: true
};

var BarGraph = function (_Component) {
  _inherits(BarGraph, _Component);

  function BarGraph() {
    _classCallCheck(this, BarGraph);

    return _possibleConstructorReturn(this, (BarGraph.__proto__ || _Object$getPrototypeOf(BarGraph)).apply(this, arguments));
  }

  _createClass(BarGraph, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      var _props = this.props,
          width = _props.width,
          height = _props.height,
          margin = _props.margin,
          containerId = _props.containerId,
          emptyText = _props.emptyText;


      this.emptyContainer = d3.select('#' + containerId + ' .bx--bar-graph-empty-text').text(emptyText).style('position', 'absolute').style('top', '50%').style('left', '50%').style('text-align', 'center').style('transform', 'translate(-50%, -50%)');

      this.svg = d3.select('#' + containerId + ' svg').attr('class', 'bx--graph').attr('width', width).attr('height', height).append('g').attr('class', 'bx--group-container').attr('transform', 'translate(' + margin.left + ', ' + margin.top + ')');

      this.width = width - (margin.left + margin.right);
      this.height = height - (margin.top + margin.bottom);
      this.color = d3.scaleOrdinal(this.props.color);

      this.initialRender();
    }
  }, {
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps(nextProps) {
      if (nextProps.height != this.props.height || nextProps.width != this.props.width) {
        this.resize(nextProps.height, nextProps.width);
      }
    }
  }, {
    key: 'componentWillUpdate',
    value: function componentWillUpdate(nextProps) {
      if (this.x) {
        this.x.domain(nextProps.data.map(function (d) {
          return d[1];
        }));

        if (this.isGrouped) {
          var dataLength = nextProps.data[0][0].length;
          this.x1.rangeRound([0, this.x.bandwidth()]).domain(d3.range(dataLength));
          this.y.domain([0, d3.max(nextProps.data, function (d) {
            return d3.max(d[0], function (i) {
              return i;
            });
          })]);
        } else {
          this.y.domain([0, d3.max(nextProps.data, function (d) {
            return d[0];
          })]);
        }

        this.updateEmptyState(nextProps.data);
        this.updateData(nextProps);
      }
    }
  }, {
    key: 'shouldComponentUpdate',
    value: function shouldComponentUpdate(nextProps) {
      return !_.isEqual(this.props, nextProps);
    }
  }, {
    key: 'initialRender',
    value: function initialRender() {
      var _props2 = this.props,
          data = _props2.data,
          timeFormat = _props2.timeFormat;


      this.updateEmptyState(data);

      var dataLength = data[0][0].length;
      this.isGrouped = dataLength > 1;

      this.x = d3.scaleBand().rangeRound([0, this.width]).domain(data.map(function (d) {
        return d[1];
      })).padding(0.3);

      if (this.isGrouped) {
        this.x1 = d3.scaleBand().rangeRound([0, this.x.bandwidth()]).domain(d3.range(dataLength)).padding(0.05);

        this.y = d3.scaleLinear().range([this.height, 0]).domain([0, d3.max(data, function (d) {
          return d3.max(d[0], function (i) {
            return i;
          });
        })]);
      } else {
        this.y = d3.scaleLinear().range([this.height, 0]).domain([0, d3.max(data, function (d) {
          return d[0];
        })]);
      }

      this.xAxis = d3.axisBottom().scale(this.x).tickSize(0);

      if (timeFormat !== null) {
        this.xAxis.tickFormat(d3.timeFormat(timeFormat));
      }

      this.yAxis = d3.axisLeft().ticks(4).tickSize(-this.width).scale(this.y.nice());

      this.renderAxes();
      this.renderLabels();

      if (this.x) {
        this.renderBars();
      }
    }
  }, {
    key: 'renderAxes',
    value: function renderAxes() {
      var axisOffset = this.props.axisOffset;


      this.svg.append('g').attr('class', 'bx--axis bx--axis--y').attr('stroke-dasharray', '4').call(this.yAxis).selectAll('text').attr('x', -axisOffset);

      this.svg.append('g').attr('class', 'bx--axis bx--axis--x').attr('transform', 'translate(0, ' + this.height + ')').call(this.xAxis).selectAll('text').attr('y', axisOffset).style('text-anchor', 'middle');

      this.updateStyles();
    }
  }, {
    key: 'renderBars',
    value: function renderBars() {
      var _this2 = this;

      var data = this.props.data;


      var barContainer = this.svg.append('g').attr('class', 'bar-container');

      if (data.length > 1) {
        if (this.isGrouped) {
          this.count = 0;
          barContainer.selectAll('g').data(data).enter().append('g').attr('transform', function (d) {
            return 'translate(' + _this2.x(d[1]) + ', 0)';
          }).selectAll('rect').data(function (d) {
            _this2.count++;
            var itemLabel = d[1];
            return d[0].map(function (key, index) {
              return {
                key: key,
                index: index,
                group: _this2.count - 1,
                itemLabel: itemLabel
              };
            });
          }).enter().append('rect').attr('class', 'bar').attr('x', function (d) {
            return _this2.x1(d.index);
          }).attr('y', this.height).attr('width', this.x1.bandwidth()).attr('height', 0).attr('fill', function (d) {
            return _this2.color(d.index);
          }).attr('data-bar', function (d) {
            return d.index + '-' + d.group;
          }).transition().duration(500).delay(function (d, i) {
            return i * 50;
          }).attr('y', function (d) {
            return _this2.y(d.key);
          }).attr('height', function (d) {
            return _this2.height - _this2.y(d.key);
          });
        } else {
          barContainer.selectAll('rect').data(data).enter().append('rect').attr('class', 'bar').attr('x', function (d) {
            return _this2.x(d[1]);
          }).attr('y', this.height).attr('height', 0).attr('width', this.x.bandwidth()).attr('fill', this.color(0)).attr('data-bar', function (d, i) {
            return i + '-0';
          }).transition().duration(500).delay(function (d, i) {
            return i * 50;
          }).attr('y', function (d) {
            return _this2.y(d[0]);
          }).attr('height', function (d) {
            return _this2.height - _this2.y(d[0]);
          });
        }

        barContainer.selectAll('rect').on('mouseover', function (d, i) {
          return _this2.onMouseEnter(d, i);
        }).on('mouseout', function (d, i) {
          return _this2.onMouseOut(d, i);
        });
      }
    }
  }, {
    key: 'renderLabels',
    value: function renderLabels() {
      var _props3 = this.props,
          labelOffsetY = _props3.labelOffsetY,
          labelOffsetX = _props3.labelOffsetX,
          xAxisLabel = _props3.xAxisLabel,
          yAxisLabel = _props3.yAxisLabel;


      this.svg.select('.bx--axis--y').append('text').text('' + yAxisLabel).attr('class', 'bx--graph-label').attr('transform', 'translate(' + -labelOffsetY + ', ' + this.height / 2 + ') rotate(-90)');

      this.svg.select('.bx--axis--x').append('text').text('' + xAxisLabel).attr('class', 'bx--graph-label').attr('transform', 'translate(' + this.width / 2 + ', ' + labelOffsetX + ')');

      this.svg.selectAll('.bx--graph-label').attr('font-size', '10').attr('font-weight', '700').attr('fill', '#5A6872').attr('text-anchor', 'middle');
    }
  }, {
    key: 'getMouseData',
    value: function getMouseData(d, i) {
      var mouseData = void 0;

      if (d.key) {
        mouseData = {
          data: [d.key],
          index: d.index,
          group: d.group,
          label: d.itemLabel
        };
      } else {
        mouseData = {
          data: [d[0][0]] || [d[0]],
          index: i,
          group: 0,
          label: d[1]
        };
      }

      return mouseData;
    }
  }, {
    key: 'onMouseEnter',
    value: function onMouseEnter(d, i) {
      var _props4 = this.props,
          timeFormat = _props4.timeFormat,
          showTooltip = _props4.showTooltip,
          height = _props4.height,
          labelOffsetX = _props4.labelOffsetX,
          seriesLabels = _props4.seriesLabels;

      var mouseData = this.getMouseData(d, i);

      var rect = this.svg.select('rect[data-bar="' + mouseData.index + '-' + mouseData.group + '"]');
      rect.attr('fill', d3.color(rect.attr('fill')).darker());

      var xVal = mouseData.label;
      if (timeFormat) {
        var format = d3.timeFormat(timeFormat);

        mouseData.label = format(mouseData.label);
      }

      this.props.onHover(mouseData);

      if (showTooltip) {
        ReactDOM.render(React.createElement(DataTooltip, {
          data: [{
            data: mouseData.data[0],
            label: seriesLabels ? seriesLabels[mouseData.index] : mouseData.label,
            color: rect.attr('fill')
          }]
        }), this.tooltipId);
        var tooltipSize = d3.select(this.tooltipId.children[0]).node().getBoundingClientRect();
        var offset = -tooltipSize.width / 2;

        d3.select(this.tooltipId).style('position', 'relative').style('left', this.x(xVal) + (this.x1 ? this.x1(mouseData.index) : 0) + labelOffsetX + offset + (this.x1 ? this.x1.bandwidth() / 2 : this.x.bandwidth() / 2) + 'px').style('top', this.y(mouseData.data[0]) - height - tooltipSize.height + 10 + 'px');
      }
    }
  }, {
    key: 'onMouseOut',
    value: function onMouseOut(d, i) {
      var _this3 = this;

      var mouseData = this.getMouseData(d, i);

      var rect = this.svg.select('rect[data-bar="' + mouseData.index + '-' + mouseData.group + '"]');

      rect.transition().duration(500).attr('fill', function () {
        return _this3.isGrouped ? _this3.color(mouseData.index) : _this3.color(0);
      });
      ReactDOM.unmountComponentAtNode(this.tooltipId);
    }
  }, {
    key: 'resize',
    value: function resize(height, width) {
      var _props5 = this.props,
          margin = _props5.margin,
          containerId = _props5.containerId;


      this.height = height - (margin.top + margin.bottom);
      this.width = width - (margin.left + margin.right);

      this.svg.selectAll('*').remove();

      this.svg = d3.select('#' + containerId + ' svg').attr('class', 'bx--graph').attr('width', width).attr('height', height).append('g').attr('class', 'bx--group-container').attr('transform', 'translate(' + margin.left + ', ' + margin.top + ')');

      this.initialRender();
    }
  }, {
    key: 'updateData',
    value: function updateData(nextProps) {
      var axisOffset = nextProps.axisOffset,
          xAxisLabel = nextProps.xAxisLabel,
          yAxisLabel = nextProps.yAxisLabel;


      this.svg.selectAll('g.bar-container').remove();

      this.svg.select('.bx--axis--y').transition().call(this.yAxis).selectAll('text').attr('x', -axisOffset);

      this.svg.select('.bx--axis--y .bx--graph-label').text(yAxisLabel);

      this.svg.select('.bx--axis--x').transition().call(this.xAxis).selectAll('.bx--axis--x .tick text').attr('y', axisOffset).style('text-anchor', 'middle');

      this.svg.select('.bx--axis--x .bx--graph-label').text(xAxisLabel);

      this.updateStyles();
    }
  }, {
    key: 'updateEmptyState',
    value: function updateEmptyState(data) {
      if (data.length < 2) {
        this.svg.style('opacity', '.3');
        this.emptyContainer.style('display', 'inline-block');
      } else {
        this.svg.style('opacity', '1');
        this.emptyContainer.style('display', 'none');
      }
    }
  }, {
    key: 'updateStyles',
    value: function updateStyles() {
      this.svg.selectAll('.bx--axis--y path').style('display', 'none');
      this.svg.selectAll('.bx--axis path').attr('stroke', '#5A6872');
      this.svg.selectAll('.tick line').attr('stroke', '#5A6872');
      this.svg.selectAll('.tick text').attr('fill', '#5A6872');
    }
  }, {
    key: 'render',
    value: function render() {
      var _this4 = this;

      var _props6 = this.props,
          id = _props6.id,
          containerId = _props6.containerId;


      if (this.x) {
        this.renderBars();
      }

      return React.createElement(
        'div',
        {
          className: 'bx--graph-container',
          id: containerId,
          style: { position: 'relative' } },
        React.createElement('p', { className: 'bx--bar-graph-empty-text' }),
        React.createElement('svg', { id: id, ref: function ref(id) {
            return _this4.id = id;
          } }),
        React.createElement('div', { id: 'tooltip-div', ref: function ref(id) {
            return _this4.tooltipId = id;
          } })
      );
    }
  }]);

  return BarGraph;
}(Component);

BarGraph.propTypes = propTypes;
BarGraph.defaultProps = defaultProps;

export default BarGraph;