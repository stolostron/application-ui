(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "../../globals/js/settings", "../../globals/js/misc/mixin", "../../globals/js/mixins/create-component", "../../globals/js/mixins/init-component-by-search", "../../globals/js/mixins/evented-show-hide-state", "../../globals/js/mixins/handles", "../floating-menu/floating-menu", "../../globals/js/misc/get-launching-details", "../../globals/js/misc/on", "../../globals/js/feature-flags"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("../../globals/js/settings"), require("../../globals/js/misc/mixin"), require("../../globals/js/mixins/create-component"), require("../../globals/js/mixins/init-component-by-search"), require("../../globals/js/mixins/evented-show-hide-state"), require("../../globals/js/mixins/handles"), require("../floating-menu/floating-menu"), require("../../globals/js/misc/get-launching-details"), require("../../globals/js/misc/on"), require("../../globals/js/feature-flags"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.settings, global.mixin, global.createComponent, global.initComponentBySearch, global.eventedShowHideState, global.handles, global.floatingMenu, global.getLaunchingDetails, global.on, global.featureFlags);
    global.overflowMenu = mod.exports;
  }
})(this, function (_exports, _settings, _mixin2, _createComponent, _initComponentBySearch, _eventedShowHideState, _handles, _floatingMenu, _getLaunchingDetails, _on, _featureFlags) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = _exports.getMenuOffset = void 0;
  _settings = _interopRequireDefault(_settings);
  _mixin2 = _interopRequireDefault(_mixin2);
  _createComponent = _interopRequireDefault(_createComponent);
  _initComponentBySearch = _interopRequireDefault(_initComponentBySearch);
  _eventedShowHideState = _interopRequireDefault(_eventedShowHideState);
  _handles = _interopRequireDefault(_handles);
  _floatingMenu = _interopRequireWildcard(_floatingMenu);
  _getLaunchingDetails = _interopRequireDefault(_getLaunchingDetails);
  _on = _interopRequireDefault(_on);

  var _triggerButtonPositio, _triggerButtonPositio2;

  function _interopRequireWildcard(obj) {
    if (obj && obj.__esModule) {
      return obj;
    } else {
      var newObj = {};

      if (obj != null) {
        for (var key in obj) {
          if (Object.prototype.hasOwnProperty.call(obj, key)) {
            var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {};

            if (desc.get || desc.set) {
              Object.defineProperty(newObj, key, desc);
            } else {
              newObj[key] = obj[key];
            }
          }
        }
      }

      newObj.default = obj;
      return newObj;
    }
  }

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  function _typeof(obj) {
    if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
      _typeof = function _typeof(obj) {
        return typeof obj;
      };
    } else {
      _typeof = function _typeof(obj) {
        return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
      };
    }

    return _typeof(obj);
  }

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  function _defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    return Constructor;
  }

  function _possibleConstructorReturn(self, call) {
    if (call && (_typeof(call) === "object" || typeof call === "function")) {
      return call;
    }

    return _assertThisInitialized(self);
  }

  function _assertThisInitialized(self) {
    if (self === void 0) {
      throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }

    return self;
  }

  function _getPrototypeOf(o) {
    _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) {
      return o.__proto__ || Object.getPrototypeOf(o);
    };
    return _getPrototypeOf(o);
  }

  function _inherits(subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) {
      throw new TypeError("Super expression must either be null or a function");
    }

    subClass.prototype = Object.create(superClass && superClass.prototype, {
      constructor: {
        value: subClass,
        writable: true,
        configurable: true
      }
    });
    if (superClass) _setPrototypeOf(subClass, superClass);
  }

  function _setPrototypeOf(o, p) {
    _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
      o.__proto__ = p;
      return o;
    };

    return _setPrototypeOf(o, p);
  }

  function _objectSpread(target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i] != null ? arguments[i] : {};
      var ownKeys = Object.keys(source);

      if (typeof Object.getOwnPropertySymbols === 'function') {
        ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) {
          return Object.getOwnPropertyDescriptor(source, sym).enumerable;
        }));
      }

      ownKeys.forEach(function (key) {
        _defineProperty(target, key, source[key]);
      });
    }

    return target;
  }

  function _defineProperty(obj, key, value) {
    if (key in obj) {
      Object.defineProperty(obj, key, {
        value: value,
        enumerable: true,
        configurable: true,
        writable: true
      });
    } else {
      obj[key] = value;
    }

    return obj;
  }
  /**
   * The CSS property names of the arrow keyed by the floating menu direction.
   * @type {Object<string, string>}
   */


  var triggerButtonPositionProps = (_triggerButtonPositio = {}, _defineProperty(_triggerButtonPositio, _floatingMenu.DIRECTION_TOP, 'bottom'), _defineProperty(_triggerButtonPositio, _floatingMenu.DIRECTION_BOTTOM, 'top'), _defineProperty(_triggerButtonPositio, _floatingMenu.DIRECTION_LEFT, 'left'), _defineProperty(_triggerButtonPositio, _floatingMenu.DIRECTION_RIGHT, 'right'), _triggerButtonPositio);
  /**
   * Determines how the position of arrow should affect the floating menu position.
   * @type {Object<string, number>}
   */

  var triggerButtonPositionFactors = (_triggerButtonPositio2 = {}, _defineProperty(_triggerButtonPositio2, _floatingMenu.DIRECTION_TOP, -2), _defineProperty(_triggerButtonPositio2, _floatingMenu.DIRECTION_BOTTOM, -1), _defineProperty(_triggerButtonPositio2, _floatingMenu.DIRECTION_LEFT, -2), _defineProperty(_triggerButtonPositio2, _floatingMenu.DIRECTION_RIGHT, -1), _triggerButtonPositio2);
  /**
   * @param {Element} menuBody The menu body with the menu arrow.
   * @param {string} direction The floating menu direction.
   * @param {Element} trigger The trigger button.
   * @returns {FloatingMenu~offset} The adjustment of the floating menu position, upon the position of the menu arrow.
   * @private
   */

  var getMenuOffset = function getMenuOffset(menuBody, direction, trigger) {
    var triggerButtonPositionProp = triggerButtonPositionProps[direction];
    var triggerButtonPositionFactor = triggerButtonPositionFactors[direction];

    if (!triggerButtonPositionProp || !triggerButtonPositionFactor) {
      console.warn('Wrong floating menu direction:', direction); // eslint-disable-line no-console
    }

    var menuWidth = menuBody.offsetWidth;
    var menuHeight = menuBody.offsetHeight;
    var arrowStyle = menuBody.ownerDocument.defaultView.getComputedStyle(menuBody, ':before');
    var values = [triggerButtonPositionProp, 'left', 'width', 'height', 'border-top-width'].reduce(function (o, name) {
      return _objectSpread({}, o, _defineProperty({}, name, Number((/^([\d-.]+)px$/.exec(arrowStyle.getPropertyValue(name)) || [])[1])));
    }, {});

    if (Object.keys(values).every(function (name) {
      return !isNaN(values[name]);
    })) {
      var left = values.left,
          width = values.width,
          height = values.height,
          borderTopWidth = values['border-top-width'];
      return {
        left: menuWidth / 2 - (left + Math.sqrt(Math.pow(width, 2) + Math.pow(height, 2)) / 2),
        top: Math.sqrt(Math.pow(borderTopWidth, 2) * 2) + triggerButtonPositionFactor * values[triggerButtonPositionProp]
      };
    }

    if (_featureFlags.componentsX) {
      // eslint-disable-next-line no-use-before-define
      var menu = OverflowMenu.components.get(trigger);

      if (!menu) {
        throw new TypeError('Overflow menu instance cannot be found.');
      }

      var flip = menuBody.classList.contains(menu.options.classMenuFlip);

      if (triggerButtonPositionProp === 'top' || triggerButtonPositionProp === 'bottom') {
        var triggerWidth = trigger.offsetWidth;
        return {
          left: (!flip ? 1 : -1) * (menuWidth / 2 - triggerWidth / 2),
          top: 0
        };
      }

      if (triggerButtonPositionProp === 'left' || triggerButtonPositionProp === 'right') {
        var triggerHeight = trigger.offsetHeight;
        return {
          left: 0,
          top: (!flip ? 1 : -1) * (menuHeight / 2 - triggerHeight / 2)
        };
      }
    }

    return undefined;
  };

  _exports.getMenuOffset = getMenuOffset;

  var OverflowMenu =
  /*#__PURE__*/
  function (_mixin) {
    _inherits(OverflowMenu, _mixin);
    /**
     * Overflow menu.
     * @extends CreateComponent
     * @extends InitComponentBySearch
     * @extends Handles
     * @param {HTMLElement} element The element working as a modal dialog.
     * @param {Object} [options] The component options.
     * @param {string} [options.selectorOptionMenu] The CSS selector to find the menu.
     * @param {string} [options.classShown] The CSS class for the shown state, for the trigger UI.
     * @param {string} [options.classMenuShown] The CSS class for the shown state, for the menu.
     * @param {string} [options.classMenuFlip] The CSS class for the flipped state of the menu.
     * @param {Object} [options.objMenuOffset] The offset locating the menu for the non-flipped state.
     * @param {Object} [options.objMenuOffsetFlip] The offset locating the menu for the flipped state.
     */


    function OverflowMenu(element, options) {
      var _this;

      _classCallCheck(this, OverflowMenu);

      _this = _possibleConstructorReturn(this, _getPrototypeOf(OverflowMenu).call(this, element, options));

      _this.manage((0, _on.default)(_this.element.ownerDocument, 'click', function (event) {
        _this._handleDocumentClick(event);

        _this.wasOpenBeforeClick = undefined;
      }));

      _this.manage((0, _on.default)(_this.element.ownerDocument, 'keydown', function (event) {
        if (event.which === 27) {
          _this._handleKeyPress(event);
        }
      }));

      _this.manage((0, _on.default)(_this.element.ownerDocument, 'keypress', function (event) {
        if (event.which !== 27) {
          _this._handleKeyPress(event);
        }
      }));

      _this.manage((0, _on.default)(_this.element, 'mousedown', function () {
        _this.wasOpenBeforeClick = element.classList.contains(_this.options.classShown);
      }));

      return _this;
    }
    /**
     * Changes the shown/hidden state.
     * @param {string} state The new state.
     * @param {Object} detail The detail of the event trigging this action.
     * @param {Function} callback Callback called when change in state completes.
     */


    _createClass(OverflowMenu, [{
      key: "changeState",
      value: function changeState(state, detail, callback) {
        if (state === 'hidden') {
          this.element.setAttribute('aria-expanded', 'false');
        } else {
          this.element.setAttribute('aria-expanded', 'true');
        }

        if (!this.optionMenu) {
          var optionMenu = this.element.querySelector(this.options.selectorOptionMenu);

          if (!optionMenu) {
            throw new Error('Cannot find the target menu.');
          } // Lazily create a component instance for menu


          this.optionMenu = _floatingMenu.default.create(optionMenu, {
            refNode: this.element,
            classShown: this.options.classMenuShown,
            classRefShown: this.options.classShown,
            offset: this.options.objMenuOffset
          });
          this.children.push(this.optionMenu);
        }

        if (this.optionMenu.element.classList.contains(this.options.classMenuFlip)) {
          this.optionMenu.options.offset = this.options.objMenuOffsetFlip;
        } // Delegates the action of changing state to the menu.
        // (And thus the before/after shown/hidden events are fired from the menu)


        this.optionMenu.changeState(state, Object.assign(detail, {
          delegatorNode: this.element
        }), callback);
      }
      /**
       * Handles click on document.
       * @param {Event} event The triggering event.
       * @private
       */

    }, {
      key: "_handleDocumentClick",
      value: function _handleDocumentClick(event) {
        var element = this.element,
            optionMenu = this.optionMenu,
            wasOpenBeforeClick = this.wasOpenBeforeClick;
        var isOfSelf = element.contains(event.target);
        var isOfMenu = optionMenu && optionMenu.element.contains(event.target);
        var shouldBeOpen = isOfSelf && !wasOpenBeforeClick;
        var state = shouldBeOpen ? 'shown' : 'hidden';

        if (isOfSelf) {
          if (element.tagName === 'A') {
            event.preventDefault();
          }

          event.delegateTarget = element; // eslint-disable-line no-param-reassign
        }

        this.changeState(state, (0, _getLaunchingDetails.default)(event), function () {
          if (state === 'hidden' && isOfMenu) {
            element.focus();
          }
        });
      }
      /**
       * Handles key press on document.
       * @param {Event} event The triggering event.
       * @private
       */

    }, {
      key: "_handleKeyPress",
      value: function _handleKeyPress(event) {
        var key = event.which;
        var element = this.element,
            optionMenu = this.optionMenu,
            options = this.options;
        var isOfMenu = optionMenu && optionMenu.element.contains(event.target);

        if (key === 27) {
          this.changeState('hidden', (0, _getLaunchingDetails.default)(event), function () {
            if (isOfMenu) {
              element.focus();
            }
          });
        }

        if (key === 13 || key === 32) {
          var isOfSelf = element.contains(event.target);
          var shouldBeOpen = isOfSelf && !element.classList.contains(options.classShown);
          var state = shouldBeOpen ? 'shown' : 'hidden';

          if (isOfSelf) {
            // 32 is to prevent screen from jumping when menu is opened with spacebar
            if (element.tagName === 'A' || key === 32) {
              event.preventDefault();
            }

            event.delegateTarget = element; // eslint-disable-line no-param-reassign
          }

          this.changeState(state, (0, _getLaunchingDetails.default)(event), function () {
            if (state === 'hidden' && isOfMenu) {
              element.focus();
            }
          });
        }
      }
    }], [{
      key: "options",
      get: function get() {
        var prefix = _settings.default.prefix;
        return {
          selectorInit: '[data-overflow-menu]',
          selectorOptionMenu: ".".concat(prefix, "--overflow-menu-options"),
          classShown: "".concat(prefix, "--overflow-menu--open"),
          classMenuShown: "".concat(prefix, "--overflow-menu-options--open"),
          classMenuFlip: "".concat(prefix, "--overflow-menu--flip"),
          objMenuOffset: getMenuOffset,
          objMenuOffsetFlip: getMenuOffset
        };
      }
    }]);

    OverflowMenu.components = new WeakMap();
    return OverflowMenu;
  }((0, _mixin2.default)(_createComponent.default, _initComponentBySearch.default, _eventedShowHideState.default, _handles.default));

  var _default = OverflowMenu;
  _exports.default = _default;
});