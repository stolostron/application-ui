/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2017, 2019. All Rights Reserved.
 * Copyright (c) 2020 Red Hat, Inc.
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
  getSearchUrlCluster,
  getClusterCountForSub
} from './utils.js'
import { getDataByKind } from '../PipelineGrid/utils'

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
  ({
    subscriptionModalSubscriptionInfo,
    bulkSubscriptionList,
    applications,
    locale
  }) => {
    const notEmptySubscription =
      !R.isEmpty(subscriptionModalSubscriptionInfo) &&
      subscriptionModalSubscriptionInfo &&
      subscriptionModalSubscriptionInfo.namespace

    let numClusters = 0
    let labels = []
    let deployableNames = ['N/A']
    let subName = ''
    let subNamespace = ''
    let label_hover = ''
    let owningClusterName = ''
    let channel = ''
    const status = (subscriptionModalSubscriptionInfo &&
      subscriptionModalSubscriptionInfo.applicationStatus) || [0, 0, 0, 0, 0]

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

        deployableNames = getCsvListClass(related).data
      }
      labels = R.split(
        ';',
        R.pathOr('N/A', ['label'], subscriptionModalSubscriptionInfo)
      )

      const labels_data = getLabelsListClass(labels)
      labels = labels_data.data
      label_hover = labels_data.hover

      subName = subscriptionModalSubscriptionInfo.name
      subNamespace = subscriptionModalSubscriptionInfo.namespace

      owningClusterName = R.pathOr(
        '',
        ['cluster'],
        subscriptionModalSubscriptionInfo
      )

      channel = R.pathOr('', ['channel'], subscriptionModalSubscriptionInfo)

      if (subscriptionModalSubscriptionInfo._uid != undefined) {
        numClusters = getClusterCountForSub(
          subscriptionModalSubscriptionInfo._uid,
          applications
        )
      }
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
                      return <span key={`${deployable}_D`}>{deployable}</span>
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
                      key={label}
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
              <div className="value">{numClusters}</div>
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
    applications,
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
              applications={applications}
            />
          </div>
        </Modal>
      </div>
    )
  }
)

export default withLocale(SubscriptionModal)
