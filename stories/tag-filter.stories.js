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
    { id: 'tag1', name: 'tag1' },
    { id: 'tag2', name: 'tag2' }
  ],
  availableFilters: [
    { id: 'tag1', name: 'tag1' },
    { id: 'tag2', name: 'tag2' },
    { id: 'tag3', name: 'tag3' },
    { id: 'tag4', name: 'tag4' },
    { id: 'tag5', name: 'tag5' },
    { id: 'tag6', name: 'tag6' }
  ]
}

storiesOf('TagInput', module)
  .addDecorator(centered)
  .add('all in one', withInfo(`
    Taginput with combo box and clickable button.
  `)(() =>
    <TagInput  {...tagFilterProps} />
  ))


