function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

import PropTypes from 'prop-types';
import React from 'react';
import classnames from 'classnames';
import Link from '../Link';
import Button from '../Button';

var Footer = function Footer(_ref) {
  var className = _ref.className,
      children = _ref.children,
      labelOne = _ref.labelOne,
      linkTextOne = _ref.linkTextOne,
      linkHrefOne = _ref.linkHrefOne,
      labelTwo = _ref.labelTwo,
      linkTextTwo = _ref.linkTextTwo,
      linkHrefTwo = _ref.linkHrefTwo,
      buttonText = _ref.buttonText,
      other = _objectWithoutProperties(_ref, ["className", "children", "labelOne", "linkTextOne", "linkHrefOne", "labelTwo", "linkTextTwo", "linkHrefTwo", "buttonText"]);

  var classNames = classnames('bx--footer bx--footer--bottom-fixed', className);
  var footer = children ? React.createElement("footer", _extends({}, other, {
    className: classNames
  }), children) : React.createElement("footer", _extends({}, other, {
    className: classNames
  }), React.createElement("div", {
    className: "bx--footer-info"
  }, React.createElement("div", {
    className: "bx--footer-info__item"
  }, React.createElement("p", {
    className: "bx--footer-label"
  }, labelOne), React.createElement(Link, {
    href: linkHrefOne
  }, linkTextOne)), React.createElement("div", {
    className: "bx--footer-info__item"
  }, React.createElement("p", {
    className: "bx--footer-label"
  }, labelTwo), React.createElement(Link, {
    href: linkHrefTwo
  }, linkTextTwo))), React.createElement("div", {
    className: "bx--footer-cta"
  }, React.createElement(Button, {
    type: "submit"
  }, buttonText)));
  return footer;
};

Footer.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  labelOne: PropTypes.string,
  linkTextOne: PropTypes.string,
  linkHrefOne: PropTypes.string,
  labelTwo: PropTypes.string,
  linkTextTwo: PropTypes.string,
  linkHrefTwo: PropTypes.string,
  buttonText: PropTypes.string
};
Footer.defaultProps = {
  labelOne: 'Need Help?',
  linkTextOne: 'Contact Bluemix Sales',
  linkHrefOne: '#',
  labelTwo: 'Estimate Monthly Cost',
  linkTextTwo: 'Cost Calculator',
  linkHrefTwo: '#',
  buttonText: 'Create'
};
export default Footer;