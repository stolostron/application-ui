/*******************************************************************************
 * Licensed Materials - Property of IBM
 * 5737-E67
 * (c) Copyright IBM Corporation 2017, 2019. All Rights Reserved.
 *
 * US Government Users Restricted Rights - Use, duplication or disclosure
 * restricted by GSA ADP Schedule Contract with IBM Corp.
 *******************************************************************************/

import React from 'react'
import msgs from '../../../../../nls/platform.properties'
import { withLocale } from '../../../../providers/LocaleProvider'
import resources from '../../../../../lib/shared/resources'
import { Modal } from 'carbon-components-react'
import R from 'ramda'
import ProgressBar from '../ProgressBar/index'
import { getLabelsListClass, getCsvListClass, getSearchUrl } from './utils.js'
import {
  getResourcesStatusPerChannel,
  getDataByKind
} from '../PipelineGrid/utils'

resources(() => {
  require('./style.scss')
})

const SubscriptionInfo = withLocale(
  ({ subscriptionModalSubscriptionInfo, bulkSubscriptionList, locale }) => {
    const notEmptySubscription =
      !R.isEmpty(subscriptionModalSubscriptionInfo) &&
      subscriptionModalSubscriptionInfo &&
      subscriptionModalSubscriptionInfo.namespace

    let clusterNames = ['N/A']
    let labels = []
    let deployableNames = ['N/A']
    let subName = ''
    let subNamespace = ''
    let label_hover = ''
    // let clusters_hover = ''
    // let deployables_hover = ''
    let owningClusterName = ''
    let channel = ''
    let status = [0, 0, 0, 0, 0]
    // let version = ''

    if (notEmptySubscription) {
      // Gather the subscription data that contains the matching UID
      const subscriptionWithRelatedData = getDataByKind(
        bulkSubscriptionList,
        subscriptionModalSubscriptionInfo._uid
      )

      const foundBulkSubscription =
        subscriptionWithRelatedData && !R.isEmpty(subscriptionWithRelatedData)

      if (foundBulkSubscription) {
        const related = R.pathOr(
          [{}],
          ['related'],
          subscriptionWithRelatedData
        )
        const clusters = R.find(R.propEq('kind', 'cluster'))(related)

        if (clusters && clusters.items) {
          clusterNames = clusters.items.map(cluster => {
            return ' ' + cluster.name || ''
          })
        }

        const deployables = R.find(R.propEq('kind', 'deployable'))(related)
        if (deployables && deployables.items) {
          deployableNames = deployables.items.map(deployable => {
            return ' ' + deployable.name || ''
          })
        }
      }

      labels = R.split(
        ';',
        R.pathOr('N/A', ['label'], subscriptionModalSubscriptionInfo)
      )

      const labels_data = getLabelsListClass(labels)
      labels = labels_data.data
      label_hover = labels_data.hover

      const clusters_data = getCsvListClass(clusterNames)
      clusterNames = clusters_data.data
      // clusters_hover = clusters_data.hover

      const deployables_data = getCsvListClass(deployableNames)
      deployableNames = deployables_data.data
      // deployables_hover = deployables_data.hover

      subName =
        subscriptionModalSubscriptionInfo &&
        subscriptionModalSubscriptionInfo.name
          ? subscriptionModalSubscriptionInfo.name
          : ''
      subNamespace =
        subscriptionModalSubscriptionInfo &&
        subscriptionModalSubscriptionInfo.namespace
          ? subscriptionModalSubscriptionInfo.namespace
          : ''

      owningClusterName = R.pathOr(
        '',
        ['cluster'],
        subscriptionModalSubscriptionInfo
      )

      channel = R.pathOr('', ['channel'], subscriptionModalSubscriptionInfo)

      // Get status of resources within the subscription specific
      // to the channel. We will match the resources that contain
      // the same namespace as the channel
      // status = [0, 0, 0, 0, 0] // pass, fail, inprogress, pending, unidentifed
      status = getResourcesStatusPerChannel(subscriptionWithRelatedData)
    }

    return (
      <div className="subscriptionInfoClass">
        <div className="progressHeader">
          <div className="subscriptionNameHeader">{subName}</div>
          <ProgressBar status={status} />
        </div>
        <div className="subHeader">
          <div className="mainSubscriptionHeader">
            {msgs.get('description.Modal.SubscriptionInfo', locale)}
          </div>
          <div className="value">{subName}</div>
        </div>
        <div className="innerContent">
          <div className="placement">
            <div className="subHeader">
              <div className="subscriptionInfoHeader">
                {msgs.get('description.Modal.Namespace', locale)}
              </div>
              <div className="value">{subNamespace}</div>
            </div>
            <div className="subHeader">
              <div className="subscriptionInfoHeader">
                {msgs.get('description.Modal.channel', locale)}
              </div>
              <div className="value">{channel}</div>
            </div>
            <div className="subHeader">
              <div className="subscriptionInfoHeader">
                {msgs.get('description.Modal.SubscriptionCluster', locale)}
              </div>
              <div className="value">{owningClusterName}</div>
            </div>
            <div className="subHeader">
              <div className="subscriptionInfoHeader">
                {msgs.get(
                  'description.title.deployableSubscription.deployables',
                  locale
                )}
              </div>
              <div className="value">
                {deployableNames &&
                  deployableNames.length > 0 &&
                  deployableNames
                    .map(deployable => {
                      return <span key={Math.random()}>{deployable}</span>
                    })
                    .reduce((prev, curr) => [prev, ', ', curr])}
              </div>
            </div>
            <div className="subHeader">
              <div className="subscriptionInfoHeaderIndented" />
              <div className="value">
                <a href={getSearchUrl(subName)} target="_blank">
                  {msgs.get('description.Modal.viewAllResources', locale)}
                </a>
              </div>
            </div>
            {
              // currently there is no version information to display
              /* <div className="subHeader">
              <div className="subscriptionInfoHeader">
                {msgs.get(
                  'description.title.deployableSubscription.version',
                  locale
                )}
              </div>
              <div className="value">{version}</div>
            </div> */
            }
          </div>
        </div>
        <div className="innerContent">
          <div className="placement">
            <div className="subHeader">
              <div className="subscriptionInfoHeader">
                {msgs.get('description.Modal.placement', locale)}
              </div>
            </div>
            <div className="subHeader">
              <div className="subscriptionInfoHeaderIndented">
                {msgs.get('description.Modal.label', locale)}
              </div>
              <div className="value">
                {' '}
                {labels.map(label => {
                  return (
                    <span
                      className="labelTag"
                      key={Math.random()}
                      title={label_hover}
                    >
                      {label}
                    </span>
                  )
                })}
              </div>
            </div>
            <div className="subHeader">
              <div className="subscriptionInfoHeaderIndented">
                {msgs.get('description.Modal.clusters', locale)}
              </div>
              <div className="value">
                {clusterNames &&
                  clusterNames.length > 0 &&
                  clusterNames
                    .map(cluster => {
                      return <span key={Math.random()}>{cluster}</span>
                    })
                    .reduce((prev, curr) => [prev, ', ', curr])}
              </div>
            </div>
            <div className="subHeader">
              <div className="subscriptionInfoHeaderIndented" />
              <div className="value">
                <a href={getSearchUrl(subName)}>
                  {msgs.get('description.Modal.viewAllClusters', locale)}
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
)

const SubscriptionModal = withLocale(
  ({
    displayModal,
    closeModal,
    header,
    label,
    subscriptionModalSubscriptionInfo,
    bulkSubscriptionList,
    locale
  }) => {
    return (
      <div id="SubscriptionModal">
        <Modal
          className="modalAddRepo"
          onRequestClose={() => closeModal()}
          onRequestSubmit={() => closeModal()}
          open={displayModal}
          modalHeading={header}
          modalLabel={label}
          primaryButtonText={msgs.get('actions.close', locale)}
        >
          <div className="channelGridContainer">
            <SubscriptionInfo
              subscriptionModalSubscriptionInfo={
                subscriptionModalSubscriptionInfo
              }
              bulkSubscriptionList={bulkSubscriptionList}
            />
          </div>
        </Modal>
      </div>
    )
  }
)

export default withLocale(SubscriptionModal)
