function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { withKnobs, select, text } from '@storybook/addon-knobs';
import { iconAddSolid, iconSearch } from 'carbon-icons';
import Icon from '../Icon';
import ContentSwitcher from '../ContentSwitcher';
import Switch from '../Switch';
var icons = {
  None: 'None',
  'Add with filled circle (iconAddSolid from `carbon-icons`)': 'iconAddSolid',
  'Search (iconSearch from `carbon-icons`)': 'iconSearch'
};
var iconMap = {
  iconAddSolid: React.createElement(Icon, {
    icon: iconAddSolid
  }),
  iconSearch: React.createElement(Icon, {
    icon: iconSearch
  })
};
var kinds = {
  'Anchor (anchor)': 'anchor',
  'Button (button)': 'button'
};
var props = {
  contentSwitcher: function contentSwitcher() {
    return {
      onChange: action('onChange')
    };
  },
  switch: function _switch() {
    return {
      onClick: action('onClick - Switch'),
      kind: select('Button kind (kind in <Switch>)', kinds, 'anchor'),
      href: text('The link href (href in <Switch>)', ''),
      icon: iconMap[select('Icon (icon in <Switch>)', icons, 'none')]
    };
  }
};
storiesOf('ContentSwitcher', module).addDecorator(withKnobs).add('Default', function () {
  var switchProps = props.switch();
  return React.createElement(ContentSwitcher, props.contentSwitcher(), React.createElement(Switch, _extends({
    name: "one",
    text: "First section"
  }, switchProps)), React.createElement(Switch, _extends({
    name: "two",
    text: "Second section"
  }, switchProps)), React.createElement(Switch, _extends({
    name: "three",
    text: "Third section"
  }, switchProps)));
}, {
  info: {
    text: "\n            The Content Switcher component manipulates the content shown following an exclusive or \u201Ceither/or\u201D pattern.\n            Create Switch components for each section in the content switcher.\n          "
  }
}).add('Selected', function () {
  var switchProps = props.switch();
  return React.createElement(ContentSwitcher, _extends({}, props.contentSwitcher(), {
    selectedIndex: 1
  }), React.createElement(Switch, _extends({
    name: "one",
    text: "First section"
  }, switchProps)), React.createElement(Switch, _extends({
    name: "two",
    text: "Second section"
  }, switchProps)), React.createElement(Switch, _extends({
    name: "three",
    text: "Third section"
  }, switchProps)));
}, {
  info: {
    text: "\n             Render the Content Switcher with a different section automatically selected\n           "
  }
});