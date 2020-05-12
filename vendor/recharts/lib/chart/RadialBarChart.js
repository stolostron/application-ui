"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _propTypes = _interopRequireDefault(require("prop-types"));

var _generateCategoricalChart = _interopRequireDefault(require("./generateCategoricalChart"));

var _PolarAngleAxis = _interopRequireDefault(require("../polar/PolarAngleAxis"));

var _PolarRadiusAxis = _interopRequireDefault(require("../polar/PolarRadiusAxis"));

var _PolarUtils = require("../util/PolarUtils");

var _RadialBar = _interopRequireDefault(require("../polar/RadialBar"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * @fileOverview Radar Bar Chart
 */
var _default = (0, _generateCategoricalChart.default)({
  chartName: 'RadialBarChart',
  GraphicalChild: _RadialBar.default,
  legendContent: 'children',
  axisComponents: [{
    axisType: 'angleAxis',
    AxisComp: _PolarAngleAxis.default
  }, {
    axisType: 'radiusAxis',
    AxisComp: _PolarRadiusAxis.default
  }],
  formatAxisMap: _PolarUtils.formatAxisMap,
  defaultProps: {
    layout: 'radial',
    startAngle: 0,
    endAngle: 360,
    cx: '50%',
    cy: '50%',
    innerRadius: 0,
    outerRadius: '80%'
  },
  propTypes: {
    layout: _propTypes.default.oneOf(['radial']),
    startAngle: _propTypes.default.number,
    endAngle: _propTypes.default.number,
    cx: _propTypes.default.oneOfType([_propTypes.default.number, _propTypes.default.string]),
    cy: _propTypes.default.oneOfType([_propTypes.default.number, _propTypes.default.string]),
    innerRadius: _propTypes.default.oneOfType([_propTypes.default.number, _propTypes.default.string]),
    outerRadius: _propTypes.default.oneOfType([_propTypes.default.number, _propTypes.default.string])
  }
});

exports.default = _default;