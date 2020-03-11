'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

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

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _d = require('d3');

var d3 = _interopRequireWildcard(_d);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var propTypes = {
  radius: _propTypes2.default.number,
  padding: _propTypes2.default.number,
  amount: _propTypes2.default.number,
  total: _propTypes2.default.number,
  size: _propTypes2.default.string,
  gaugePercentages: _propTypes2.default.array,
  id: _propTypes2.default.string,
  tooltipId: _propTypes2.default.string,
  tau: _propTypes2.default.number,
  labelText: _propTypes2.default.string,
  valueText: _propTypes2.default.string
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
  (0, _inherits3.default)(GaugeGraph, _Component);

  function GaugeGraph() {
    var _ref;

    var _temp, _this, _ret;

    (0, _classCallCheck3.default)(this, GaugeGraph);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = (0, _possibleConstructorReturn3.default)(this, (_ref = GaugeGraph.__proto__ || (0, _getPrototypeOf2.default)(GaugeGraph)).call.apply(_ref, [this].concat(args))), _this), _this.state = {
      boxSize: 0,
      ratio: 0
    }, _temp), (0, _possibleConstructorReturn3.default)(_this, _ret);
  }

  (0, _createClass3.default)(GaugeGraph, [{
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

      return _react2.default.createElement(
        'div',
        {
          className: 'bx--graph-container',
          style: { position: 'relative', width: this.state.boxSize } },
        _react2.default.createElement('svg', { id: id }),
        _react2.default.createElement(
          'div',
          { className: 'bx--gauge-tooltip', id: tooltipId, style: tooltipStyles },
          _react2.default.createElement(
            'p',
            { className: 'bx--gauge-amount', style: amountStyles },
            'Place'
          ),
          _react2.default.createElement(
            'p',
            { className: 'bx--gauge-total', style: totalStyles },
            'Holder'
          )
        )
      );
    }
  }]);
  return GaugeGraph;
}(_react.Component);

GaugeGraph.propTypes = propTypes;
GaugeGraph.defaultProps = defaultProps;

exports.default = GaugeGraph;