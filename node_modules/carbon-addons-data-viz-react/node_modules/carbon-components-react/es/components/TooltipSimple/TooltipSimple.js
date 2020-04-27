function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

import React from 'react';
import PropTypes from 'prop-types';
import Icon from '../Icon';
import classNames from 'classnames';

var TooltipSimple = function TooltipSimple(_ref) {
  var children = _ref.children,
      className = _ref.className,
      position = _ref.position,
      text = _ref.text,
      showIcon = _ref.showIcon,
      iconName = _ref.iconName,
      iconDescription = _ref.iconDescription,
      other = _objectWithoutProperties(_ref, ["children", "className", "position", "text", "showIcon", "iconName", "iconDescription"]);

  var tooltipClasses = classNames("bx--tooltip--simple__".concat(position));
  var tooltipWrapperClasses = classNames("bx--tooltip--simple", className);
  return React.createElement("div", null, showIcon ? React.createElement("div", {
    className: tooltipWrapperClasses
  }, children, React.createElement("div", _extends({
    className: tooltipClasses,
    "data-tooltip-text": text,
    tabIndex: "0",
    role: "button"
  }, other), React.createElement(Icon, {
    role: "img",
    name: iconName,
    description: iconDescription
  }))) : React.createElement("div", {
    className: tooltipWrapperClasses
  }, React.createElement("div", _extends({
    className: tooltipClasses,
    "data-tooltip-text": text,
    tabIndex: "0",
    role: "button"
  }, other), children)));
};

TooltipSimple.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  position: PropTypes.oneOf(['bottom', 'top']),
  text: PropTypes.string.isRequired,
  showIcon: PropTypes.bool,
  iconName: PropTypes.string,
  iconDescription: PropTypes.string
};
TooltipSimple.defaultProps = {
  position: 'top',
  showIcon: true,
  iconName: 'info--glyph',
  iconDescription: 'tooltip',
  text: 'Provide text'
};
export default TooltipSimple;