import PropTypes from 'prop-types';
import React from 'react';
import { settings } from 'carbon-components';
var prefix = settings.prefix;

var SelectSkeleton = function SelectSkeleton(_ref) {
  var hideLabel = _ref.hideLabel,
      id = _ref.id;
  var label = hideLabel ? null : // eslint-disable-next-line jsx-a11y/label-has-for,jsx-a11y/label-has-associated-control
  React.createElement("label", {
    className: "".concat(prefix, "--label ").concat(prefix, "--skeleton"),
    htmlFor: id
  });
  return React.createElement("div", {
    className: "".concat(prefix, "--form-item")
  }, label, React.createElement("div", {
    className: "".concat(prefix, "--select ").concat(prefix, "--skeleton")
  }, React.createElement("select", {
    className: "".concat(prefix, "--select-input")
  })));
};

SelectSkeleton.propTypes = {
  /**
   * Specify whether the label should be hidden, or not
   */
  hideLabel: PropTypes.bool
};
export default SelectSkeleton;