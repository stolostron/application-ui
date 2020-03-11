'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _carbonComponentsReact = require('carbon-components-react');

var _Tag = require('../Tag');

var _Tag2 = _interopRequireDefault(_Tag);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var TagList = function (_Component) {
  _inherits(TagList, _Component);

  function TagList() {
    var _ref;

    var _temp, _this, _ret;

    _classCallCheck(this, TagList);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = TagList.__proto__ || Object.getPrototypeOf(TagList)).call.apply(_ref, [this].concat(args))), _this), _this.state = {
      showEditIcon: false
    }, _this.toggleEditIconShow = function () {
      _this.setState({
        showEditIcon: true
      });
    }, _this.toggleEditIconHide = function () {
      _this.setState({
        showEditIcon: false
      });
    }, _this.handleOnIconClick = function (evt) {
      evt.stopPropagation();
      if (_this.props.onIconClick) _this.props.onIconClick();
    }, _temp), _possibleConstructorReturn(_this, _ret);
  }

  _createClass(TagList, [{
    key: 'render',
    value: function render() {
      var _props = this.props,
          className = _props.className,
          numTagsDisplayed = _props.numTagsDisplayed,
          isEditable = _props.isEditable,
          onIconClick = _props.onIconClick,
          tags = _props.tags,
          counterTagClassName = _props.counterTagClassName,
          maxCharacters = _props.maxCharacters,
          rest = _objectWithoutProperties(_props, ['className', 'numTagsDisplayed', 'isEditable', 'onIconClick', 'tags', 'counterTagClassName', 'maxCharacters']);

      var limit = numTagsDisplayed > tags.length ? tags.length : numTagsDisplayed;

      var displayList = tags.slice(0, limit);

      var overflowCount = tags.length - numTagsDisplayed;

      var tagListClassNames = (0, _classnames2.default)('bx--tag-list', className);

      var counterTagClassNames = (0, _classnames2.default)('bx--tag-list--tag-counter', counterTagClassName);

      return _react2.default.createElement(
        'div',
        _extends({
          className: tagListClassNames
        }, rest, {
          onMouseEnter: isEditable === 'on-hover' ? this.toggleEditIconShow : undefined,
          onMouseLeave: isEditable === 'on-hover' ? this.toggleEditIconHide : undefined }),
        displayList.map(function (tag) {
          return _react2.default.createElement(
            _Tag2.default,
            _extends({
              key: tag.name,
              className: 'bx--tag-list--tag',
              type: tag.type,
              title: tag.name,
              maxCharacters: maxCharacters
            }, tag.otherProps),
            tag.name
          );
        }),
        numTagsDisplayed > 0 && numTagsDisplayed < tags.length && _react2.default.createElement(
          _Tag2.default,
          {
            type: 'functional',
            className: counterTagClassNames,
            description: 'overflow',
            title: 'overflow ' + overflowCount },
          _react2.default.createElement(_carbonComponentsReact.Icon, {
            name: 'add',
            className: 'bx--tag-list--tag-counter--icon',
            title: 'add icon',
            description: 'add icon used to indicate additional tags'
          }),
          overflowCount
        ),
        numTagsDisplayed === 0 && _react2.default.createElement(
          _Tag2.default,
          {
            type: 'functional',
            className: counterTagClassNames,
            title: 'overflow ' + overflowCount },
          tags.length
        ),
        isEditable === 'always' && _react2.default.createElement(
          'button',
          {
            className: 'bx--tag-list--edit--button',
            onClick: this.handleOnIconClick },
          _react2.default.createElement(_carbonComponentsReact.Icon, {
            name: 'edit--glyph',
            className: 'bx--tag-list--edit--icon',
            title: 'edit icon',
            description: 'edit icon that can trigger an editable state for the tags in list'
          })
        ),
        isEditable === 'on-hover' && this.state.showEditIcon && _react2.default.createElement(
          'button',
          {
            className: 'bx--tag-list--edit--button',
            onClick: this.handleOnIconClick },
          _react2.default.createElement(_carbonComponentsReact.Icon, {
            name: 'edit--glyph',
            className: 'bx--tag-list--edit--icon',
            title: 'edit icon',
            description: 'edit icon that can trigger an editable state for the tags in list'
          })
        )
      );
    }
  }]);

  return TagList;
}(_react.Component);

TagList.propTypes = {
  numTagsDisplayed: _propTypes2.default.number.isRequired,
  tags: _propTypes2.default.arrayOf(_propTypes2.default.shape({
    name: _propTypes2.default.string.isRequired,
    type: _propTypes2.default.oneOf(['functional', '...']).isRequired,
    otherProps: _propTypes2.default.objectOf(_propTypes2.default.oneOfType([_propTypes2.default.string, _propTypes2.default.number, _propTypes2.default.bool, _propTypes2.default.node, _propTypes2.default.func]).isRequired)
  })).isRequired,
  className: _propTypes2.default.string,
  isEditable: _propTypes2.default.oneOf(['always', 'never', 'on-hover']),
  onIconClick: _propTypes2.default.func,
  counterTagClassName: _propTypes2.default.string,
  maxCharacters: _propTypes2.default.number
};
TagList.defaultProps = {
  isEditable: 'never',
  numTagsDisplayed: 3
};
exports.default = TagList;