function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

import PropTypes from 'prop-types';
import React from 'react';
import classnames from 'classnames';

var FormGroup = function FormGroup(_ref) {
  var legendText = _ref.legendText,
      invalid = _ref.invalid,
      children = _ref.children,
      className = _ref.className,
      message = _ref.message,
      messageText = _ref.messageText,
      other = _objectWithoutProperties(_ref, ["legendText", "invalid", "children", "className", "message", "messageText"]);

  var classNamesLegend = classnames('bx--label', className);
  var classNamesFieldset = classnames('bx--fieldset', className);
  return React.createElement("fieldset", _extends({}, invalid && {
    'data-invalid': ''
  }, {
    className: classNamesFieldset
  }, other), React.createElement("legend", {
    className: classNamesLegend
  }, legendText), children, message ? React.createElement("div", {
    className: "bx--form__requirements"
  }, messageText) : null);
};

FormGroup.propTypes = {
  children: PropTypes.node,
  legendText: PropTypes.string.isRequired,
  className: PropTypes.string,
  invalid: PropTypes.bool,
  message: PropTypes.bool,
  messageText: PropTypes.string
};
FormGroup.defaultProps = {
  invalid: false,
  message: false,
  messageText: ''
};
export default FormGroup;