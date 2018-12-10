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

import SearchQueryCard from '../src-web/components/search/SearchQueryCard'

const cardProps = {
  name: 'name',
  description:'IBM Multicloud Manager provides a way to perform parallel queries against multiple clusters and aggregate that information by various criteria.',
  timeCreated: new Date().toLocaleString(),
  results:[{
    name: 'test'
  }, {
    name: 'test2'
  }]
}

storiesOf('SearchQueryCard', module)
  .addDecorator(centered)
  .add('critical', withInfo(`
    Card component to be used in the dashboard.
  `)(() =>
    <SearchQueryCard  {...cardProps} />
  ))



