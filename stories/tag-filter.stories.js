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
    {
      'name': 'cloud=IBM',
      'id': 'cloud=IBM',
      'key': 'cloud',
      'value': 'IBM',
      'type': 'clusterLabel'
    },
  ],
  availableFilters: {
    'clusterLabels': [
      {
        'name': 'cloud=IBM',
        'id': 'cloud=IBM',
        'key': 'cloud',
        'value': 'IBM',
        'type': 'clusterLabel'
      },
      {
        'name': 'clusterip=9.42.23.230',
        'id': 'clusterip=9.42.23.230',
        'key': 'clusterip',
        'value': '9.42.23.230',
        'type': 'clusterLabel'
      },
      {
        'name': 'datacenter=toronto',
        'id': 'datacenter=toronto',
        'key': 'datacenter',
        'value': 'toronto',
        'type': 'clusterLabel'
      },
      {
        'name': 'environment=Dev',
        'id': 'environment=Dev',
        'key': 'environment',
        'value': 'Dev',
        'type': 'clusterLabel'
      },
      {
        'name': 'owner=marketing',
        'id': 'owner=marketing',
        'key': 'owner',
        'value': 'marketing',
        'type': 'clusterLabel'
      },
      {
        'name': 'region=US',
        'id': 'region=US',
        'key': 'region',
        'value': 'US',
        'type': 'clusterLabel'
      },
      {
        'name': 'runtime=kubernetes',
        'id': 'runtime=kubernetes',
        'key': 'runtime',
        'value': 'kubernetes',
        'type': 'clusterLabel'
      },
      {
        'name': 'vendor=ICP',
        'id': 'vendor=ICP',
        'key': 'vendor',
        'value': 'ICP',
        'type': 'clusterLabel'
      },
      {
        'name': 'clusterip=9.42.23.217',
        'id': 'clusterip=9.42.23.217',
        'key': 'clusterip',
        'value': '9.42.23.217',
        'type': 'clusterLabel'
      },
      {
        'name': 'datacenter=raleigh',
        'id': 'datacenter=raleigh',
        'key': 'datacenter',
        'value': 'raleigh',
        'type': 'clusterLabel'
      },
      {
        'name': 'environment=Prod',
        'id': 'environment=Prod',
        'key': 'environment',
        'value': 'Prod',
        'type': 'clusterLabel'
      }
    ],
    'clusterNames': [
      {
        'name': 'cluster=crucial-owl',
        'id': 'crucial-owl',
        'value': 'crucial-owl',
        'type': 'clusterName'
      },
      {
        'name': 'cluster=myminikube',
        'id': 'myminikube',
        'value': 'myminikube',
        'type': 'clusterName'
      }
    ]
  }
}

storiesOf('TagInput', module)
  .addDecorator(centered)
  .add('all in one', withInfo(`
    Taginput with combo box and clickable button.
  `)(() =>
    <TagInput  {...tagFilterProps} />
  ))


