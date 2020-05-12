'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _objectWithoutProperties2 = require('babel-runtime/helpers/objectWithoutProperties');

var _objectWithoutProperties3 = _interopRequireDefault(_objectWithoutProperties2);

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

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var propTypes = {
  className: _propTypes2.default.string,
  data: _propTypes2.default.array,
  direction: _propTypes2.default.string,
  id: _propTypes2.default.string,
  heading: _propTypes2.default.string,
  isActive: _propTypes2.default.bool
};

var defaultProps = {
  data: [100],
  direction: 'top',
  id: 'bx--data-tooltip',
  heading: null,
  isActive: true
};

var DataTooltip = function (_Component) {
  (0, _inherits3.default)(DataTooltip, _Component);

  function DataTooltip() {
    (0, _classCallCheck3.default)(this, DataTooltip);
    return (0, _possibleConstructorReturn3.default)(this, (DataTooltip.__proto__ || (0, _getPrototypeOf2.default)(DataTooltip)).apply(this, arguments));
  }

  (0, _createClass3.default)(DataTooltip, [{
    key: 'renderTooltipData',
    value: function renderTooltipData() {
      var _props = this.props,
          data = _props.data,
          heading = _props.heading;

      var items = data.map(function (item, i) {
        var divStyle = void 0;
        if (item.color) {
          if (data.length > 1 && heading) {
            divStyle = {
              borderLeft: '4px solid ' + item.color
            };
          }
        }

        var tooltipItemClasses = (0, _classnames2.default)('bx--data-tooltip-list-item', {
          'bx--data-tooltip__base': !item.color && data.length <= 1
        }, {
          'bx--data-tooltip__single': item.color && data.length <= 1
        }, {
          'bx--data-tooltip__multiple': item.color && data.length > 1
        }, {
          'bx--data-tooltip__multiple--right': item.color && data.length > 3 && i >= data.length / 2
        }, {
          'bx--data-tooltip__multiple--left': item.color && data.length > 3 && i < data.length / 2
        });

        return _react2.default.createElement(
          'li',
          { key: i, style: divStyle, className: tooltipItemClasses },
          item.label && _react2.default.createElement(
            'span',
            { className: 'bx--data-tooltip-list-item__label' },
            item.label
          ),
          _react2.default.createElement(
            'span',
            { className: 'bx--data-tooltip-list-item__data' },
            item.data
          )
        );
      });

      return items;
    }
  }, {
    key: 'render',
    value: function render() {
      var _props2 = this.props,
          className = _props2.className,
          direction = _props2.direction,
          heading = _props2.heading,
          isActive = _props2.isActive,
          data = _props2.data,
          other = (0, _objectWithoutProperties3.default)(_props2, ['className', 'direction', 'heading', 'isActive', 'data']);


      var tooltipClasses = (0, _classnames2.default)('bx--tooltip', 'bx--data-tooltip', {
        'bx--tooltip--shown': isActive
      }, className);

      var tooltipListClasses = (0, _classnames2.default)('bx--data-tooltip-list', {
        'bx--data-tooltip-list--block': data.length >= 4
      });

      var listStyle = {
        columnCount: data.length > 3 ? '2' : '1',
        columnGap: '1.25rem'
      };

      var headingClasses = (0, _classnames2.default)('bx--data-tooltip__label', {
        'bx--data-tooltip__label--no-margin': data.length === 1
      });

      if (data.length === 1 && data[0].color) {
        if (direction === 'top') {
          listStyle.borderTop = '4px solid ' + data[0].color;
        } else if (direction === 'bottom') {
          listStyle.borderBottom = '4px solid ' + data[0].color;
        }
      }

      return _react2.default.createElement(
        'div',
        (0, _extends3.default)({
          className: tooltipClasses,
          'data-floating-menu-direction': direction
        }, other),
        heading && _react2.default.createElement(
          'p',
          { className: headingClasses },
          heading
        ),
        _react2.default.createElement(
          'ul',
          { className: tooltipListClasses, style: listStyle },
          this.renderTooltipData()
        )
      );
    }
  }]);
  return DataTooltip;
}(_react.Component);

DataTooltip.propTypes = propTypes;
DataTooltip.defaultProps = defaultProps;

exports.default = DataTooltip;