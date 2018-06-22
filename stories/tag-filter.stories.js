/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2018. All Rights Reserved.
 *
 * Note to U.S. Government Users Restricted Rights:
 * Use, duplication or disclosure restricted by GSA ADP Schedule
 * Contract with IBM Corp.
 *******************************************************************************/

import React from 'react'

import { storiesOf } from '@storybook/react'
import centered from '@storybook/addon-centered'
import { withInfo } from '@storybook/addon-info'

import TagInput from '../src-web/components/common/TagInput'


const tagFilterProps = {
  tags: [
    { id: 'tag1', text: 'tag1' },
    { id: 'tag2', text: 'tag2' }
  ],
  suggestions: [
    { id: 'tag1', text: 'tag1' },
    { id: 'tag2', text: 'tag2' },
    { id: 'tag3', text: 'tag3' },
    { id: 'tag4', text: 'tag4' },
    { id: 'tag5', text: 'tag5' },
    { id: 'tag6', text: 'tag6' }
  ]
}

storiesOf('TagInput', module)
  .addDecorator(centered)
  .add('all in one', withInfo(`
    Taginput with combo box and clickable button.
  `)(() =>
    <TagInput  {...tagFilterProps} />
  ))


