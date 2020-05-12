import React from 'react';
import { storiesOf } from '@storybook/react';
import FormItem from './FormItem';
import NumberInput from '../NumberInput';
storiesOf('FormItem', module).add('Default', function () {
  return React.createElement(FormItem, null, React.createElement(NumberInput, {
    id: "number-input-1"
  }));
}, {
  info: {
    text: 'Form item.'
  }
});