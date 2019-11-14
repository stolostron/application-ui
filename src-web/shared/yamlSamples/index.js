/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2019. All Rights Reserved.
 *
 * US Government Users Restricted Rights - Use, duplication or disclosure
 * restricted by GSA ADP Schedule Contract with IBM Corp.
 *******************************************************************************/

import YAML from 'yaml'
import msgs from '../../../nls/platform.properties'

export const getChannelSample = (channelSample, locale) => {
  const mapObj = {
    'createChannel-namespace-apiVersion':
      '# ' + msgs.get('description.createChannel.namespace.apiVersion', locale),
    'createChannel-namespace-metadata-name':
      '# ' +
      msgs.get('description.createChannel.namespace.metadata.name', locale),
    'createChannel-metadata-name':
      '# ' + msgs.get('description.createChannel.metadata.name', locale),
    'createChannel-metadata-namespace':
      '# ' + msgs.get('description.createChannel.metadata.namespace', locale),
    'createChannel-specNamespace-gates-annotations':
      '# ' +
      msgs.get(
        'description.createChannel.specNamespace.gates.annotations',
        locale
      ),
    'createChannel-specNamespace-pathname':
      '# ' +
      msgs.get('description.createChannel.specNamespace.pathname', locale),
    'createChannel-specNamespace-sourceNamespaces':
      '# ' +
      msgs.get(
        'description.createChannel.specNamespace.sourceNamespaces',
        locale
      ),
    'createChannel-specHelmRepo-pathname':
      '# ' +
      msgs.get('description.createChannel.specHelmRepo.pathname', locale),
    'createChannel-specHelmRepo-configRef-name':
      '# ' +
      msgs.get('description.createChannel.specHelmRepo.configRef.name', locale),
    'createChannel-specHelmRepo-type':
      '# ' + msgs.get('description.createChannel.specHelmRepo.type', locale),
    'createChannel-configMap-apiVersion':
      '# ' + msgs.get('description.createChannel.configMap.apiVersion', locale),
    'createChannel-configMap-metadata-name':
      '# ' +
      msgs.get('description.createChannel.configMap.metadata.name', locale),
    'createChannel-configMap-metadata-namespace':
      '# ' +
      msgs.get(
        'description.createChannel.configMap.metadata.namespace',
        locale
      ),
    'createChannel-specObjectBucket-pathname':
      '# ' +
      msgs.get('description.createChannel.specObjectBucket.pathname', locale),
    'createChannel-specObjectBucket-secretRef-name':
      '# ' +
      msgs.get(
        'description.createChannel.specObjectBucket.secretRef.name',
        locale
      ),
    'createChannel-specObjectBucket-gate-annotations':
      '# ' +
      msgs.get(
        'description.createChannel.specObjectBucket.gates.annotations',
        locale
      ),
    'createChannel-specGitRepo-pathname':
      '# ' + msgs.get('description.createChannel.specGitRepo.pathname', locale),
    null: '',
    _: ' '
  }

  var sample = ''
  Object.keys(channelSample).map(key => {
    sample =
      sample +
      YAML.stringify(channelSample[key]).replace(
        /createChannel-namespace-apiVersion|createChannel-namespace-metadata-name|createChannel-metadata-namespace|createChannel-metadata-name|createChannel-specNamespace-gates-annotations|createChannel-specNamespace-pathname|createChannel-specNamespace-sourceNamespaces|createChannel-specHelmRepo-pathname|createChannel-specHelmRepo-configRef-name|createChannel-specHelmRepo-type|createChannel-configMap-apiVersion|createChannel-configMap-metadata-namespace|createChannel-configMap-metadata-name|createChannel-specObjectBucket-pathname|createChannel-specObjectBucket-secretRef-name|createChannel-specObjectBucket-gate-annotations|createChannel-specGitRepo-pathname|null|_/gi,
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
    'createApplication-metadata-name':
      '# ' + msgs.get('description.createApplication.metadata.name', locale),
    'createApplication-metadata-namespace':
      '# ' +
      msgs.get('description.createApplication.metadata.namespace', locale),
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

  var sample = YAML.stringify(applicationSample).replace(
    /createApplication-metadata-namespace|createApplication-metadata-name|createApplication-spec-selector-matchExpressions-key-values|createApplication-spec-selector-matchExpressions-key|null|_/gi,
    matched => {
      return mapObj[matched]
    }
  )

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
