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

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var propTypes = {
  data: _propTypes2.default.array,
  radius: _propTypes2.default.number,
  formatFunction: _propTypes2.default.func,
  id: _propTypes2.default.string,
  color: _propTypes2.default.array,
  onHover: _propTypes2.default.func
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
  (0, _inherits3.default)(PieChart, _Component);

  function PieChart() {
    (0, _classCallCheck3.default)(this, PieChart);
    return (0, _possibleConstructorReturn3.default)(this, (PieChart.__proto__ || (0, _getPrototypeOf2.default)(PieChart)).apply(this, arguments));
  }

  (0, _createClass3.default)(PieChart, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      this.width = this.props.radius * 2;
      this.height = this.props.radius * 2 + 24;

      this.renderSVG();
    }
  }, {
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps(nextProps) {
      if (!_lodash2.default.isEqual(this.props, nextProps)) {
        this.renderSVG(nextProps);
      }
    }
  }, {
    key: 'shouldComponentUpdate',
    value: function shouldComponentUpdate(nextProps) {
      return !_lodash2.default.isEqual(this.props, nextProps);
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

      return _react2.default.createElement(
        'div',
        {
          className: 'bx--graph-container',
          id: id,
          style: {
            position: 'relative',
            width: this.width,
            height: this.height
          } },
        _react2.default.createElement('svg', { ref: function ref(node) {
            return _this2.svgNode = node;
          } }),
        _react2.default.createElement(
          'div',
          { className: 'bx--pie-tooltip', style: tooltipStyles },
          _react2.default.createElement('p', { className: 'bx--pie-value', style: valueStyles }),
          _react2.default.createElement('p', { className: 'bx--pie-key', style: keyStyles })
        )
      );
    }
  }]);
  return PieChart;
}(_react.Component);

PieChart.propTypes = propTypes;
PieChart.defaultProps = defaultProps;

exports.default = PieChart;