/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2019. All Rights Reserved.
 *
 * Note to U.S. Government Users Restricted Rights:
 * Use, duplication or disclosure restricted by GSA ADP Schedule
 * Contract with IBM Corp.
 *******************************************************************************/
'use strict'

import React from 'react'
import { MockedProvider } from 'react-apollo/test-utils'
import renderer from 'react-test-renderer'

import ActionModalApollo from '../../../../../src-web/components/common-apollo/ActionModalApollo'
import { GET_ACTION_MODAL_STATE } from '../../../../../src-web/apollo-client/queries/StateQueries'

const delay = (ms) =>
  new Promise(resolve => {
    setTimeout(() => {
      resolve()
    }, ms)
  })

const mocks = {
  invalidMock: {
    request: { query: GET_ACTION_MODAL_STATE },
    result: {
      data: {
        actionModal: {
          open: true,
          type: 'invalid',
          resourceType: {
            name: 'invalid',
            list: 'invalid'
          },
          data: {
            name: 'invalid',
            namespace: 'invalid',
            clusterName: 'invalid',
            selfLink: 'invalid',
            kind: 'invalid'
          }
        },
      },
    },
  },
  editMock: {
    request: { query: GET_ACTION_MODAL_STATE },
    result: {
      data: {
        actionModal: {
          open: true,
          type: 'table.actions.edit',
          resourceType: {
            name: 'HCMPod',
            list: 'HCMPodList'
          },
          data: {
            name: 'icp-mongodb-0',
            namespace: 'kube-system',
            clusterName: 'local-cluster',
            selfLink: '/api/v1/namespaces/kube-system/pods/icp-mongodb-0',
            kind: 'pods'
          }
        },
      },
    },
  },
  editLabelMock: {
    request: { query: GET_ACTION_MODAL_STATE },
    result: {
      data: {
        actionModal: {
          open: true,
          type: 'table.actions.cluster.edit.labels',
          resourceType: {
            name: 'HCMPod',
            list: 'HCMPodList'
          },
          data: {
            name: 'icp-mongodb-0',
            namespace: 'kube-system',
            clusterName: 'local-cluster',
            selfLink: '/api/v1/namespaces/kube-system/pods/icp-mongodb-0',
            kind: 'pods'
          }
        },
      },
    },
  },
  podLogsMock: {
    request: { query: GET_ACTION_MODAL_STATE },
    result: {
      data: {
        actionModal: {
          open: true,
          type: 'table.actions.pod.logs',
          resourceType: {
            name: 'HCMPod',
            list: 'HCMPodList'
          },
          data: {
            name: 'icp-mongodb-0',
            namespace: 'kube-system',
            clusterName: 'local-cluster',
            selfLink: '/api/v1/namespaces/kube-system/pods/icp-mongodb-0',
            kind: 'pods'
          }
        },
      },
    },
  },
  removeMock: {
    request: { query: GET_ACTION_MODAL_STATE },
    result: {
      data: {
        actionModal: {
          open: true,
          type: 'table.actions.remove',
          resourceType: {
            name: 'HCMPod',
            list: 'HCMPodList'
          },
          data: {
            name: 'icp-mongodb-0',
            namespace: 'kube-system',
            clusterName: 'local-cluster',
            selfLink: '/api/v1/namespaces/kube-system/pods/icp-mongodb-0',
            kind: 'pods'
          }
        },
      },
    },
  }
}

describe('ActionModalApollo Testing', () => {
  it('To Return Null For Invalid Table Action', async () => {
    const component = renderer.create(
      <MockedProvider mocks={[mocks.invalidMock]} addTypename={false}>
        <ActionModalApollo locale={'en-US'} />
      </MockedProvider>,
    )
    await delay(0)
    expect(component.toJSON()).toEqual(null)
  })

  it('Changes Apollo Client Cache For Edit Modal', async () => {
    const component = renderer.create(
      <MockedProvider mocks={[mocks.editMock]} addTypename={false}>
        <ActionModalApollo locale={'en-US'} />
      </MockedProvider>,
    )
    await delay(0)
    expect(component.getInstance().state.client.cache.data.data).toMatchSnapshot()
  })

  it('Changes Apollo Client Cache For Edit Labels Modal', async () => {
    const component = renderer.create(
      <MockedProvider mocks={[mocks.editLabelMock]} addTypename={false}>
        <ActionModalApollo locale={'en-US'} />
      </MockedProvider>,
    )
    await delay(0)
    expect(component.getInstance().state.client.cache.data.data).toMatchSnapshot()
  })

  it('Changes Apollo Client Cache For Pod Logs Modal', async () => {
    const component = renderer.create(
      <MockedProvider mocks={[mocks.podLogsMock]} addTypename={false}>
        <ActionModalApollo locale={'en-US'} />
      </MockedProvider>,
    )
    await delay(0)
    expect(component.getInstance().state.client.cache.data.data).toMatchSnapshot()
  })

  it('Changes Apollo Client Cache For Remove Resource Modal', async () => {
    const component = renderer.create(
      <MockedProvider mocks={[mocks.removeMock]} addTypename={false}>
        <ActionModalApollo locale={'en-US'} />
      </MockedProvider>,
    )
    await delay(0)
    expect(component.getInstance().state.client.cache.data.data).toMatchSnapshot()
  })
})
