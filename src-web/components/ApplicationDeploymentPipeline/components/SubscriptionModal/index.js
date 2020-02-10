/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2017, 2019. All Rights Reserved.
 *
 * US Government Users Restricted Rights - Use, duplication or disclosure
 * restricted by GSA ADP Schedule Contract with IBM Corp.
 *******************************************************************************/

import React from 'react'
import msgs from '../../../../../nls/platform.properties'
import { withLocale } from '../../../../providers/LocaleProvider'
import resources from '../../../../../lib/shared/resources'
import { Modal, TooltipDefinition } from 'carbon-components-react'
import R from 'ramda'
import ProgressBar from '../ProgressBar/index'
import {
  getLabelsListClass,
  getCsvListClass,
  getSearchUrlDeployable,
  getSearchUrlCluster
} from './utils.js'
import {
  getResourcesStatusPerChannel,
  getDataByKind
} from '../PipelineGrid/utils'

resources(() => {
  require('./style.scss')
})

const LabelWithOptionalTooltip = text => {
  if (text && text.labelText && text.labelText.startsWith('+')) {
    return (
      <span className="bx--tag bx--tag--beta">
        <TooltipDefinition tooltipText={text.description}>
          {text.labelText}
        </TooltipDefinition>
      </span>
    )
  }
  return <span className="bx--tag bx--tag--beta">{text.labelText}</span>
}

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
      let subscriptionWithRelatedData = getDataByKind(
        bulkSubscriptionList,
        subscriptionModalSubscriptionInfo._uid
      )

      if (
        (!subscriptionWithRelatedData ||
          R.isEmpty(subscriptionWithRelatedData)) &&
        subscriptionModalSubscriptionInfo.name &&
        subscriptionModalSubscriptionInfo.namespace
      ) {
        subscriptionWithRelatedData = R.find(
          R.propEq('name', subscriptionModalSubscriptionInfo.name) &&
            R.propEq('namespace', subscriptionModalSubscriptionInfo.namespace)
        )(bulkSubscriptionList)
      }
      const foundBulkSubscription =
        subscriptionWithRelatedData && !R.isEmpty(subscriptionWithRelatedData)
      if (foundBulkSubscription) {
        const related = R.pathOr(
          [{}],
          ['related'],
          subscriptionWithRelatedData
        )

        //foundBulkSubscription is the main subscription created on the hub
        //need to get all subscriptions linked to this one; we want the subscriptions created on remote clusters only
        //they will be identified by the _hostingSubscription ( not null means this is a remote cluster subscription)
        let remoteSubscriptions = R.find(R.propEq('kind', 'subscription'))(
          related
        )
        if (remoteSubscriptions && remoteSubscriptions.items) {
          //filter out and return only remote cluster subscriptions
          const isRemoteSubscr = item => item._hostingSubscription
          remoteSubscriptions = R.filter(
            isRemoteSubscr,
            remoteSubscriptions.items
          )
        }

        if (remoteSubscriptions) {
          clusterNames = remoteSubscriptions.map(rsitem => {
            return ' ' + rsitem.cluster || ''
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
                <a href={getSearchUrlDeployable(subName)} target="_blank">
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
              <ul className="labels-list">
                {labels.map(label => {
                  return (
                    <LabelWithOptionalTooltip
                      key={Math.random()}
                      labelText={label}
                      description={label_hover}
                    />
                  )
                })}
              </ul>
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
                <a href={getSearchUrlCluster(subName)} target="_blank">
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
    //applications,
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
