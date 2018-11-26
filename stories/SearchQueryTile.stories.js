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

import SearchQueryTile from '../src-web/components/search/SearchQueryTile'


storiesOf('SearchQueryTile', module)
  .addDecorator(centered)
  .add('saved query', withInfo(`
    Show number of results for a given saved query
  `)(() =>
    <SearchQueryTile
      name={'Cluster-calico-node_Toronto'}
      description={'Toronto searches were added through all the storage capacity of each clusters and other lorem ipsum information'}
      count={1234}
      loading={false}
      template={false} />
  ))
  .add('suggested query', withInfo(`
    Template for a search query with example results
  `)(() =>
    <SearchQueryTile
      name={'Cluster-calico-node_Toronto'}
      description={'Toronto searches were added through all the storage capacity of each clusters and other lorem ipsum information'}
      count={123}
      loading={false}
      template={true} />
  ))
