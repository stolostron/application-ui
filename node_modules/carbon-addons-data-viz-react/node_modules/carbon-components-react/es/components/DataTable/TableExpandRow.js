function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

import cx from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import Icon from '../Icon';
import TableCell from './TableCell';

var TableExpandRow = function TableExpandRow(_ref) {
  var ariaLabel = _ref.ariaLabel,
      rowClassName = _ref.className,
      children = _ref.children,
      isExpanded = _ref.isExpanded,
      onExpand = _ref.onExpand,
      rest = _objectWithoutProperties(_ref, ["ariaLabel", "className", "children", "isExpanded", "onExpand"]);

  var className = cx({
    'bx--parent-row-v2': true,
    'bx--expandable-row-v2': isExpanded
  }, rowClassName);
  var previousValue = isExpanded ? 'collapsed' : undefined;
  return React.createElement("tr", _extends({}, rest, {
    className: className,
    "data-parent-row": true
  }), React.createElement(TableCell, {
    className: "bx--table-expand-v2",
    "data-previous-value": previousValue
  }, React.createElement("button", {
    className: "bx--table-expand-v2__button",
    onClick: onExpand,
    "aria-label": ariaLabel
  }, React.createElement(Icon, {
    className: "bx--table-expand-v2__svg",
    name: "chevron--right"
  }))), children);
};

TableExpandRow.propTypes = {
  /**
   * Specify the string read by a voice reader when the expand trigger is
   * focused
   */
  ariaLabel: PropTypes.string.isRequired,
  className: PropTypes.string,
  children: PropTypes.node,

  /**
   * Specify whether this row is expanded or not. This helps coordinate data
   * attributes so that `TableExpandRow` and `TableExapndedRow` work together
   */
  isExpanded: PropTypes.bool.isRequired,

  /**
   * Hook for when a listener initiates a request to expand the given row
   */
  onExpand: PropTypes.func.isRequired
};
export default TableExpandRow;