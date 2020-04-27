'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.types = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _carbonComponentsReact = require('carbon-components-react');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var TYPES = {
  functional: 'Functional'
};

var Tag = function (_Component) {
  _inherits(Tag, _Component);

  function Tag() {
    var _ref;

    var _temp, _this, _ret;

    _classCallCheck(this, Tag);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = Tag.__proto__ || Object.getPrototypeOf(Tag)).call.apply(_ref, [this].concat(args))), _this), _this.state = {
      removed: false
    }, _this.handleRemove = function (event) {
      var _this$props = _this.props,
          onRemove = _this$props.onRemove,
          children = _this$props.children;

      event.stopPropagation();
      _this.setState({
        removed: true
      });

      if (onRemove) {
        onRemove(children);
      }
    }, _temp), _possibleConstructorReturn(_this, _ret);
  }

  _createClass(Tag, [{
    key: 'render',
    value: function render() {
      var _classNames,
          _this2 = this;

      var _props = this.props,
          children = _props.children,
          className = _props.className,
          type = _props.type,
          isRemovable = _props.isRemovable,
          maxCharacters = _props.maxCharacters,
          onRemove = _props.onRemove,
          other = _objectWithoutProperties(_props, ['children', 'className', 'type', 'isRemovable', 'maxCharacters', 'onRemove']);

      var shortenedName = children;
      if (typeof children === 'string' && maxCharacters && children.length > maxCharacters) {
        // if tag is key:value pair
        if (children.indexOf(':') !== -1) {
          // grab trimmed first and last half
          var beginning = children.substring(0, maxCharacters / 2).trim();
          var end = children.substring(children.length - maxCharacters / 2).trim();

          shortenedName = beginning + '...' + end;
        } else {
          // if not key:value pair
          var shorten = children.substring(0, maxCharacters).trim();
          shortenedName = shorten + '...';
        }
      }
      var tagClasses = (0, _classnames2.default)((_classNames = {
        'bx--tag': true
      }, _defineProperty(_classNames, 'bx--tag--' + type, true), _defineProperty(_classNames, 'bx--tag__removed', this.state.removed), _defineProperty(_classNames, className, className), _classNames));

      var tagProps = _extends({}, other, {
        className: tagClasses
      });

      var closeIcon = _react2.default.createElement(_carbonComponentsReact.Icon, {
        className: 'bx--tag-close',
        name: 'close',
        tabIndex: '0',
        role: 'button',
        description: 'detach the tag',
        onClick: this.handleRemove,
        onKeyDown: function onKeyDown(evt) {
          if (evt.which === 13 || evt.which === 32) _this2.handleRemove(evt);
        }
      });

      return _react2.default.createElement(
        'span',
        tagProps,
        shortenedName || TYPES[type],
        isRemovable && closeIcon
      );
    }
  }]);

  return Tag;
}(_react.Component);

Tag.propTypes = {
  children: _propTypes2.default.node,
  className: _propTypes2.default.string,
  type: _propTypes2.default.oneOf(Object.keys(TYPES)).isRequired,
  isRemovable: _propTypes2.default.bool,
  onRemove: _propTypes2.default.func,
  maxCharacters: _propTypes2.default.number
};
Tag.defaultProps = {
  onRemove: function onRemove() {},
  isRemovable: false
};
exports.default = Tag;
var types = exports.types = Object.keys(TYPES);