'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _global = require('global');

var _actions = require('./actions');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* eslint no-underscore-dangle: 0 */

var ConfigApi = function () {
  function ConfigApi(_ref) {
    var _this = this;

    var channel = _ref.channel,
        storyStore = _ref.storyStore,
        reduxStore = _ref.reduxStore,
        clearDecorators = _ref.clearDecorators;
    (0, _classCallCheck3.default)(this, ConfigApi);

    this.configure = function (loaders, module) {
      var render = function render() {
        try {
          _this._renderMain(loaders);
        } catch (error) {
          if (module.hot && module.hot.status() === 'apply') {
            // We got this issue, after webpack fixed it and applying it.
            // Therefore error message is displayed forever even it's being fixed.
            // So, we'll detect it reload the page.
            _global.location.reload();
          } else {
            // If we are accessing the site, but the error is not fixed yet.
            // There we can render the error.
            _this._renderError(error);
          }
        }
      };

      if (module.hot) {
        module.hot.accept(function () {
          setTimeout(render);
        });
        module.hot.dispose(function () {
          _this._clearDecorators();
        });
      }

      if (_this._channel) {
        render();
      } else {
        loaders();
      }
    };

    // channel can be null when running in node
    // always check whether channel is available
    this._channel = channel;
    this._storyStore = storyStore;
    this._reduxStore = reduxStore;
    this._clearDecorators = clearDecorators;
  }

  (0, _createClass3.default)(ConfigApi, [{
    key: '_renderMain',
    value: function _renderMain(loaders) {
      if (loaders) loaders();

      var stories = this._storyStore.dumpStoryBook();
      // send to the parent frame.
      this._channel.emit('setStories', { stories: stories });

      // clear the error if exists.
      this._reduxStore.dispatch((0, _actions.clearError)());
      this._reduxStore.dispatch((0, _actions.setInitialStory)(stories));
    }
  }, {
    key: '_renderError',
    value: function _renderError(e) {
      var stack = e.stack,
          message = e.message;

      var error = { stack: stack, message: message };
      this._reduxStore.dispatch((0, _actions.setError)(error));
    }
  }]);
  return ConfigApi;
}();

exports.default = ConfigApi;