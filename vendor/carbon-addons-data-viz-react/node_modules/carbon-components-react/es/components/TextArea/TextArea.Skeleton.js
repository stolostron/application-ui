import PropTypes from 'prop-types';
import React from 'react';

var TextAreaSkeleton = function TextAreaSkeleton(_ref) {
  var hideLabel = _ref.hideLabel,
      id = _ref.id;
  var label = hideLabel ? null : React.createElement("label", {
    className: "bx--label bx--skeleton",
    htmlFor: id
  });
  return React.createElement("div", {
    className: "bx--form-item"
  }, label, React.createElement("div", {
    className: "bx--skeleton bx--text-area"
  }));
};

TextAreaSkeleton.propTypes = {
  hideLabel: PropTypes.bool
};
export default TextAreaSkeleton;