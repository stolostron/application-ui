(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports);
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports);
    global.createComponent = mod.exports;
  }
})(this, function (_exports) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = _default;

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

  function _assertThisInitialized(self) {
    if (self === void 0) {
      throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }

    return self;
  }

  function _default(ToMix) {
    var CreateComponent =
    /*#__PURE__*/
    function (_ToMix) {
      _inherits(CreateComponent, _ToMix);
      /**
       * The component instances managed by this component.
       * Releasing this component also releases the components in `this.children`.
       * @type {Component[]}
       */

      /**
       * Mix-in class to manage lifecycle of component.
       * The constructor sets up this component's effective options,
       * and registers this component't instance associated to an element.
       * @implements Handle
       * @param {HTMLElement} element The element working as this component.
       * @param {Object} [options] The component options.
       */


      function CreateComponent(element) {
        var _this;

        var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

        _classCallCheck(this, CreateComponent);

        _this = _possibleConstructorReturn(this, _getPrototypeOf(CreateComponent).call(this, element, options));
        _this.children = [];

        if (!element || element.nodeType !== Node.ELEMENT_NODE) {
          throw new TypeError('DOM element should be given to initialize this widget.');
        }
        /**
         * The element the component is of.
         * @type {Element}
         */


        _this.element = element;
        /**
         * The component options.
         * @type {Object}
         */

        _this.options = Object.assign(Object.create(_this.constructor.options), options);

        _this.constructor.components.set(_this.element, _assertThisInitialized(_assertThisInitialized(_this)));

        return _this;
      }
      /**
       * Instantiates this component of the given element.
       * @param {HTMLElement} element The element.
       */


      _createClass(CreateComponent, [{
        key: "release",

        /**
         * Releases this component's instance from the associated element.
         */
        value: function release() {
          for (var child = this.children.pop(); child; child = this.children.pop()) {
            child.release();
          }

          this.constructor.components.delete(this.element);
          return null;
        }
      }], [{
        key: "create",
        value: function create(element, options) {
          return this.components.get(element) || new this(element, options);
        }
      }]);

      return CreateComponent;
    }(ToMix);

    return CreateComponent;
  }
});