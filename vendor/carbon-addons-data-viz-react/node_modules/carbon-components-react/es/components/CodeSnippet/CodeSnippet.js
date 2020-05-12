function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

import PropTypes from 'prop-types';
import React from 'react';
import classNames from 'classnames';
import CopyButton from '../CopyButton';

var CodeSnippet = function CodeSnippet(_ref) {
  var className = _ref.className,
      type = _ref.type,
      children = _ref.children,
      feedback = _ref.feedback,
      onClick = _ref.onClick,
      wrappedContentRef = _ref.wrappedContentRef,
      other = _objectWithoutProperties(_ref, ["className", "type", "children", "feedback", "onClick", "wrappedContentRef"]);

  var snippetType = type === 'terminal' ? 'bx--snippet--terminal' : 'bx--snippet--code';
  var wrapperClasses = classNames('bx--snippet', className, snippetType);
  return React.createElement("div", _extends({
    className: wrapperClasses
  }, other), React.createElement("div", {
    role: "textbox",
    tabIndex: 0,
    className: "bx--snippet-container"
  }, React.createElement("code", null, React.createElement("pre", {
    ref: wrappedContentRef
  }, children))), React.createElement(CopyButton, {
    onClick: onClick,
    feedback: feedback
  }));
};

CodeSnippet.propTypes = {
  type: PropTypes.string,
  className: PropTypes.string,
  children: PropTypes.string,
  feedback: PropTypes.string,
  onClick: PropTypes.func,
  wrappedContentRef: PropTypes.func
};
CodeSnippet.defaultProps = {
  type: 'terminal'
};
export default CodeSnippet;