import _extends from 'babel-runtime/helpers/extends';
import _objectWithoutProperties from 'babel-runtime/helpers/objectWithoutProperties';
import _Object$getPrototypeOf from 'babel-runtime/core-js/object/get-prototype-of';
import _classCallCheck from 'babel-runtime/helpers/classCallCheck';
import _createClass from 'babel-runtime/helpers/createClass';
import _possibleConstructorReturn from 'babel-runtime/helpers/possibleConstructorReturn';
import _inherits from 'babel-runtime/helpers/inherits';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import classNames from 'classnames';

var propTypes = {
  className: PropTypes.string,
  data: PropTypes.array,
  direction: PropTypes.string,
  id: PropTypes.string,
  heading: PropTypes.string,
  isActive: PropTypes.bool
};

var defaultProps = {
  data: [100],
  direction: 'top',
  id: 'bx--data-tooltip',
  heading: null,
  isActive: true
};

var DataTooltip = function (_Component) {
  _inherits(DataTooltip, _Component);

  function DataTooltip() {
    _classCallCheck(this, DataTooltip);

    return _possibleConstructorReturn(this, (DataTooltip.__proto__ || _Object$getPrototypeOf(DataTooltip)).apply(this, arguments));
  }

  _createClass(DataTooltip, [{
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

        var tooltipItemClasses = classNames('bx--data-tooltip-list-item', {
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

        return React.createElement(
          'li',
          { key: i, style: divStyle, className: tooltipItemClasses },
          item.label && React.createElement(
            'span',
            { className: 'bx--data-tooltip-list-item__label' },
            item.label
          ),
          React.createElement(
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
          other = _objectWithoutProperties(_props2, ['className', 'direction', 'heading', 'isActive', 'data']);

      var tooltipClasses = classNames('bx--tooltip', 'bx--data-tooltip', {
        'bx--tooltip--shown': isActive
      }, className);

      var tooltipListClasses = classNames('bx--data-tooltip-list', {
        'bx--data-tooltip-list--block': data.length >= 4
      });

      var listStyle = {
        columnCount: data.length > 3 ? '2' : '1',
        columnGap: '1.25rem'
      };

      var headingClasses = classNames('bx--data-tooltip__label', {
        'bx--data-tooltip__label--no-margin': data.length === 1
      });

      if (data.length === 1 && data[0].color) {
        if (direction === 'top') {
          listStyle.borderTop = '4px solid ' + data[0].color;
        } else if (direction === 'bottom') {
          listStyle.borderBottom = '4px solid ' + data[0].color;
        }
      }

      return React.createElement(
        'div',
        _extends({
          className: tooltipClasses,
          'data-floating-menu-direction': direction
        }, other),
        heading && React.createElement(
          'p',
          { className: headingClasses },
          heading
        ),
        React.createElement(
          'ul',
          { className: tooltipListClasses, style: listStyle },
          this.renderTooltipData()
        )
      );
    }
  }]);

  return DataTooltip;
}(Component);

DataTooltip.propTypes = propTypes;
DataTooltip.defaultProps = defaultProps;

export default DataTooltip;