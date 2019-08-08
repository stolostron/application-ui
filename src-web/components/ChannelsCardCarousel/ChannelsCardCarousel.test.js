/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2019. All Rights Reserved.
 *
 * Note to U.S. Government Users Restricted Rights:
 * Use, duplication or disclosure restricted by GSA ADP Schedule
 * Contract with IBM Corp.
 *******************************************************************************/
// import { Provider } from 'react-redux'
// import store from '../../../src-web/index'
/* eslint-disable no-unused-vars */

const React = require('react')
const renderer = require('react-test-renderer')
const ChannelsCardCarousel = require('../ChannelsCardCarousel').default

describe('ChannelsCardCarousel', () => {
  const channelsCardData = [
    {
      name: 'Development',
      counts: {
        pending: {
          total: 3
        },
        'in progress': {
          total: 2
        },
        failed: {
          total: 1
        }
      }
    },
    {
      name: 'QA',
      counts: {
        pending: {
          total: 3
        },
        'in progress': {
          total: 2
        },
        failed: {
          total: 1
        }
      }
    },
    {
      name: 'Dev',
      counts: {
        pending: {
          total: 3
        },
        'in progress': {
          total: 2
        },
        failed: {
          total: 1
        }
      }
    }
  ]

  it('ChannelsCardCarousel renders correctly.', () => {
    // const tree = renderer
    //   .create(<Provider store={store}><ChannelsCardCarousel data={channelsCardData} /></Provider>)
    //   .toJSON()
    // expect(tree).toMatchSnapshot()
  })
})
