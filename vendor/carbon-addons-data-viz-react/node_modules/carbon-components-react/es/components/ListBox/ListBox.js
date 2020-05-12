function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

import cx from 'classnames';
import React from 'react';
import PropTypes from 'prop-types';
import ListBoxField from './ListBoxField';
import ListBoxMenu from './ListBoxMenu';
import { ListBoxType } from './ListBoxPropTypes';
import childrenOf from '../../prop-types/childrenOf';

var handleOnKeyDown = function handleOnKeyDown(event) {
  if (event.keyCode === 27) {
    event.stopPropagation();
  }
};
/**
 * `ListBox` is a generic container component that handles creating the
 * container class name in response to certain props.
 */


var ListBox = function ListBox(_ref) {
  var _cx;

  var children = _ref.children,
      containerClassName = _ref.className,
      disabled = _ref.disabled,
      innerRef = _ref.innerRef,
      type = _ref.type,
      rest = _objectWithoutProperties(_ref, ["children", "className", "disabled", "innerRef", "type"]);

  var className = cx((_cx = {}, _defineProperty(_cx, containerClassName, !!containerClassName), _defineProperty(_cx, 'bx--list-box', true), _defineProperty(_cx, 'bx--list-box--inline', type === 'inline'), _defineProperty(_cx, 'bx--list-box--disabled', disabled), _cx));
  return React.createElement("div", _extends({}, rest, {
    className: className,
    ref: innerRef,
    onKeyDown: handleOnKeyDown
  }), children);
};

ListBox.propTypes = {
  children: childrenOf([ListBoxField, ListBoxMenu]),

  /**
   * Specify a class name to be applied on the containing list box node
   */
  className: PropTypes.string,

  /**
   * `innerRef` hook used for libraries like Downshift that require a reference
   * on a container node when it is not a native element
   */
  innerRef: PropTypes.func.isRequired,

  /**
   * Specify whether the ListBox is currently disabled
   */
  disabled: PropTypes.bool.isRequired,

  /**
   * Specify the "type" of the ListBox. Currently supports either `default` or
   * `inline` as an option.
   */
  type: ListBoxType.isRequired
};
ListBox.defaultProps = {
  innerRef: function innerRef() {},
  disabled: false,
  type: 'default'
};
export default ListBox;