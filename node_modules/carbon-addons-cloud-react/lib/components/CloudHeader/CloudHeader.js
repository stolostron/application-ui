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

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _CloudHeaderWrapper = require('./CloudHeaderWrapper');

var _CloudHeaderWrapper2 = _interopRequireDefault(_CloudHeaderWrapper);

var _CloudHeaderMenu = require('./CloudHeaderMenu');

var _CloudHeaderMenu2 = _interopRequireDefault(_CloudHeaderMenu);

var _CloudHeaderLogo = require('./CloudHeaderLogo');

var _CloudHeaderLogo2 = _interopRequireDefault(_CloudHeaderLogo);

var _CloudHeaderList = require('./CloudHeaderList');

var _CloudHeaderList2 = _interopRequireDefault(_CloudHeaderList);

var _CloudHeaderListItem = require('./CloudHeaderListItem');

var _CloudHeaderListItem2 = _interopRequireDefault(_CloudHeaderListItem);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var searchIcon = _react2.default.createElement(
  'svg',
  { width: '20', height: '20' },
  _react2.default.createElement(
    'title',
    null,
    'search'
  ),
  _react2.default.createElement('path', { d: 'M8.5 14a5.5 5.5 0 1 0 0-11 5.5 5.5 0 0 0 0 11zm4.936-1.27l4.418 4.416-.708.708-4.417-4.418a6.5 6.5 0 1 1 .707-.707z' })
);

var notificationIcon = _react2.default.createElement(
  'svg',
  { width: '20', height: '20' },
  _react2.default.createElement(
    'title',
    null,
    'notification'
  ),
  _react2.default.createElement('path', { d: 'M7.17 17H2.5a.5.5 0 0 1-.5-.5v-2a.5.5 0 0 1 .146-.354L4 12.293V9a6 6 0 0 1 5.5-5.98V1h1v2.02A6 6 0 0 1 16 9v3.293l1.854 1.853A.5.5 0 0 1 18 14.5v2a.5.5 0 0 1-.5.5h-4.67a3.001 3.001 0 0 1-5.66 0zm1.098 0a2 2 0 0 0 3.464 0H8.268zM13 16h4v-1.293l-1.854-1.853A.5.5 0 0 1 15 12.5V9A5 5 0 0 0 5 9v3.5a.5.5 0 0 1-.146.354L3 14.707V16h10z' })
);

var helpIcon = _react2.default.createElement(
  'svg',
  { width: '20', height: '20' },
  _react2.default.createElement(
    'title',
    null,
    'help'
  ),
  _react2.default.createElement('path', {
    d: 'M10 17a7 7 0 1 0 0-14 7 7 0 0 0 0 14zm0 1a8 8 0 1 1 0-16 8 8 0 0 1 0 16z',
    fillRule: 'nonzero'
  }),
  _react2.default.createElement('circle', { cx: '10', cy: '14', r: '1' }),
  _react2.default.createElement('path', { d: 'M10.5 10.5V12h-1V9.5h1a1.5 1.5 0 0 0 0-3h-1A1.5 1.5 0 0 0 8 8H7a2.5 2.5 0 0 1 2.5-2.5h1a2.5 2.5 0 1 1 0 5z' })
);

var applicationIcon = _react2.default.createElement(
  'svg',
  { viewBox: '0 0 16 16' },
  _react2.default.createElement(
    'title',
    null,
    'applications'
  ),
  _react2.default.createElement('circle', { cx: '2', cy: '2', r: '2' }),
  _react2.default.createElement('circle', { cx: '8', cy: '2', r: '2' }),
  _react2.default.createElement('circle', { cx: '14', cy: '2', r: '2' }),
  _react2.default.createElement('circle', { cx: '2', cy: '8', r: '2' }),
  _react2.default.createElement('circle', { cx: '8', cy: '8', r: '2' }),
  _react2.default.createElement('circle', { cx: '14', cy: '8', r: '2' }),
  _react2.default.createElement('circle', { cx: '2', cy: '14', r: '2' }),
  _react2.default.createElement('circle', { cx: '8', cy: '14', r: '2' }),
  _react2.default.createElement('circle', { cx: '14', cy: '14', r: '2' })
);

var userIcon = _react2.default.createElement(
  'svg',
  { width: '20', height: '20' },
  _react2.default.createElement(
    'title',
    null,
    'user'
  ),
  _react2.default.createElement('path', { d: 'M6 15.745A6.968 6.968 0 0 0 10 17a6.968 6.968 0 0 0 4-1.255V15.5a2.5 2.5 0 0 0-2.5-2.5h-3A2.5 2.5 0 0 0 6 15.5v.245zm-.956-.802A3.5 3.5 0 0 1 8.5 12h3a3.5 3.5 0 0 1 3.456 2.943 7 7 0 1 0-9.912 0zM10 18a8 8 0 1 1 0-16 8 8 0 0 1 0 16z' }),
  _react2.default.createElement('path', { d: 'M10 9.841a2 2 0 1 0 0-4 2 2 0 0 0 0 4zm0 1a3 3 0 1 1 0-6 3 3 0 0 1 0 6z' })
);

var CloudHeader = function (_React$Component) {
  _inherits(CloudHeader, _React$Component);

  function CloudHeader() {
    var _ref;

    var _temp, _this, _ret;

    _classCallCheck(this, CloudHeader);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = CloudHeader.__proto__ || Object.getPrototypeOf(CloudHeader)).call.apply(_ref, [this].concat(args))), _this), _this.state = {
      isMenuActive: false,
      isSearchActive: false,
      isNotificationActive: false,
      isHelpActive: false,
      isApplicationActive: false,
      isUserActive: false
    }, _this.handleIconKeypress = function (type) {
      return function (evt) {
        if (evt.which === 13 || evt.which === 32) {
          if (evt.target.classList.contains('bx--cloud-header-list__btn')) {
            _this.handleIconClick(type, evt)();
          }
        }
      };
    }, _this.handleIconClick = function (type) {
      return function (evt) {
        Object.keys(_this.state).forEach(function (key) {
          var clickType = 'is' + type + 'Active';
          if (key === clickType) {
            _this.setState(_defineProperty({}, clickType, !_this.state[clickType]));

            var propFunc = 'render' + type;
            _this.props[propFunc]();
          } else {
            _this.setState(_defineProperty({}, key, false));
          }
        });
      };
    }, _temp), _possibleConstructorReturn(_this, _ret);
  }

  _createClass(CloudHeader, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      this.portalNode = document.createElement('div');
      document.body.appendChild(this.portalNode);
    }
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      this.portalNode.parentNode.removeChild(this.portalNode);
    }
  }, {
    key: 'render',
    value: function render() {
      var _props = this.props,
          className = _props.className,
          companyName = _props.companyName,
          productName = _props.productName,
          logoHref = _props.logoHref,
          renderMenu = _props.renderMenu,
          renderLogo = _props.renderLogo,
          renderSearch = _props.renderSearch,
          renderNotification = _props.renderNotification,
          renderHelp = _props.renderHelp,
          renderApplication = _props.renderApplication,
          renderUser = _props.renderUser,
          links = _props.links,
          other = _objectWithoutProperties(_props, ['className', 'companyName', 'productName', 'logoHref', 'renderMenu', 'renderLogo', 'renderSearch', 'renderNotification', 'renderHelp', 'renderApplication', 'renderUser', 'links']);

      var _state = this.state,
          isMenuActive = _state.isMenuActive,
          isSearchActive = _state.isSearchActive,
          isNotificationActive = _state.isNotificationActive,
          isHelpActive = _state.isHelpActive,
          isApplicationActive = _state.isApplicationActive,
          isUserActive = _state.isUserActive;


      var cloudHeaderClasses = (0, _classnames2.default)('bx--cloud-header', className);

      return _react2.default.createElement(
        'nav',
        _extends({ key: 'nav', className: cloudHeaderClasses }, other),
        _react2.default.createElement(
          _CloudHeaderWrapper2.default,
          null,
          _react2.default.createElement(
            'div',
            { className: 'bx--cloud-header-brand-container' },
            renderMenu && _react2.default.createElement(_CloudHeaderMenu2.default, { onClick: this.handleIconClick('Menu') }),
            _react2.default.createElement(
              _CloudHeaderLogo2.default,
              {
                className: !renderMenu ? 'bx--cloud-header-brand--no-menu' : null,
                companyName: companyName,
                productName: productName,
                href: logoHref },
              renderLogo && renderLogo()
            )
          ),
          _react2.default.createElement(
            _CloudHeaderList2.default,
            { className: 'bx--cloud-header-list--link' },
            links && links.map(function (link, i) {
              return _react2.default.createElement(
                _CloudHeaderListItem2.default,
                { key: i, href: link.href },
                link.linkText
              );
            })
          )
        ),
        _react2.default.createElement(
          _CloudHeaderWrapper2.default,
          null,
          isSearchActive && renderSearch && renderSearch(),
          _react2.default.createElement(
            _CloudHeaderList2.default,
            { className: 'bx--cloud-header-list--icon' },
            renderSearch && _react2.default.createElement(
              _CloudHeaderListItem2.default,
              {
                onClick: this.handleIconClick('Search'),
                onKeyDown: this.handleIconKeypress('Search'),
                ariaExpanded: this.state.isSearchActive,
                isIcon: true },
              searchIcon
            ),
            renderNotification && _react2.default.createElement(
              _CloudHeaderListItem2.default,
              {
                onClick: this.handleIconClick('Notification'),
                onKeyDown: this.handleIconKeypress('Notification'),
                ariaExpanded: this.state.isNotificationActive,
                isIcon: true },
              notificationIcon,
              isNotificationActive && renderNotification()
            ),
            renderHelp && _react2.default.createElement(
              _CloudHeaderListItem2.default,
              {
                onClick: this.handleIconClick('Help'),
                onKeyDown: this.handleIconKeypress('Help'),
                ariaExpanded: this.state.isHelpActive,
                isIcon: true },
              helpIcon,
              isHelpActive && renderHelp()
            ),
            renderApplication && _react2.default.createElement(
              _CloudHeaderListItem2.default,
              {
                onClick: this.handleIconClick('Application'),
                onKeyDown: this.handleIconKeypress('Application'),
                ariaExpanded: this.state.isApplicationActive,
                isIcon: true },
              applicationIcon,
              isApplicationActive && renderApplication()
            ),
            renderUser && _react2.default.createElement(
              _CloudHeaderListItem2.default,
              {
                className: 'bx--cloud-header-list__item--icon',
                onClick: this.handleIconClick('User'),
                onKeyDown: this.handleIconKeypress('User'),
                ariaExpanded: this.state.isUserActive,
                isIcon: true },
              userIcon,
              isUserActive && renderUser()
            )
          )
        ),
        isMenuActive && _reactDom2.default.createPortal(renderMenu(), this.portalNode)
      );
    }
  }]);

  return CloudHeader;
}(_react2.default.Component);

exports.default = CloudHeader;