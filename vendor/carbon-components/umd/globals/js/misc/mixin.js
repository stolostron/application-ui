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
    global.mixin = mod.exports;
  }
})(this, function (_exports) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = mixin;

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  function _toConsumableArray(arr) {
    return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread();
  }

  function _nonIterableSpread() {
    throw new TypeError("Invalid attempt to spread non-iterable instance");
  }

  function _iterableToArray(iter) {
    if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter);
  }

  function _arrayWithoutHoles(arr) {
    if (Array.isArray(arr)) {
      for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) {
        arr2[i] = arr[i];
      }

      return arr2;
    }
  }
  /**
   * @param {Array} a An array.
   * @returns {Array} The flattened version of the given array.
   */


  function flatten(a) {
    return a.reduce(function (result, item) {
      if (Array.isArray(item)) {
        result.push.apply(result, _toConsumableArray(flatten(item)));
      } else {
        result.push(item);
      }

      return result;
    }, []);
  }
  /**
   * An interface for defining mix-in classes. Used with {@link mixin}.
   * @function mixinfn
   * @param {Class} ToMix The class to mix.
   * @returns {Class} The class mixed-in with the given ToMix class.
   */

  /**
   * @function mixin
   * @param {...mixinfn} mixinfns The functions generating mix-ins.
   * @returns {Class} The class generated with the given mix-ins.
   */


  function mixin() {
    for (var _len = arguments.length, mixinfns = new Array(_len), _key = 0; _key < _len; _key++) {
      mixinfns[_key] = arguments[_key];
    }

    return flatten(mixinfns).reduce(function (Class, mixinfn) {
      return mixinfn(Class);
    },
    /*#__PURE__*/
    function () {
      function _class() {
        _classCallCheck(this, _class);
      }

      return _class;
    }());
  }
});