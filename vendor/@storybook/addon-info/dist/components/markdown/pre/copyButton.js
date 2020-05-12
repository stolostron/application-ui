'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _objectWithoutProperties2 = require('babel-runtime/helpers/objectWithoutProperties');

var _objectWithoutProperties3 = _interopRequireDefault(_objectWithoutProperties2);

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _glamorous = require('glamorous');

var _glamorous2 = _interopRequireDefault(_glamorous);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Button = _glamorous2.default.button({
  overflow: 'hidden',
  border: '1px solid #eee',
  borderRadius: 3,
  backgroundColor: '#FFFFFF',
  cursor: 'pointer',
  fontSize: 13,
  padding: '3px 10px',
  alignSelf: 'flex-start',

  ':hover': {
    backgroundColor: '#f4f7fa',
    borderColor: '#ddd'
  },

  ':active': {
    backgroundColor: '#e9ecef',
    borderColor: '#ccc'
  }
}, function (props) {
  return props.styles;
});

var ContentWrapper = _glamorous2.default.div({
  transition: 'transform .2s ease',
  height: 16
}, function (props) {
  return (0, _extends3.default)({}, props.styles, {
    transform: props.toggled ? 'translateY(0px)' : 'translateY(-100%) translateY(-6px)'
  });
});

function CopyButton(props) {
  var _props$theme = props.theme,
      _props$theme$copyButt = _props$theme.copyButton,
      copyButton = _props$theme$copyButt === undefined ? {} : _props$theme$copyButt,
      copyButtonContent = _props$theme.copyButtonContent;
  var _copyButton$toggleTex = copyButton.toggleText,
      toggleText = _copyButton$toggleTex === undefined ? 'Copied!' : _copyButton$toggleTex,
      _copyButton$text = copyButton.text,
      text = _copyButton$text === undefined ? 'Copy' : _copyButton$text,
      copyButtonStyles = (0, _objectWithoutProperties3.default)(copyButton, ['toggleText', 'text']);


  return _react2.default.createElement(
    Button,
    { onClick: props.onClick, styles: copyButtonStyles },
    _react2.default.createElement(
      ContentWrapper,
      { styles: copyButtonContent, toggled: props.toggled },
      _react2.default.createElement(
        'div',
        { style: { marginBottom: 6 } },
        toggleText
      ),
      _react2.default.createElement(
        'div',
        null,
        text
      )
    )
  );
}

CopyButton.propTypes = {
  onClick: _propTypes2.default.func,
  toggled: _propTypes2.default.bool,
  theme: _propTypes2.default.shape({
    copyButton: _propTypes2.default.object
  })
};

CopyButton.defaultProps = {
  onClick: function onClick() {},
  toggled: false,
  theme: {}
};

exports.default = (0, _glamorous.withTheme)(CopyButton);