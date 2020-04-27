import _Object$getPrototypeOf from 'babel-runtime/core-js/object/get-prototype-of';
import _classCallCheck from 'babel-runtime/helpers/classCallCheck';
import _createClass from 'babel-runtime/helpers/createClass';
import _possibleConstructorReturn from 'babel-runtime/helpers/possibleConstructorReturn';
import _inherits from 'babel-runtime/helpers/inherits';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import * as d3 from 'd3';

var propTypes = {
  radius: PropTypes.number,
  padding: PropTypes.number,
  amount: PropTypes.number,
  total: PropTypes.number,
  size: PropTypes.string,
  gaugePercentages: PropTypes.array,
  id: PropTypes.string,
  tooltipId: PropTypes.string,
  tau: PropTypes.number,
  labelText: PropTypes.string,
  valueText: PropTypes.string
};

var defaultProps = {
  tau: 2 * Math.PI,
  radius: 80,
  padding: 30,
  amount: 75,
  total: 100,
  valueText: '75%',
  labelText: '75 out of 100GB',
  size: 'full',
  fillColor: '#00a68f',
  gaugePercentages: [{ low: 0, high: 50, color: '#4B8400' }, { low: 50, high: 75, color: '#EFC100' }, { low: 75, high: 100, color: '#FF5050' }],
  id: 'gauge-container',
  tooltipId: 'tooltip-container'
};

var GaugeGraph = function (_Component) {
  _inherits(GaugeGraph, _Component);

  function GaugeGraph() {
    var _ref;

    var _temp, _this, _ret;

    _classCallCheck(this, GaugeGraph);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = GaugeGraph.__proto__ || _Object$getPrototypeOf(GaugeGraph)).call.apply(_ref, [this].concat(args))), _this), _this.state = {
      boxSize: 0,
      ratio: 0
    }, _temp), _possibleConstructorReturn(_this, _ret);
  }

  _createClass(GaugeGraph, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      var _props = this.props,
          radius = _props.radius,
          padding = _props.padding,
          amount = _props.amount,
          total = _props.total;


      this.setState(function () {
        return {
          boxSize: (radius + padding) * 2,
          ratio: amount / total
        };
      }, this.initialRender);
    }
  }, {
    key: 'initialRender',
    value: function initialRender() {
      var boxSize = this.state.boxSize;
      var _props2 = this.props,
          size = _props2.size,
          padding = _props2.padding,
          id = _props2.id;


      this.svg = d3.select('#' + id).attr('width', boxSize).attr('height', size === 'half' ? boxSize / 2 + padding : boxSize).append('g').attr('transform', 'translate(' + boxSize / 2 + ', ' + boxSize / 2 + ')');

      this.renderSVG();
      this.renderLabels();
    }
  }, {
    key: 'renderSVG',
    value: function renderSVG() {
      var _props3 = this.props,
          tau = _props3.tau,
          radius = _props3.radius,
          size = _props3.size,
          gaugePercentages = _props3.gaugePercentages,
          id = _props3.id,
          fillColor = _props3.fillColor;
      var ratio = this.state.ratio;

      // Transition function

      var arcTween = function arcTween(newAngle) {
        return function (d) {
          var interpolate = void 0;
          if (size === 'half') {
            interpolate = d3.interpolate(d.endAngle, Math.PI * (newAngle / tau));

            var line = d3.select('#' + id + ' .bx--gauge-line');
            var percent = newAngle / tau * 100;

            line.style('fill', function () {
              var color = void 0;
              gaugePercentages.forEach(function (range) {
                if (percent >= range.low && percent <= range.high) {
                  color = range.color;
                }
              });

              return color;
            });
          } else {
            interpolate = d3.interpolate(d.endAngle, newAngle);
          }

          return function (t) {
            d.endAngle = interpolate(t);
            return arc(d);
          };
        };
      };

      var arc = d3.arc().innerRadius(radius).outerRadius(radius - 10).startAngle(0);

      this.svg.append('path').datum({ endAngle: size === 'half' ? Math.PI : tau }).style('fill', '#dfe3e6').attr('d', arc).attr('transform', '' + (size === 'half' ? 'rotate(-90)' : ''));

      this.svg.append('path').datum({ endAngle: 0 }).style('fill', fillColor).attr('transform', '' + (size === 'half' ? 'rotate(-90)' : '')).attr('class', 'bx--gauge-line').transition().duration(1000).delay(1000).attrTween('d', arcTween(ratio * tau));
    }
  }, {
    key: 'renderLabels',
    value: function renderLabels() {
      var _props4 = this.props,
          valueText = _props4.valueText,
          labelText = _props4.labelText,
          tooltipId = _props4.tooltipId;


      d3.select('#' + tooltipId + ' .bx--gauge-amount').style('opacity', 0).transition().duration(1000).delay(1500).style('opacity', 1).text('' + valueText);

      d3.select('#' + tooltipId + ' .bx--gauge-total').style('opacity', 0).transition().duration(1000).delay(1700).style('opacity', 1).text('' + labelText);
    }
  }, {
    key: 'render',
    value: function render() {
      var _props5 = this.props,
          size = _props5.size,
          tooltipId = _props5.tooltipId,
          id = _props5.id;

      var tooltipStyles = {
        position: 'absolute',
        top: '' + (size === 'half' ? '60%' : '50%'),
        left: '50%',
        transform: 'translate(-50%, -50%)'
      };

      var amountStyles = {
        textAlign: 'center',
        fontSize: '30px',
        fontWeight: '600',
        lineHeight: '1',
        margin: '0',
        marginBottom: '.25rem'
      };

      var totalStyles = {
        fontSize: '14px',
        margin: '0',
        lineHeight: '1',
        whiteSpace: 'nowrap'
      };

      return React.createElement(
        'div',
        {
          className: 'bx--graph-container',
          style: { position: 'relative', width: this.state.boxSize } },
        React.createElement('svg', { id: id }),
        React.createElement(
          'div',
          { className: 'bx--gauge-tooltip', id: tooltipId, style: tooltipStyles },
          React.createElement(
            'p',
            { className: 'bx--gauge-amount', style: amountStyles },
            'Place'
          ),
          React.createElement(
            'p',
            { className: 'bx--gauge-total', style: totalStyles },
            'Holder'
          )
        )
      );
    }
  }]);

  return GaugeGraph;
}(Component);

GaugeGraph.propTypes = propTypes;
GaugeGraph.defaultProps = defaultProps;

export default GaugeGraph;