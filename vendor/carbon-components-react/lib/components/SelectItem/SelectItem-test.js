"use strict";

var _react = _interopRequireDefault(require("react"));

var _SelectItem = _interopRequireDefault(require("../SelectItem"));

var _enzyme = require("enzyme");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

describe('SelectItem', function () {
  describe('Renders as expected', function () {
    var wrapper = (0, _enzyme.shallow)(_react.default.createElement(_SelectItem.default, {
      className: "extra-class",
      value: "test",
      text: "test"
    }));
    it('Has the expected classes', function () {
      expect(wrapper.hasClass('bx--select-option')).toEqual(true);
    });
    it('Should add extra classes that are passed via className', function () {
      expect(wrapper.hasClass('extra-class')).toEqual(true);
    });
    it('Should add the value that is passed', function () {
      wrapper.setProps({
        value: 'placeholder-item'
      });
      expect(wrapper.props().value).toEqual('placeholder-item');
    });
    it('Should add the select item text that is passed', function () {
      wrapper.setProps({
        text: 'Pick an option'
      });
      expect(wrapper.props().children).toEqual('Pick an option');
    });
    it('Should not be disabled by default', function () {
      expect(wrapper.props().disabled).toEqual(false);
    });
    it('should set disabled as expected', function () {
      expect(wrapper.props().disabled).toEqual(false);
      wrapper.setProps({
        disabled: true
      });
      expect(wrapper.props().disabled).toEqual(true);
    });
    it('should set hidden as expected', function () {
      expect(wrapper.props().hidden).toEqual(false);
      wrapper.setProps({
        hidden: true
      });
      expect(wrapper.props().hidden).toEqual(true);
    });
  });
});