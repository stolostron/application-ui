(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define([], factory);
  } else if (typeof exports !== "undefined") {
    factory();
  } else {
    var mod = {
      exports: {}
    };
    factory();
    global.floatingMenuConfig = mod.exports;
  }
})(this, function () {
  'use strict';

  module.exports = {
    hidden: true
  };
});