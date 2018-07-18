/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2018. All Rights Reserved.
 *
 * Note to U.S. Government Users Restricted Rights:
 * Use, duplication or disclosure restricted by GSA ADP Schedule
 * Contract with IBM Corp.
 *******************************************************************************/
'use strict'

import React from 'react'
import renderer from 'react-test-renderer'

import { Dashboard } from '../../../../src-web/containers/DashboardTab'

const secondaryHeader = {
  title: 'routes.dashboard',
  tabs: [
    {
      id: 'dashboard-application',
      label: 'tabs.dashboard.application',
      url: '/dashboard'
    }
  ],
}

const cardItems = [
  {
    'name': 'pods',
    'healthy': 105,
    'critical': 25,
    'warning': 0,
    'table': [
      {
        'status': 'critical',
        'link': '',
        'resourceName': 'auth-idp-platform-auth-cert-gen-h2rt4',
        'percentage': 0
      },
      {
        'status': 'critical',
        'link': '',
        'resourceName': 'db2-stock-trader-ibm-db2oltp-dev-5b77c44d4-b7tbz',
        'percentage': 0
      },
      {
        'status': 'critical',
        'link': '',
        'resourceName': 'hcm-hcm-allinone-hcmm-865b6474dc-dkc2z',
        'percentage': 0
      },
      {
        'status': 'critical',
        'link': '',
        'resourceName': 'hcmk-hcm-allinone-hcmm-6ff999b67f-6czvg',
        'percentage': 0
      },
      {
        'status': 'critical',
        'link': '',
        'resourceName': 'helm-api-helm-cert-gen-job-cpm49',
        'percentage': 0
      }
    ],
    'error': null
  },
]

const pieChartItems =  [
  {
    'name': 'totalClusterHealth',
    'data': [
      [
        'healthy',
        '2'
      ],
      [
        'warning',
        '0'
      ],
      [
        'critical',
        '0'
      ]
    ]
  }
]
describe('SecondaryHeader component 1', () => {
  it('renders as expected', () => {
    const component = renderer.create(
      <Dashboard secondaryHeaderProps={secondaryHeader} cardItems={cardItems} pieChartItems={pieChartItems} />
    )
    expect(component.toJSON()).toMatchSnapshot()
  })
})



