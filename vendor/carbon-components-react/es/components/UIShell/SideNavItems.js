import { settings } from 'carbon-components';
import cx from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
var prefix = settings.prefix;

var SideNavItems = function SideNavItems(_ref) {
  var customClassName = _ref.className,
      children = _ref.children;
  var className = cx(["".concat(prefix, "--side-nav__items")], customClassName);
  return React.createElement("ul", {
    className: className
  }, children);
};

SideNavItems.propTypes = {
  /**
   * Provide an optional class to be applied to the containing node
   */
  className: PropTypes.string,

  /**
   * Provide a single icon as the child to `SideNavIcon` to render in the
   * container
   */
  children: PropTypes.node.isRequired
};
export default SideNavItems;