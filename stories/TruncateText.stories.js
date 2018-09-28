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

import TruncateText from '../src-web/components/common/TruncateText'


storiesOf('TruncateText', module)
  .addDecorator(centered)
  .add('truncate', withInfo(`
    Truncates text in the middle.  Shows full test in tooltip.
  `)(() =>
    <TruncateText  text='1234567890-1234567890-1234567890-1234567890-12345567890' maxCharacters={25} />
  ))

  .add('no tooltip', () => (
    <TruncateText  text='1234567890' />
  ))


