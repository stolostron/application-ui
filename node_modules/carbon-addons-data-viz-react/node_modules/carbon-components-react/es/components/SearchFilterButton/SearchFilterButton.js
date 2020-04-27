function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

import React from 'react';
import PropTypes from 'prop-types';
import Icon from '../Icon';
/**
 * The filter button for `<Search>`.
 */

var SearchFilterButton = function SearchFilterButton(_ref) {
  var labelText = _ref.labelText,
      other = _objectWithoutProperties(_ref, ["labelText"]);

  return React.createElement("button", _extends({
    className: "bx--search-button",
    type: "button",
    "aria-label": labelText
  }, other), React.createElement(Icon, {
    name: "filter--glyph",
    description: "filter",
    className: "bx--search-filter"
  }));
};

SearchFilterButton.propTypes = {
  /**
   * The a11y label text.
   */
  labelText: PropTypes.string
};
SearchFilterButton.defaultProps = {
  labelText: 'Search'
};
export default SearchFilterButton;