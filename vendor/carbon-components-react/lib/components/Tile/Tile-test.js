"use strict";

var _react = _interopRequireDefault(require("react"));

var _carbonIcons = require("carbon-icons");

var _Tile = require("../Tile");

var _enzyme = require("enzyme");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

describe('Tile', function () {
  describe('Renders default tile as expected', function () {
    var wrapper = (0, _enzyme.shallow)(_react.default.createElement(_Tile.Tile, {
      className: "extra-class"
    }, _react.default.createElement("div", {
      className: "child"
    }, "Test")));
    it('renders children as expected', function () {
      expect(wrapper.find('.child').length).toBe(1);
    });
    it('has the expected classes', function () {
      expect(wrapper.hasClass('bx--tile')).toEqual(true);
    });
    it('renders extra classes passed in via className', function () {
      expect(wrapper.hasClass('extra-class')).toEqual(true);
    });
  });
  describe('Renders clickable tile as expected', function () {
    var wrapper = (0, _enzyme.shallow)(_react.default.createElement(_Tile.ClickableTile, {
      className: "extra-class"
    }, _react.default.createElement("div", {
      className: "child"
    }, "Test")));
    beforeEach(function () {
      wrapper.state().clicked = false;
    });
    it('renders children as expected', function () {
      expect(wrapper.find('.child').length).toBe(1);
    });
    it('has the expected classes', function () {
      expect(wrapper.hasClass('bx--tile--clickable')).toEqual(true);
    });
    it('renders extra classes passed in via className', function () {
      expect(wrapper.hasClass('extra-class')).toEqual(true);
    });
    it('toggles the clickable class on click', function () {
      expect(wrapper.hasClass('bx--tile--is-clicked')).toEqual(false);
      wrapper.simulate('click');
      expect(wrapper.hasClass('bx--tile--is-clicked')).toEqual(true);
    });
    it('toggles the clickable state on click', function () {
      expect(wrapper.state().clicked).toEqual(false);
      wrapper.simulate('click');
      expect(wrapper.state().clicked).toEqual(true);
    });
    it('toggles the clicked state when using enter or space', function () {
      expect(wrapper.state().clicked).toEqual(false);
      wrapper.simulate('keydown', {
        which: 32
      });
      expect(wrapper.state().clicked).toEqual(true);
      wrapper.simulate('keydown', {
        which: 13
      });
      expect(wrapper.state().clicked).toEqual(false);
    });
    it('supports setting initial clicked state from props', function () {
      expect((0, _enzyme.shallow)(_react.default.createElement(_Tile.ClickableTile, {
        clicked: true
      })).state().clicked).toEqual(true);
    });
    it('supports setting clicked state from props', function () {
      wrapper.setProps({
        clicked: true
      });
      wrapper.setState({
        clicked: true
      });
      wrapper.setProps({
        clicked: false
      });
      expect(wrapper.state().clicked).toEqual(false);
    });
    it('avoids changing clicked state upon setting props, unless actual value change is detected', function () {
      wrapper.setProps({
        clicked: true
      });
      wrapper.setState({
        clicked: false
      });
      wrapper.setProps({
        clicked: true
      });
      expect(wrapper.state().clicked).toEqual(false);
    });
  });
  describe('Renders selectable tile as expected', function () {
    var wrapper = (0, _enzyme.mount)(_react.default.createElement(_Tile.SelectableTile, {
      className: "extra-class"
    }, _react.default.createElement("div", {
      className: "child"
    }, "Test")));
    beforeEach(function () {
      wrapper.state().selected = false;
    });
    it('renders children as expected', function () {
      expect(wrapper.find('.child').length).toBe(1);
    });
    it('has the expected classes', function () {
      expect(wrapper.children().hasClass('bx--tile--selectable')).toEqual(true);
    });
    it('renders extra classes passed in via className', function () {
      expect(wrapper.hasClass('extra-class')).toEqual(true);
    });
    it('toggles the selectable state on click', function () {
      expect(wrapper.state().selected).toEqual(false);
      wrapper.simulate('click');
      expect(wrapper.state().selected).toEqual(true);
    });
    it('toggles the selectable state when using enter or space', function () {
      expect(wrapper.state().selected).toEqual(false);
      wrapper.simulate('keydown', {
        which: 32
      });
      expect(wrapper.state().selected).toEqual(true);
      wrapper.simulate('keydown', {
        which: 13
      });
      expect(wrapper.state().selected).toEqual(false);
    });
    it('the input should be checked when state is selected', function () {
      wrapper.setState({
        selected: true
      });
      expect(wrapper.find('input').props().checked).toEqual(true);
    });
    it('supports setting initial selected state from props', function () {
      expect((0, _enzyme.shallow)(_react.default.createElement(_Tile.SelectableTile, {
        selected: true
      })).state().selected).toEqual(true);
    });
    it('supports setting selected state from props', function () {
      wrapper.setProps({
        selected: true
      });
      wrapper.setState({
        selected: true
      });
      wrapper.setProps({
        selected: false
      });
      expect(wrapper.state().selected).toEqual(false);
    });
    it('avoids changing selected state upon setting props, unless actual value change is detected', function () {
      wrapper.setProps({
        selected: true
      });
      wrapper.setState({
        selected: false
      });
      wrapper.setProps({
        selected: true
      });
      expect(wrapper.state().selected).toEqual(false);
    });
  });
  describe('Renders expandable tile as expected', function () {
    var wrapper = (0, _enzyme.mount)(_react.default.createElement(_Tile.ExpandableTile, {
      className: "extra-class"
    }, _react.default.createElement(_Tile.TileAboveTheFoldContent, {
      className: "child"
    }, _react.default.createElement("div", {
      style: {
        height: '200px'
      }
    }, "Test")), _react.default.createElement(_Tile.TileBelowTheFoldContent, {
      className: "child"
    }, _react.default.createElement("div", {
      style: {
        height: '500px'
      }
    }, "Test"))));
    beforeEach(function () {
      wrapper.state().expanded = false;
    });
    it('renders children as expected', function () {
      expect(wrapper.props().children.length).toBe(2);
    });
    it('has the expected classes', function () {
      expect(wrapper.children().hasClass('bx--tile--expandable')).toEqual(true);
    });
    it('renders extra classes passed in via className', function () {
      expect(wrapper.hasClass('extra-class')).toEqual(true);
    });
    it('toggles the expandable class on click', function () {
      expect(wrapper.children().hasClass('bx--tile--is-expanded')).toEqual(false);
      wrapper.simulate('click');
      expect(wrapper.children().hasClass('bx--tile--is-expanded')).toEqual(true);
    });
    it('toggles the expandable state on click', function () {
      expect(wrapper.state().expanded).toEqual(false);
      wrapper.simulate('click');
      expect(wrapper.state().expanded).toEqual(true);
    });
    it('displays the default tooltip for the chevron depending on state', function () {
      var defaultExpandedIconText = 'Collapse';
      var defaultCollapsedIconText = 'Expand'; // Force the expanded tile to be collapsed.

      wrapper.setState({
        expanded: false
      });
      var collapsedDescription = wrapper.find({
        icon: _carbonIcons.iconChevronDown
      }).getElements()[0].props.description;
      expect(collapsedDescription).toEqual(defaultCollapsedIconText); // click on the item to expand it.

      wrapper.simulate('click'); // Validate the description change

      var expandedDescription = wrapper.find({
        icon: _carbonIcons.iconChevronDown
      }).getElements()[0].props.description;
      expect(expandedDescription).toEqual(defaultExpandedIconText);
    });
    it('displays the custom tooltips for the chevron depending on state', function () {
      var tileExpandedIconText = 'Click To Collapse';
      var tileCollapsedIconText = 'Click To Expand'; // Force the custom icon text

      wrapper.setProps({
        tileExpandedIconText: tileExpandedIconText,
        tileCollapsedIconText: tileCollapsedIconText
      }); // Force the expanded tile to be collapsed.

      wrapper.setState({
        expanded: false
      });
      var collapsedDescription = wrapper.find({
        icon: _carbonIcons.iconChevronDown
      }).getElements()[0].props.description;
      expect(collapsedDescription).toEqual(tileCollapsedIconText); // click on the item to expand it.

      wrapper.simulate('click'); // Validate the description change

      var expandedDescription = wrapper.find({
        icon: _carbonIcons.iconChevronDown
      }).getElements()[0].props.description;
      expect(expandedDescription).toEqual(tileExpandedIconText);
    });
    it('supports setting initial expanded state from props', function () {
      var _mount$state = (0, _enzyme.mount)(_react.default.createElement(_Tile.ExpandableTile, {
        expanded: true
      }, _react.default.createElement(_Tile.TileAboveTheFoldContent, {
        className: "child"
      }, _react.default.createElement("div", {
        style: {
          height: '200px'
        }
      }, "Test")), _react.default.createElement(_Tile.TileBelowTheFoldContent, {
        className: "child"
      }, _react.default.createElement("div", {
        style: {
          height: '500px'
        }
      }, "Test")))).state(),
          expanded = _mount$state.expanded;

      expect(expanded).toEqual(true);
    });
    it('supports setting expanded state from props', function () {
      wrapper.setProps({
        expanded: true
      });
      wrapper.setState({
        expanded: true
      });
      wrapper.setProps({
        expanded: false
      });
      expect(wrapper.state().expanded).toEqual(false);
    });
    it('avoids changing expanded state upon setting props, unless actual value change is detected', function () {
      wrapper.setProps({
        expanded: true
      });
      wrapper.setState({
        expanded: false
      });
      wrapper.setProps({
        expanded: true
      });
      expect(wrapper.state().expanded).toEqual(false);
    });
    it('supports setting max height from props', function () {
      wrapper.setProps({
        tileMaxHeight: 2
      });
      wrapper.setState({
        tileMaxHeight: 2
      });
      wrapper.setProps({
        tileMaxHeight: 1
      });
      expect(wrapper.state().tileMaxHeight).toEqual(1);
    });
    it('avoids changing max height upon setting props, unless actual value change is detected', function () {
      wrapper.setProps({
        tileMaxHeight: 2
      });
      wrapper.setState({
        tileMaxHeight: 1
      });
      wrapper.setProps({
        tileMaxHeight: 2
      });
      expect(wrapper.state().tileMaxHeight).toEqual(1);
    });
    it('supports setting padding from props', function () {
      wrapper.setProps({
        tilePadding: 2
      });
      wrapper.setState({
        tilePadding: 2
      });
      wrapper.setProps({
        tilePadding: 1
      });
      expect(wrapper.state().tilePadding).toEqual(1);
    });
    it('avoids changing padding upon setting props, unless actual value change is detected', function () {
      wrapper.setProps({
        tilePadding: 2
      });
      wrapper.setState({
        tilePadding: 1
      });
      wrapper.setProps({
        tilePadding: 2
      });
      expect(wrapper.state().tilePadding).toEqual(1);
    });
  });
});