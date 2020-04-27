function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

import PropTypes from 'prop-types';
import React from 'react';
import classnames from 'classnames';

var FormLabel = function FormLabel(_ref) {
  var className = _ref.className,
      children = _ref.children,
      id = _ref.id,
      other = _objectWithoutProperties(_ref, ["className", "children", "id"]);

  var classNames = classnames('bx--label', className);
  return React.createElement("label", _extends({
    htmlFor: id,
    className: classNames
  }, other), children);
};

FormLabel.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  id: PropTypes.string
};
export default FormLabel;