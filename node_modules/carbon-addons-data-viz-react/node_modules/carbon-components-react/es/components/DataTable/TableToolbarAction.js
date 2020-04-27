function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

import cx from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import Icon from '../Icon';

var TableToolbarAction = function TableToolbarAction(_ref) {
  var className = _ref.className,
      iconName = _ref.iconName,
      iconDescription = _ref.iconDescription,
      rest = _objectWithoutProperties(_ref, ["className", "iconName", "iconDescription"]);

  var toolbarActionClasses = cx(className, 'bx--toolbar-action');
  return React.createElement("button", _extends({
    className: toolbarActionClasses
  }, rest), React.createElement(Icon, {
    className: "bx--toolbar-action__icon",
    name: iconName,
    description: iconDescription
  }));
};

TableToolbarAction.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,

  /**
   * Specify the name of the icon for the toolbar action
   */
  iconName: PropTypes.string.isRequired,

  /**
   * Specify the description of the icon for the toolbar action
   */
  iconDescription: PropTypes.string.isRequired
};
export default TableToolbarAction;