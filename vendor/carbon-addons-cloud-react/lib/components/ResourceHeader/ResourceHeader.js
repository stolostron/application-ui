'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _carbonComponentsReact = require('carbon-components-react');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function renderActionButtons(type, onClick) {
  var reboot = _react2.default.createElement(
    'svg',
    {
      className: 'bx--resource-header__button--icon',
      width: '20',
      height: '24',
      viewBox: '0 0 20 24',
      fillRule: 'evenodd' },
    _react2.default.createElement('path', { d: 'M12.2 4.6L12 4V0H8v4l-.2.6C3.4 5.6.2 9.5.2 14.2.2 19.7 4.6 24 10 24s9.8-4.4 9.8-9.8c0-4.7-3.3-8.6-7.6-9.6zM10 21.8c-4.3 0-7.6-3.4-7.6-7.6 0-3.5 2.2-6.3 5.5-7.3L8 7v7h4V7l.2-.1c3.3 1 5.5 3.8 5.5 7.3-.1 4.2-3.4 7.6-7.7 7.6z' })
  );

  var maintenance = _react2.default.createElement(
    'svg',
    { className: 'bx--resource-header__button--icon', width: '16', height: '16' },
    _react2.default.createElement('path', { d: 'M0 0h16v2H0z' }),
    _react2.default.createElement('path', { d: 'M10.5 7.5c-.3.3-.7.3-1 0-.3-.3-.3-.7 0-1l1.3-1.3c-.4-.1-.7-.2-1.1-.2-1.2 0-2.2 1-2.2 2.3 0 .2 0 .4.1.6l-3.3 3.3c-.4.4-.4 1.1 0 1.5.4.4 1.1.4 1.5 0l3.3-3.3c.2.1.4.1.6.1 1.2 0 2.3-1 2.3-2.3 0-.4-.1-.7-.2-1l-1.3 1.3z' }),
    _react2.default.createElement('path', { d: 'M14 4v10H2V4h12m2-2H0v14h16V2z' })
  );

  var svg = void 0;
  if (type === 'Stop') {
    svg = stop;
    return _react2.default.createElement(
      _carbonComponentsReact.Button,
      {
        className: 'bx--resource-header__button',
        onClick: onClick,
        small: true,
        icon: 'stop--glyph',
        kind: 'ghost' },
      type
    );
  } else if (type === 'Reboot') {
    svg = reboot;
    return _react2.default.createElement(
      _carbonComponentsReact.Button,
      {
        className: 'bx--resource-header__button',
        onClick: onClick,
        icon: 'power--glyph',
        small: true,
        kind: 'ghost' },
      type
    );
  } else if (type === 'Maintenance') {
    svg = maintenance;
    return _react2.default.createElement(
      _carbonComponentsReact.Button,
      {
        className: 'bx--resource-header__button',
        onClick: onClick,
        small: true,
        kind: 'ghost' },
      type,
      svg
    );
  }
}

function renderTitleStatus() {
  return _react2.default.createElement(
    'div',
    { className: 'bx--resource-header__status-item bx--resource-header__status-item--active' },
    'Active'
  );
}

function renderStatus(status) {
  return status.map(function (item, i) {
    var statusClasses = (0, _classnames2.default)({
      'bx--resource-header__status-item--active': item.isTrue
    }, 'bx--resource-header__status-item');

    return _react2.default.createElement(
      'div',
      { key: i, className: statusClasses },
      item.text
    );
  });
}

var ResourceHeader = function ResourceHeader(_ref) {
  var className = _ref.className,
      icon = _ref.icon,
      isActive = _ref.isActive,
      renderActions = _ref.renderActions,
      renderBreadcrumbs = _ref.renderBreadcrumbs,
      renderMaintenance = _ref.renderMaintenance,
      renderReboot = _ref.renderReboot,
      renderStop = _ref.renderStop,
      status = _ref.status,
      subtitle = _ref.subtitle,
      title = _ref.title,
      other = _objectWithoutProperties(_ref, ['className', 'icon', 'isActive', 'renderActions', 'renderBreadcrumbs', 'renderMaintenance', 'renderReboot', 'renderStop', 'status', 'subtitle', 'title']);

  var resourceHeaderClasses = (0, _classnames2.default)('bx--resource-header', className);

  return _react2.default.createElement(
    'header',
    { className: resourceHeaderClasses },
    _react2.default.createElement(
      'section',
      { className: 'bx--resource-header__container' },
      _react2.default.createElement(
        'div',
        { className: 'bx--resource-header__container--left' },
        renderBreadcrumbs && renderBreadcrumbs(),
        _react2.default.createElement(
          'div',
          { className: 'bx--resource-header__content-container' },
          icon && _react2.default.createElement(
            'div',
            { className: 'bx--resource-header__icon' },
            icon
          ),
          _react2.default.createElement(
            'div',
            { className: 'bx--resource-header__content' },
            title && _react2.default.createElement(
              'div',
              { className: 'bx--resource-header__title' },
              _react2.default.createElement(
                'h3',
                null,
                title
              ),
              isActive && _react2.default.createElement(
                'div',
                { className: 'bx--resource-header__status-item bx--resource-header__status-item--active' },
                'Active'
              )
            ),
            _react2.default.createElement(
              'div',
              { className: 'bx--resource-header__subtitle' },
              subtitle && subtitle.map(function (item, key) {
                return _react2.default.createElement(
                  'span',
                  { key: key },
                  item,
                  ' \xA0'
                );
              })
            )
          )
        )
      ),
      _react2.default.createElement(
        'div',
        { className: 'bx--resource-header__container--right' },
        _react2.default.createElement(
          'div',
          { className: 'bx--resource-header__status' },
          status && renderStatus(status)
        ),
        _react2.default.createElement(
          'div',
          { className: 'bx--resource-header__actions' },
          renderStop && renderActionButtons('Stop', renderStop),
          renderReboot && renderActionButtons('Reboot', renderReboot),
          renderMaintenance && renderActionButtons('Maintenance', renderMaintenance),
          renderActions && renderActions()
        )
      )
    )
  );
};

ResourceHeader.propTypes = {
  /**
   * The CSS class names of the resource header
   */
  className: _propTypes2.default.string,
  /**
   * The icon to be rendered in the header.
   */
  icon: _propTypes2.default.node,
  /**
   * `true` to show the status text next to the resource header title.
   */
  isActive: _propTypes2.default.bool,
  /**
   * The function used to create and show an action dropdown.
   */
  renderActions: _propTypes2.default.func,
  /**
   * The function used to create and show breadcrumbs.
   */
  renderBreadcrumbs: _propTypes2.default.func,
  /**
   * The function used to show and attach actions to the maintenance icon
   */
  renderMaintenance: _propTypes2.default.func,
  /**
   * The function used to show and attach actions to the reboot icon
   */
  renderReboot: _propTypes2.default.func,
  /**
   * The function used to show and attach actions to the stop icon
   */
  renderStop: _propTypes2.default.func,
  /**
   * The array used to show status text above the action icons
   */
  status: _propTypes2.default.array,
  /**
   * The array used to show subtitle text below the resource header title
   */
  subtitle: _propTypes2.default.array,
  /**
   * The title of the resource header
   */
  title: _propTypes2.default.string
};

exports.default = ResourceHeader;