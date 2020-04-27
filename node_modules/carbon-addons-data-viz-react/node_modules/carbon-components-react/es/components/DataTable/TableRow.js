import React from 'react';
import omit from 'lodash.omit';

var TableRow = function TableRow(props) {
  // Remove unnecessary props if provided to this component, these are
  // only useful in `TableExpandRow`
  var cleanProps = omit(props, ['ariaLabel', 'onExpand', 'isExpanded']);
  return React.createElement("tr", cleanProps);
};

export default TableRow;