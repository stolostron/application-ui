function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

import PropTypes from 'prop-types';
import React from 'react';
import classNames from 'classnames';
import warning from 'warning';
import { settings } from 'carbon-components';
var prefix = settings.prefix;
var didWarnAboutDeprecation = false;

var Table = function Table(props) {
  if (process.env.NODE_ENV !== "production") {
    process.env.NODE_ENV !== "production" ? warning(didWarnAboutDeprecation, 'The `Table` component is being updated in the next release of ' + '`carbon-components-react`. Please use `DataTable.Table` instead.') : void 0;
    didWarnAboutDeprecation = true;
  }

  var children = props.children,
      className = props.className,
      containerClassName = props.containerClassName,
      other = _objectWithoutProperties(props, ["children", "className", "containerClassName"]);

  var tableClasses = classNames(className, "".concat(prefix, "--responsive-table"));
  var tableContainerClasses = classNames(containerClassName, "".concat(prefix, "--responsive-table-container"));
  return React.createElement("div", {
    className: tableContainerClasses
  }, React.createElement("table", _extends({}, other, {
    className: tableClasses,
    style: {
      borderCollapse: 'collapse',
      borderSpacing: 0
    }
  }), children));
};

Table.propTypes = {
  /**
   * Provide the contents of your Table
   */
  children: PropTypes.node,

  /**
   * Specify an optional className to be applied to the <table> node
   */
  className: PropTypes.string,

  /**
   * Specify an optional className to be applied to the container node
   */
  containerClassName: PropTypes.string
};
export default Table;