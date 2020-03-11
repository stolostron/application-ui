function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { withKnobs, text } from '@storybook/addon-knobs';
import Toggle from '../Toggle';
import ToggleSkeleton from '../Toggle/Toggle.Skeleton';

var toggleProps = function toggleProps() {
  return {
    className: 'some-class',
    labelA: text('Label for untoggled state (labelA)', 'Off'),
    labelB: text('Label for toggled state (labelB)', 'On'),
    onChange: action('onChange'),
    onToggle: action('onToggle')
  };
};

storiesOf('Toggle', module).addDecorator(withKnobs).add('toggled', function () {
  return React.createElement(Toggle, _extends({
    defaultToggled: true
  }, toggleProps(), {
    className: "some-class",
    id: "toggle-1"
  }));
}, {
  info: {
    text: "\n            Toggles are controls that are used to quickly switch between two possible states. The example below shows\n            an uncontrolled Toggle component. To use the Toggle component as a controlled component, set the toggled property.\n            Setting the toggled property will allow you to change the value dynamically, whereas setting the defaultToggled\n            prop will only set the value initially. This example has defaultToggled set to true.\n          "
  }
}).add('untoggled', function () {
  return React.createElement(Toggle, _extends({}, toggleProps(), {
    className: "some-class",
    id: "toggle-1"
  }));
}, {
  info: {
    text: "\n            Toggles are controls that are used to quickly switch between two possible states. The example below shows\n            an uncontrolled Toggle component. To use the Toggle component as a controlled component, set the toggled property.\n            Setting the toggled property will allow you to change the value dynamically, whereas setting the defaultToggled\n            prop will only set the value initially. This example has defaultToggled set to false.\n          "
  }
}).add('skeleton', function () {
  return React.createElement(ToggleSkeleton, null);
}, {
  info: {
    text: "\n            Placeholder skeleton state to use when content is loading.\n          "
  }
});