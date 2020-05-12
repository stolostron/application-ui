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

import mixin from '../../globals/js/misc/mixin';
import createComponent from '../../globals/js/mixins/create-component';
import initComponentBySearch from '../../globals/js/mixins/init-component-by-search';
import handles from '../../globals/js/mixins/handles';
import on from '../../globals/js/misc/on';
import settings from '../../globals/js/settings';

var toArray = function toArray(arrayLike) {
  return Array.prototype.slice.call(arrayLike);
};

var HeaderNav =
/*#__PURE__*/
function (_mixin) {
  _inherits(HeaderNav, _mixin);

  function HeaderNav(element, options) {
    var _this;

    _classCallCheck(this, HeaderNav);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(HeaderNav).call(this, element, options));

    _this.getCurrentNavigation = function () {
      var focused = _this.element.ownerDocument.activeElement.closest(_this.options.selectorSubmenu);

      return focused && focused.nodeType === Node.ELEMENT_NODE ? focused.querySelector(_this.options.selectorSubmenuLink) : null;
    };

    _this.navigate = function (direction) {
      var items = toArray(_this.element.querySelectorAll(_this.options.selectorSubmenuLink));

      var start = _this.getCurrentNavigation();

      var getNextItem = function getNextItem(old) {
        var handleUnderflow = function handleUnderflow(index, length) {
          return index + (index >= 0 ? 0 : length);
        };

        var handleOverflow = function handleOverflow(index, length) {
          return index - (index < length ? 0 : length);
        }; // `items.indexOf(old)` may be -1 (Scenario of no previous focus)


        var index = Math.max(items.indexOf(old) + direction, -1);
        return items[handleUnderflow(handleOverflow(index, items.length), items.length)];
      };

      getNextItem(start).focus();
    };

    _this._handleKeyDown = function (event) {
      var keyCodes = {
        37: _this.constructor.NAVIGATE.BACKWARD,
        // left arrow
        39: _this.constructor.NAVIGATE.FORWARD // right arrow

      };
      var keyCodeMatches = keyCodes[event.which];

      if (keyCodeMatches) {
        _this.navigate(keyCodeMatches);
      }
    };

    _this.manage(on(_this.element, 'keydown', _this._handleKeyDown));

    return _this;
  }
  /**
   * The map associating DOM element and Header instance.
   * @member HeaderNav.components
   * @type {WeakMap}
   */


  _createClass(HeaderNav, null, [{
    key: "options",

    /**
     * The component options.
     * If `options` is specified in the constructor,
     * {@linkcode HeaderNav.create .create()}, or
     * {@linkcode HeaderNav.init .init()},
     * properties in this object are overriden for the instance being create and
     * how {@linkcode HeaderNav.init .init()} works.
     * @member HeaderNav.options
     * @type {Object}
     * @property {string} selectorInit The data attribute to find side navs.
     */
    get: function get() {
      var prefix = settings.prefix;
      return {
        selectorInit: '[data-header-nav]',
        selectorNavKind: '[data-header-nav-kind]',
        selectorSubmenu: ".".concat(prefix, "--header__submenu"),
        selectorSubmenuLink: ".".concat(prefix, "--header__menu-title"),
        selectorSubmenuItem: ".".concat(prefix, "--header__menu-title > .").concat(prefix, "--header__menu-item")
      };
    }
    /**
     * Enum for navigating backward/forward.
     * @readonly
     * @member Header.NAVIGATE
     * @type {Object}
     * @property {number} BACKWARD Navigating backward.
     * @property {number} FORWARD Navigating forward.
     */

  }]);

  HeaderNav.components = new WeakMap();
  HeaderNav.NAVIGATE = {
    BACKWARD: -1,
    FORWARD: 1
  };
  return HeaderNav;
}(mixin(createComponent, initComponentBySearch, handles));

export { HeaderNav as default };