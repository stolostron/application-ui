function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

import PropTypes from 'prop-types';
import React from 'react';
import classNames from 'classnames';
import Icon from '../Icon';

var TableHeader = function TableHeader(props) {
  var children = props.children,
      className = props.className,
      iconClassName = props.iconClassName,
      sortDir = props.sortDir,
      other = _objectWithoutProperties(props, ["children", "className", "iconClassName", "sortDir"]);

  var tableHeaderClasses = classNames(className, 'bx--table-header');
  var iconClasses = classNames(iconClassName, 'bx--table-sort__svg');
  var sortContent;

  if (sortDir) {
    sortContent = sortDir === 'DESC' ? React.createElement(Icon, {
      name: "caret--down",
      description: "descending sort",
      className: iconClasses
    }) : React.createElement(Icon, {
      name: "caret--up",
      description: "ascending sort",
      className: iconClasses
    });
  } else {
    sortContent = '';
  }

  return React.createElement("th", _extends({}, other, {
    className: tableHeaderClasses
  }), children, sortContent);
};

TableHeader.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  iconClassName: PropTypes.string,
  sortDir: PropTypes.string
};
export default TableHeader;