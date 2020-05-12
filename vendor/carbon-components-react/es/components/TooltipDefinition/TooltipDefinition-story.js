import React from 'react';
import { storiesOf } from '@storybook/react';
import { withKnobs, select, text } from '@storybook/addon-knobs';
import TooltipDefinition from '../TooltipDefinition';
var directions = {
  'Bottom (bottom)': 'bottom',
  'Top (top)': 'top'
};

var props = function props() {
  return {
    direction: select('Tooltip direction (direction)', directions, 'bottom'),
    tooltipText: text('Tooltip content (tooltipText)', 'Brief description of the dotted, underlined word above.')
  };
};

storiesOf('TooltipDefinition', module).addDecorator(withKnobs).add('default', function () {
  return React.createElement("div", {
    style: {
      marginTop: '2rem'
    }
  }, React.createElement(TooltipDefinition, props(), "Definition Tooltip"));
}, {
  info: {
    text: "\n            Definition Tooltip\n          "
  }
});