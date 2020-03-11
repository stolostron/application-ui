"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _propTypes = _interopRequireDefault(require("prop-types"));

var _react = _interopRequireDefault(require("react"));

var _classnames = _interopRequireDefault(require("classnames"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var CodeSnippetSkeleton = function CodeSnippetSkeleton(_ref) {
  var className = _ref.className,
      type = _ref.type;
  var snippetType = type === 'terminal' ? 'bx--snippet--terminal' : 'bx--snippet--code';
  var wrapperClasses = (0, _classnames.default)('bx--snippet', 'bx--skeleton', className, snippetType);
  return _react.default.createElement("div", {
    className: wrapperClasses
  }, _react.default.createElement("div", {
    className: "bx--snippet-container"
  }, _react.default.createElement("code", null, _react.default.createElement("pre", null))));
};

CodeSnippetSkeleton.propTypes = {
  type: _propTypes.default.string,
  className: _propTypes.default.string
};
CodeSnippetSkeleton.defaultProps = {
  type: 'terminal'
};
var _default = CodeSnippetSkeleton;
exports.default = _default;