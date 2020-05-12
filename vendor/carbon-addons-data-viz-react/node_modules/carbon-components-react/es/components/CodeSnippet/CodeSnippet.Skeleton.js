import PropTypes from 'prop-types';
import React from 'react';
import classNames from 'classnames';

var CodeSnippetSkeleton = function CodeSnippetSkeleton(_ref) {
  var className = _ref.className,
      type = _ref.type;
  var snippetType = type === 'terminal' ? 'bx--snippet--terminal' : 'bx--snippet--code';
  var wrapperClasses = classNames('bx--snippet', 'bx--skeleton', className, snippetType);
  return React.createElement("div", {
    className: wrapperClasses
  }, React.createElement("div", {
    className: "bx--snippet-container"
  }, React.createElement("code", null, React.createElement("pre", null))));
};

CodeSnippetSkeleton.propTypes = {
  type: PropTypes.string,
  className: PropTypes.string
};
CodeSnippetSkeleton.defaultProps = {
  type: 'terminal'
};
export default CodeSnippetSkeleton;