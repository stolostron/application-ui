"use strict";

var _react = _interopRequireDefault(require("react"));

var _SkeletonPlaceholder = _interopRequireDefault(require("../SkeletonPlaceholder"));

var _enzyme = require("enzyme");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

describe('SkeletonPlaceholder', function () {
  var wrapper = (0, _enzyme.shallow)(_react.default.createElement(_SkeletonPlaceholder.default, null));
  it('Has the expected classes', function () {
    expect(wrapper.hasClass('bx--skeleton__placeholder')).toEqual(true);
  });
});