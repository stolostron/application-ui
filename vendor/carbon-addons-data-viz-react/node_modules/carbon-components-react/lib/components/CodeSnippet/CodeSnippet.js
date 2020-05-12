"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _propTypes = _interopRequireDefault(require("prop-types"));

var _react = _interopRequireDefault(require("react"));

var _classnames = _interopRequireDefault(require("classnames"));

var _CopyButton = _interopRequireDefault(require("../CopyButton"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

var CodeSnippet = function CodeSnippet(_ref) {
  var className = _ref.className,
      type = _ref.type,
      children = _ref.children,
      feedback = _ref.feedback,
      onClick = _ref.onClick,
      wrappedContentRef = _ref.wrappedContentRef,
      other = _objectWithoutProperties(_ref, ["className", "type", "children", "feedback", "onClick", "wrappedContentRef"]);

  var snippetType = type === 'terminal' ? 'bx--snippet--terminal' : 'bx--snippet--code';
  var wrapperClasses = (0, _classnames.default)('bx--snippet', className, snippetType);
  return _react.default.createElement("div", _extends({
    className: wrapperClasses
  }, other), _react.default.createElement("div", {
    role: "textbox",
    tabIndex: 0,
    className: "bx--snippet-container"
  }, _react.default.createElement("code", null, _react.default.createElement("pre", {
    ref: wrappedContentRef
  }, children))), _react.default.createElement(_CopyButton.default, {
    onClick: onClick,
    feedback: feedback
  }));
};

CodeSnippet.propTypes = {
  type: _propTypes.default.string,
  className: _propTypes.default.string,
  children: _propTypes.default.string,
  feedback: _propTypes.default.string,
  onClick: _propTypes.default.func,
  wrappedContentRef: _propTypes.default.func
};
CodeSnippet.defaultProps = {
  type: 'terminal'
};
var _default = CodeSnippet;
exports.default = _default;