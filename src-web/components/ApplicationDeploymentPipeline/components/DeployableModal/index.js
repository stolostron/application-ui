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
        {msgs.get('description.Modal.SubscriptionInfo', locale)}
        {subName}
        <div className="innerContent">
          <div className="placement">
            {msgs.get('description.Modal.placement', locale)}
            {msgs.get('description.Modal.clusters', locale)}
            {clusters}
            {msgs.get('description.Modal.label', locale)}
            {labels}
          </div>
          <div className="versions">
            {msgs.get('description.Modal.versions', locale)}
            {versions}
          </div>
          <div className="update">
            {msgs.get('description.Modal.update', locale)}
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
          open={displayModal}
          modalHeading={header}
          modalLabel={label}
          primaryButtonText={'TODO button'}
          secondaryButtonText={msgs.get('actions.close', locale)}
        >
          <div className="channelGridContainer">
            <SubscriptionInfo
              subName={label}
              modalSubscription={modalSubscription}
              editSubscription={editSubscription}
              deployableModalSubscriptionInfo={deployableModalSubscriptionInfo}
            />
          </div>
        </Modal>
      </div>
    )
  }
)

export default withLocale(DeployableModal)
