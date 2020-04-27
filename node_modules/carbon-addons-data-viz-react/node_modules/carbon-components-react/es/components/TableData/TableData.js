function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

import PropTypes from 'prop-types';
import React from 'react';
import classNames from 'classnames';
import Icon from '../Icon';

var TableData = function TableData(props) {
  var children = props.children,
      className = props.className,
      iconClassName = props.iconClassName,
      expanded = props.expanded,
      other = _objectWithoutProperties(props, ["children", "className", "iconClassName", "expanded"]);

  var tableDataClasses = classNames(className);
  var iconClasses = classNames(iconClassName, 'bx--table-expand__svg');
  var style = expanded ? {
    transform: 'rotate(90deg)'
  } : {};
  return React.createElement("td", _extends({}, other, {
    className: tableDataClasses
  }), expanded === undefined ? children : React.createElement(Icon, {
    className: iconClasses,
    name: "chevron--right",
    description: "expand row",
    style: style,
    tabIndex: 0,
    onKeyPress: function onKeyPress(evt) {
      if (props.onClick && (evt.which === 13 || evt.which === 32)) {
        props.onClick(evt);
      }
    }
  }));
};

TableData.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  iconClassName: PropTypes.string,
  expanded: PropTypes.bool
};
export default TableData;