/*******************************************************************************
 * Licensed Materials - Property of IBM
 * 5737-E67
 * (c) Copyright IBM Corporation 2019. All Rights Reserved.
 *
 * US Government Users Restricted Rights - Use, duplication or disclosure
 * restricted by GSA ADP Schedule Contract with IBM Corp.
 *******************************************************************************/

import YAML from 'yaml'
import msgs from '../../../nls/platform.properties'

export const getChannelSample = (channelSample, locale) => {
  const mapObj = {
    'createChannel-namespace-resource':
      '# ' + msgs.get('description.createChannel.namespace.resource', locale),
    'createChannel-name-resource':
      '# ' + msgs.get('description.createChannel.name.resource', locale),
    'createChannel-apiVersion':
      '# ' + msgs.get('description.createChannel.apiVersion', locale),
    'createChannel-kind':
      '# ' + msgs.get('description.createChannel.kind', locale),
    'createChannel-metadata-name':
      '# ' + msgs.get('description.createChannel.metadata.name', locale),
    'createChannel-metadata-namespace':
      '# ' + msgs.get('description.createChannel.metadata.namespace', locale),
    'createChannel-spec-gates-annotations':
      '# ' +
      msgs.get('description.createChannel.spec.gates.annotations', locale),
    'createChannel-spec-sourceNamespaces':
      '# ' +
      msgs.get('description.createChannel.spec.sourceNamespaces', locale),
    'createChannel-spec-type':
      '# ' + msgs.get('description.createChannel.spec.type', locale),
    null: '',
    _: ' '
  }

  var sample = ''
  Object.keys(channelSample).map(key => {
    sample =
      sample +
      YAML.stringify(channelSample[key]).replace(
        /createChannel-namespace-resource|createChannel-name-resource|createChannel-apiVersion|createChannel-kind|createChannel-metadata-namespace|createChannel-metadata-name|createChannel-spec-gates-annotations|createChannel-spec-sourceNamespaces|createChannel-spec-type|null|_/gi,
        matched => {
          return mapObj[matched]
        }
      )
    if (key < Object.keys(channelSample).length - 1) {
      sample = sample + '---\n'
    }
  })

  return sample
}

export const getSubscriptionSample = (subscriptionSample, locale) => {
  const mapObj = {
    'createSubscription-namespace-resource':
      '# ' +
      msgs.get('description.createSubscription.namespace.resource', locale),
    'createSubscription-name-resource':
      '# ' + msgs.get('description.createSubscription.name.resource', locale),
    'createSubscription-apiVersion':
      '# ' + msgs.get('description.createSubscription.apiVersion', locale),
    'createSubscription-kind':
      '# ' + msgs.get('description.createSubscription.kind', locale),
    'createSubscription-metadata-name':
      '# ' + msgs.get('description.createSubscription.metadata.name', locale),
    'createSubscription-metadata-namespace':
      '# ' +
      msgs.get('description.createSubscription.metadata.namespace', locale),
    'createSubscription-spec-channel':
      '# ' + msgs.get('description.createSubscription.spec.channel', locale),
    'createSubscription-spec-placement-placementRef-name':
      '# ' +
      msgs.get(
        'description.createSubscription.spec.placement.placementRef.name',
        locale
      ),
    'createSubscription-spec-placement-placementRef-kind':
      '# ' +
      msgs.get(
        'description.createSubscription.spec.placement.placementRef.kind',
        locale
      ),
    null: '',
    _: ' '
  }

  var sample = ''
  Object.keys(subscriptionSample).map(key => {
    sample =
      sample +
      YAML.stringify(subscriptionSample[key]).replace(
        /createSubscription-namespace-resource|createSubscription-name-resource|createSubscription-apiVersion|createSubscription-kind|createSubscription-metadata-namespace|createSubscription-metadata-name|createSubscription-spec-channel|createSubscription-spec-placement-placementRef-name|createSubscription-spec-placement-placementRef-kind|null|_/gi,
        matched => {
          return mapObj[matched]
        }
      )
    if (key < Object.keys(subscriptionSample).length - 1) {
      sample = sample + '---\n'
    }
  })

  return sample
}

export const getApplicationSample = (applicationSample, locale) => {
  const mapObj = {
    'createApplication-namespace-resource':
      '# ' +
      msgs.get('description.createApplication.namespace.resource', locale),
    'createApplication-name-resource':
      '# ' + msgs.get('description.createApplication.name.resource', locale),
    'createApplication-apiVersion':
      '# ' + msgs.get('description.createApplication.apiVersion', locale),
    'createApplication-kind':
      '# ' + msgs.get('description.createApplication.kind', locale),
    'createApplication-metadata-name':
      '# ' + msgs.get('description.createApplication.metadata.name', locale),
    'createApplication-metadata-namespace':
      '# ' +
      msgs.get('description.createApplication.metadata.namespace', locale),
    'createApplication-spec-componentKinds':
      '# ' +
      msgs.get('description.createApplication.spec.componentKinds', locale),
    'createApplication-spec-selector-matchExpressions':
      '# ' +
      msgs.get(
        'description.createApplication.spec.selector.matchExpressions',
        locale
      ),
    'createApplication-spec-selector-matchExpressions-key':
      '# ' +
      msgs.get(
        'description.createApplication.spec.selector.matchExpressions.key',
        locale
      ),
    'createApplication-spec-selector-matchExpressions-key-values':
      '# ' +
      msgs.get(
        'description.createApplication.spec.selector.matchExpressions.key.values',
        locale
      ),
    null: '',
    _: ' '
  }

  var sample = ''
  Object.keys(applicationSample).map(key => {
    sample =
      sample +
      YAML.stringify(applicationSample[key]).replace(
        /createApplication-namespace-resource|createApplication-name-resource|createApplication-apiVersion|createApplication-kind|createApplication-metadata-namespace|createApplication-metadata-name|createApplication-spec-componentKinds|createApplication-spec-selector-matchExpressions-key-values|createApplication-spec-selector-matchExpressions-key|createApplication-spec-selector-matchExpressions|null|_/gi,
        matched => {
          return mapObj[matched]
        }
      )
    if (key < Object.keys(applicationSample).length - 1) {
      sample = sample + '---\n'
    }
  })

  return sample
}

export const getPlacementRuleSample = (placementRuleSample, locale) => {
  const mapObj = {
    'createPlacementRule-apiVersion':
      '# ' + msgs.get('description.createPlacementRule.apiVersion', locale),
    'createPlacementRule-kind':
      '# ' + msgs.get('description.createPlacementRule.kind', locale),
    'createPlacementRule-metadata-name':
      '# ' + msgs.get('description.createPlacementRule.metadata.name', locale),
    'createPlacementRule-metadata-namespace':
      '# ' +
      msgs.get('description.createPlacementRule.metadata.namespace', locale),
    'createPlacementRule-spec-clusterLabels-matchLabels':
      '# ' +
      msgs.get(
        'description.createPlacementRule.spec.clusterLabels.matchLabels',
        locale
      ),
    'createPlacementRule-spec-clusterReplicas':
      '# ' +
      msgs.get('description.createPlacementRule.spec.clusterReplicas', locale),
    null: '',
    _: ' '
  }

  var sample = YAML.stringify(placementRuleSample).replace(
    /createPlacementRule-apiVersion|createPlacementRule-kind|createPlacementRule-metadata-namespace|createPlacementRule-metadata-name|createPlacementRule-spec-clusterLabels-matchLabels|createPlacementRule-spec-clusterReplicas|null|_/gi,
    matched => {
      return mapObj[matched]
    }
  )

  return sample
}
