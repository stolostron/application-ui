/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2019. All Rights Reserved.
 *
 * Note to U.S. Government Users Restricted Rights:
 * Use, duplication or disclosure restricted by GSA ADP Schedule
 * Contract with IBM Corp.
 *******************************************************************************/

const React = require('react')
const renderer = require('react-test-renderer')
const CountsCardModule = require('../CountsCardModule').default

describe('CountsCardModule', () => {
  const countsCardData = [
    {
      msgKey: 'dashboard.card.deployables',
      textKey: 'dashboard.card.perInstance',
      count: 6,
      border: 'right'
    },
    {
      msgKey: 'dashboard.card.deployments',
      textKey: 'dashboard.card.total',
      count: 38
    },
    {
      msgKey: 'dashboard.card.deployment.completed',
      textKey: 'dashboard.card.deployments',
      count: 24
    },
    {
      msgKey: 'dashboard.card.deployment.inProgress',
      textKey: 'dashboard.card.deployments',
      count: 10
    },
    {
      msgKey: 'dashboard.card.deployment.failed',
      textKey: 'dashboard.card.deployments',
      count: 4,
      alert: true
    },
    {
      msgKey: 'dashboard.card.incidents',
      textKey: 'dashboard.card.total',
      count: 2,
      alert: true,
      border: 'left'
    }
  ]

  it('CountsCardModule renders correctly.', () => {
    const tree = renderer
      .create(<CountsCardModule data={countsCardData} />)
      .toJSON()
    expect(tree).toMatchSnapshot()
  })
})
