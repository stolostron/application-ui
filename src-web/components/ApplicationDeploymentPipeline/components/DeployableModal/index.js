/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2017, 2019. All Rights Reserved.
 *
 * Note to U.S. Government Users Restricted Rights:
 * Use, duplication or disclosure restricted by GSA ADP Schedule
 * Contract with IBM Corp.
 *******************************************************************************/

import React from 'react'
import msgs from '../../../../../nls/platform.properties'
import { withLocale } from '../../../../providers/LocaleProvider'
import resources from '../../../../../lib/shared/resources'
import { RESOURCE_TYPES } from '../../../../../lib/shared/constants'
import { Modal } from 'carbon-components-react'
import R from 'ramda'

resources(() => {
  require('./style.scss')
})

const DeployableInfo = withLocale(
  ({
    deployableName = 'deployableName',
    conditions = 'passed testing',
    locale
  }) => {
    return (
      <div className="deployableInfoClass">
        <div className="subHeader">
          <div className="bold">
            {msgs.get('description.Modal.deployable', locale)}
          </div>
          {deployableName}
        </div>
        <div className="innerContent">
          <div className="conditions">
            <div className="bold">
              {msgs.get('description.Modal.deployableConditions', locale)}
            </div>
            {conditions}
          </div>
        </div>
      </div>
    )
  }
)

const ChannelInfo = withLocale(
  ({
    chanName = 'chanName',
    conditions = ['condition1', 'condition2', 'condition3'],
    locale
  }) => {
    return (
      <div className="channelInfoClass">
        <div className="subHeader">
          <div className="bold">
            {msgs.get('description.Modal.channel', locale)}
          </div>
          {chanName}
        </div>
        <div className="innerContent">
          <div className="conditions">
            <div className="bold">
              {msgs.get('description.Modal.conditions', locale)}
            </div>
            {conditions.map(condition => {
              return <div key={Math.random()}>{condition}</div>
            })}
          </div>
        </div>
      </div>
    )
  }
)

const SubscriptionInfo = withLocale(
  ({
    subName = 'subName',
    clusters = ['cluster1', 'cluster2', 'cluster3'],
    labels = ['label1', 'label2', 'label3'],
    versions = 'version2',
    rollingUpdate = '50%',
    modalSubscription,
    editSubscription,
    deployableModalSubscriptionInfo,
    locale
  }) => {
    // If there is currently noDeployableSubscription then we want to add rather
    // than edit
    const noDeployableSubscription = R.isEmpty(deployableModalSubscriptionInfo)
    return (
      <div className="subscriptionInfoClass">
        <div className="subHeader">
          <div className="bold">
            {msgs.get('description.Modal.SubscriptionInfo', locale)}
          </div>
          {subName}
        </div>
        <div className="innerContent">
          <div className="placement">
            <div className="bold">
              {msgs.get('description.Modal.placement', locale)}
            </div>
            <div className="bold">
              {msgs.get('description.Modal.clusters', locale)}
            </div>
            {clusters}
            <div className="bold">
              {msgs.get('description.Modal.label', locale)}
            </div>
            {labels}
          </div>
          <div className="versions">
            <div className="bold">
              {msgs.get('description.Modal.versions', locale)}
            </div>
            {versions}
          </div>
          <div className="update">
            <div className="bold">
              {msgs.get('description.Modal.update', locale)}
            </div>
            {rollingUpdate}
          </div>
          {noDeployableSubscription ? (
            <div className="addSubscriptionButton">{[modalSubscription]}</div>
          ) : (
            <button
              className="editSubscriptionButton"
              onClick={() =>
                editSubscription(
                  RESOURCE_TYPES.HCM_SUBSCRIPTIONS,
                  deployableModalSubscriptionInfo
                )
              }
            />
          )}
        </div>
      </div>
    )
  }
)

const DeploymentProgress = withLocale(() => {
  return <div>Deployment Progress</div>
})

const TargetClusters = withLocale(() => {
  return <div>Target Clusters</div>
})

const DeployableModal = withLocale(
  ({
    displayModal,
    closeModal,
    header,
    label,
    modalSubscription,
    editSubscription,
    deployableModalSubscriptionInfo,
    locale
  }) => {
    return (
      <div id="DeployableModal">
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
              subName={label}
              modalSubscription={modalSubscription}
              editSubscription={editSubscription}
              deployableModalSubscriptionInfo={deployableModalSubscriptionInfo}
            />
            <ChannelInfo />
            <DeployableInfo />
            <DeploymentProgress />
            <TargetClusters />
          </div>
        </Modal>
      </div>
    )
  }
)

export default withLocale(DeployableModal)
