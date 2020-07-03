/*******************************************************************************
 * Licensed Materials - Property of IBM
 * Copyright (c) 2020 Red Hat, Inc.
 * US Government Users Restricted Rights - Use, duplication or disclosure
 * restricted by GSA ADP Schedule Contract with IBM Corp.
 *******************************************************************************/

import React from '../../../../../node_modules/react'
import msgs from '../../../../../nls/platform.properties'
import { withLocale } from '../../../../providers/LocaleProvider'
import { showCreate } from '../../../../../lib/client/access-helper'
import { RESOURCE_TYPES, DOC_LINKS } from '../../../../../lib/shared/constants'
import {
  getChannelSample,
  getSubscriptionSample,
  getPlacementRuleSample
} from '../../../../shared/yamlSamples/index'
import CreateResourceModal from '../../../modals/CreateResourceModal'
import { createResources } from '../../../../actions/common'

const handleCreateChannelResource = (dispatch, yaml) =>
  dispatch(createResources(RESOURCE_TYPES.HCM_CHANNELS, yaml))

const handleCreateSubscriptionResource = (dispatch, yaml) =>
  dispatch(createResources(RESOURCE_TYPES.HCM_SUBSCRIPTIONS, yaml))

const handleCreatePlacementRuleResource = (dispatch, yaml) =>
  dispatch(createResources(RESOURCE_TYPES.HCM_PLACEMENT_RULES, yaml))

// Create Resource for Subscription
const CreateSubscriptionModal = (fetchSubscriptions, locale) => {
  return (
    <CreateResourceModal
      key="createSubscription"
      headingTextKey="actions.add.subscription"
      resourceTypeName="button.create.subscription"
      onCreateResource={handleCreateSubscriptionResource}
      onSubmitFunction={fetchSubscriptions}
      resourceDescriptionKey="modal.createresource.subscription"
      helpLink={DOC_LINKS.SUBSCRIPTIONS}
      iconDescription={msgs.get(
        'actions.add.subscription.iconDescription',
        locale
      )}
      sampleContent={[getSubscriptionSample(locale)]}
    />
  )
}

// Create Resource for Subscription
const CreatePlacementRuleModal = (fetchPlacementRuleResource, locale) => {
  return (
    <CreateResourceModal
      key="createPlacementRule"
      headingTextKey="actions.add.placementRule"
      resourceTypeName="button.create.placementRule"
      onCreateResource={handleCreatePlacementRuleResource}
      onSubmitFunction={fetchPlacementRuleResource}
      resourceDescriptionKey="modal.createresource.placementrule"
      helpLink={DOC_LINKS.PLACEMENT_RULES}
      iconDescription={msgs.get(
        'actions.add.subscription.iconDescription',
        locale
      )}
      sampleContent={[getPlacementRuleSample(locale)]}
    />
  )
}

// Create Resource for Channel
const CreateChannelModal = (fetchChannels, locale) => {
  const channelTabs = {
    tab1: msgs.get('modal.title.namespace', locale),
    tab2: msgs.get('modal.title.helmRepo', locale),
    tab3: msgs.get('modal.title.objectBucket', locale),
    tab4: msgs.get('modal.title.gitRepo', locale)
  }

  return (
    <CreateResourceModal
      key="createChannel"
      headingTextKey="actions.add.channel"
      resourceTypeName="button.create.channel"
      onCreateResource={handleCreateChannelResource}
      onSubmitFunction={fetchChannels}
      resourceDescriptionKey="modal.createresource.channel"
      helpLink={DOC_LINKS.CHANNELS}
      iconDescription={msgs.get('actions.add.channel.iconDescription', locale)}
      sampleTabs={channelTabs}
      sampleContent={[
        getChannelSample('Namespace', locale),
        getChannelSample('HelmRepo', locale),
        getChannelSample('ObjectBucket', locale),
        getChannelSample('GitRepo', locale)
      ]}
    />
  )
}

const CreateResourceActions = withLocale(
  ({
    fetchChannels,
    fetchSubscriptions,
    fetchPlacementRules,
    userRole,
    locale
  }) => {
    const modalChannel = React.cloneElement(
      CreateChannelModal(fetchChannels, locale),
      {
        resourceType: RESOURCE_TYPES.HCM_CHANNELS
      }
    )
    const modalSubscription = React.cloneElement(
      CreateSubscriptionModal(fetchSubscriptions, locale),
      {
        resourceType: RESOURCE_TYPES.HCM_SUBSCRIPTIONS
      }
    )
    const modalPlacementRule = React.cloneElement(
      CreatePlacementRuleModal(fetchPlacementRules, locale),
      {
        resourceType: RESOURCE_TYPES.HCM_PLACEMENT_RULES
      }
    )
    return (
      <div className="resource-cards-create-container">
        {showCreate(userRole) && (
          <React.Fragment>
            <div className="AddResourceButton">{[modalSubscription]}</div>
            <div className="AddResourceButton">{[modalPlacementRule]}</div>
            <div className="AddResourceButton">{[modalChannel]}</div>
          </React.Fragment>
        )}
      </div>
    )
  }
)

export default withLocale(CreateResourceActions)
