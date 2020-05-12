import React from 'react';
import { storiesOf } from '@storybook/react';
import { withKnobs, boolean, select, text, number } from '@storybook/addon-knobs';
import Tooltip from '../Tooltip';
var directions = {
  'Bottom (bottom)': 'bottom',
  'Left (left)': 'left',
  'Top (top)': 'top',
  'Right (right)': 'right'
};
var props = {
  withIcon: function withIcon() {
    return {
      clickToOpen: boolean('Click to open (clickToOpen)', false),
      direction: select('Tooltip direction (direction)', directions, 'bottom'),
      triggerText: text('Trigger text (triggerText)', 'Tooltip label'),
      tabIndex: number('Tab index (tabIndex in <Tooltip>)', 0)
    };
  },
  withoutIcon: function withoutIcon() {
    return {
      showIcon: false,
      direction: select('Tooltip direction (direction)', directions, 'bottom'),
      triggerText: text('Trigger text (triggerText)', 'Tooltip label'),
      tabIndex: number('Tab index (tabIndex in <Tooltip>)', 0)
    };
  }
};
storiesOf('Tooltip', module).addDecorator(withKnobs).add('default (bottom)', function () {
  return React.createElement("div", {
    style: {
      marginTop: '2rem'
    }
  }, React.createElement(Tooltip, props.withIcon(), React.createElement("p", {
    className: "bx--tooltip__label"
  }, "Tooltip subtitle"), React.createElement("p", null, "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaeca cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.")));
}, {
  info: {
    text: "\n            Tooltips are used to supply additional information to an element when hovering over it. By default,\n            the tooltip will render above the element. The example below shows the default scenario.\n          "
  }
}).add('no icon', function () {
  return React.createElement("div", {
    style: {
      marginTop: '2rem'
    }
  }, React.createElement(Tooltip, props.withoutIcon(), React.createElement("p", {
    className: "bx--tooltip__label"
  }, "Tooltip subtitle"), React.createElement("p", null, "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaeca cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.")));
}, {
  info: {
    text: "\n            Tooltips are used to supply additional information to an element when hovering over it. By default,\n            the tooltip will render with an information Icon. The example below shows the option to exclude the Icon.\n          "
  }
});