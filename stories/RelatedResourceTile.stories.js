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

import RelatedResourceTile from '../src-web/components/search/RelatedResourceTile'


storiesOf('RelatedResourceTile', module)
  .addDecorator(centered)
  .add('related tile', withInfo(`
    Show # of resources related to the search results
  `)(() =>
    <RelatedResourceTile count={4000} kind={'services'} loading={false} />
  ))
