'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

var Loading = function Loading(_ref) {
  var className = _ref.className,
      title = _ref.title,
      text = _ref.text,
      other = _objectWithoutProperties(_ref, ['className', 'title', 'text']);

  var LoadingClasses = (0, _classnames2.default)(_defineProperty({
    'bx--cloud-loading': true
  }, className, className));

  return _react2.default.createElement(
    'div',
    _extends({}, other, { className: LoadingClasses }),
    _react2.default.createElement(
      'svg',
      { viewBox: '0 0 275.76529 243.9836' },
      _react2.default.createElement(
        'defs',
        null,
        _react2.default.createElement(
          'linearGradient',
          {
            id: 'bx--cloud-loading__linear-gradient',
            x1: '4979.47428',
            y1: '10122.53345',
            x2: '5087.70329',
            y2: '10103.44977',
            gradientTransform: 'matrix(-0.70711, -0.70711, -0.70711, 0.70711, 10825.52561, -3473.05293)',
            gradientUnits: 'userSpaceOnUse' },
          _react2.default.createElement('stop', { stopColor: 'currentColor', offset: '0.2', stopOpacity: '0' }),
          _react2.default.createElement('stop', {
            stopColor: 'currentColor',
            offset: '0.28658',
            stopOpacity: '0.02999'
          }),
          _react2.default.createElement('stop', { stopColor: 'currentColor', offset: '0.50065', stopOpacity: '0.2' }),
          _react2.default.createElement('stop', {
            stopColor: 'currentColor',
            offset: '0.79313',
            stopOpacity: '0.74185'
          }),
          _react2.default.createElement('stop', { stopColor: 'currentColor', offset: '1' })
        ),
        _react2.default.createElement(
          'linearGradient',
          {
            id: 'bx--cloud-loading__linear-gradient-2',
            x1: '-0.35704',
            y1: '51.7483',
            x2: '63.08724',
            y2: '88.37787',
            gradientTransform: 'matrix(1, 0, 0, -1, -5.791, 224.13485)',
            gradientUnits: 'userSpaceOnUse' },
          _react2.default.createElement('stop', { stopColor: 'currentColor', offset: '0.08' }),
          _react2.default.createElement('stop', {
            stopColor: 'currentColor',
            offset: '0.75275',
            stopOpacity: '0.07'
          }),
          _react2.default.createElement('stop', { stopColor: 'currentColor', offset: '0.8746', stopOpacity: '0' })
        ),
        _react2.default.createElement(
          'linearGradient',
          {
            id: 'bx--cloud-loading__linear-gradient-3',
            x1: '144.66538',
            y1: '44.83737',
            x2: '241.17236',
            y2: '125.81633',
            gradientTransform: 'matrix(1, 0, 0, -1, -5.791, 224.13485)',
            gradientUnits: 'userSpaceOnUse' },
          _react2.default.createElement('stop', { stopColor: 'currentColor', offset: '0.1381', stopOpacity: '0' }),
          _react2.default.createElement('stop', { stopColor: 'currentColor', offset: '0.3197', stopOpacity: '0.07' }),
          _react2.default.createElement('stop', {
            stopColor: 'currentColor',
            offset: '0.84728',
            stopOpacity: '0.76377'
          }),
          _react2.default.createElement('stop', { stopColor: 'currentColor', offset: '0.94689' })
        )
      ),
      _react2.default.createElement(
        'title',
        null,
        title
      ),
      _react2.default.createElement('path', {
        className: 'bx--cloud-loading__think bx--cloud-loading__think--left',
        d: 'M36.69694,97.3667a5.19476,5.19476,0,0,1-2.60352-.69971L9.18913,82.28809a5.21738,5.21738,0,1,1,5.2168-9.03711l24.9043,14.37891a5.21794,5.21794,0,0,1-2.61328,9.73682Z'
      }),
      _react2.default.createElement('path', {
        className: 'bx--cloud-loading__think bx--cloud-loading__think--left-center',
        d: 'M79.29264,54.78125a5.21521,5.21521,0,0,1-4.52344-2.60937L60.3903,27.2666a5.21763,5.21763,0,0,1,9.03711-5.21777L83.80632,46.9541a5.219,5.219,0,0,1-4.51367,7.82715Z'
      }),
      _react2.default.createElement('path', {
        className: 'bx--cloud-loading__think bx--cloud-loading__think--center',
        d: 'M137.46061,39.19238a5.21749,5.21749,0,0,1-5.21777-5.21729V5.21729a5.21777,5.21777,0,0,1,10.43555,0V33.9751A5.21749,5.21749,0,0,1,137.46061,39.19238Z'
      }),
      _react2.default.createElement('path', {
        className: 'bx--cloud-loading__think bx--cloud-loading__think--right-center',
        d: 'M195.62956,54.78125a5.219,5.219,0,0,1-4.51367-7.82715l14.37891-24.90527a5.21763,5.21763,0,0,1,9.03711,5.21777L200.153,52.17188A5.21638,5.21638,0,0,1,195.62956,54.78125Z'
      }),
      _react2.default.createElement('path', {
        className: 'bx--cloud-loading__think bx--cloud-loading__think--right',
        d: 'M238.22526,97.3667a5.21794,5.21794,0,0,1-2.61328-9.73682L260.51628,73.251a5.21738,5.21738,0,1,1,5.2168,9.03711L240.82878,96.667A5.19476,5.19476,0,0,1,238.22526,97.3667Z'
      }),
      _react2.default.createElement('path', {
        className: 'bx--cloud-loading__gradient--1',
        d: 'M71.2321,216.54785A93.66041,93.66041,0,0,1,203.68717,84.09131a95.02928,95.02928,0,0,1,7.45117,8.3877c1.60742,2.04395,3.13867,4.16455,4.5498,6.30322l-8.709,5.748c-1.25292-1.89844-2.61229-3.78174-4.041-5.59766a84.49419,84.49419,0,0,0-6.627-7.46045A83.22609,83.22609,0,0,0,78.613,209.17285Z'
      }),
      _react2.default.createElement('path', { d: 'M204.22915,243.98438c-.1826,0-.36327-.001-.54686-.002H60.08268A60.49514,60.49514,0,0,1,.00163,183.03809l10.43555.07813a50.05763,50.05763,0,0,0,49.68457,50.43066H203.72135c.15234.001.31055.002.46289.002a61.11664,61.11664,0,0,0,45.582-101.86133l7.77734-6.957a71.55152,71.55152,0,0,1-53.31447,119.25391Z' }),
      _react2.default.createElement('path', {
        className: 'bx--cloud-loading__gradient--2',
        d: 'M10.43717,183.11621.00163,183.03809a60.42922,60.42922,0,0,1,50.40918-59.207L52.153,134.12012A50.006,50.006,0,0,0,10.43717,183.11621Z'
      }),
      _react2.default.createElement('path', {
        className: 'bx--cloud-loading__gradient--3',
        d: 'M143.10221,171.97754l-10.43555-.07812a71.5508,71.5508,0,0,1,124.877-47.16895l-7.77734,6.957a61.115,61.115,0,0,0-106.66406,40.29Z'
      })
    )
  );
};

Loading.propTypes = {
  className: _propTypes2.default.string,
  title: _propTypes2.default.string
};

Loading.defaultProps = {
  title: 'IBM Cloud Loading'
};

exports.default = Loading;