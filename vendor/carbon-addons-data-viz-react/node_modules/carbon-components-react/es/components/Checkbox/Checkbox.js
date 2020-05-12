function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

import PropTypes from 'prop-types';
import React from 'react';
import classNames from 'classnames';

var Checkbox = function Checkbox(_ref) {
  var className = _ref.className,
      id = _ref.id,
      labelText = _ref.labelText,
      _onChange = _ref.onChange,
      indeterminate = _ref.indeterminate,
      hideLabel = _ref.hideLabel,
      wrapperClassName = _ref.wrapperClassName,
      other = _objectWithoutProperties(_ref, ["className", "id", "labelText", "onChange", "indeterminate", "hideLabel", "wrapperClassName"]);

  var input;
  var labelClasses = classNames('bx--checkbox-label', className);
  var innerLabelClasses = classNames({
    'bx--visually-hidden': hideLabel
  });
  var wrapperClasses = classNames('bx--form-item', 'bx--checkbox-wrapper', wrapperClassName);
  return React.createElement("div", {
    className: wrapperClasses
  }, React.createElement("input", _extends({}, other, {
    type: "checkbox",
    onChange: function onChange(evt) {
      _onChange(input.checked, id, evt);
    },
    className: "bx--checkbox",
    id: id,
    ref: function ref(el) {
      input = el;

      if (input) {
        input.indeterminate = indeterminate;
      }
    }
  })), React.createElement("label", {
    htmlFor: id,
    className: labelClasses
  }, React.createElement("span", {
    className: innerLabelClasses
  }, labelText)));
};

Checkbox.propTypes = {
  checked: PropTypes.bool,
  defaultChecked: PropTypes.bool,
  indeterminate: PropTypes.bool,

  /**
   * The CSS class name to be placed on inner label element.
   */
  className: PropTypes.string,
  disabled: PropTypes.bool,
  id: PropTypes.string.isRequired,
  labelText: PropTypes.node.isRequired,
  hideLabel: PropTypes.bool,
  onChange: PropTypes.func,

  /**
   * The CSS class name to be placed on the wrapping element
   */
  wrapperClassName: PropTypes.string
};
Checkbox.defaultProps = {
  onChange: function onChange() {},
  indeterminate: false
};
export default Checkbox;