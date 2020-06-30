/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2019. All Rights Reserved.
 * Copyright (c) 2020 Red Hat, Inc.
 *
 * US Government Users Restricted Rights - Use, duplication or disclosure
 * restricted by GSA ADP Schedule Contract with IBM Corp.
 *******************************************************************************/
import msgs from '../../../nls/platform.properties'

export const applicationSample =
  'apiVersion: v1______________________createApplication-namespace-apiVersion\nkind: Namespace\nmetadata:\n  name: ____________________________createApplication-namespace-metadata-name\n---\napiVersion: app.k8s.io/v1beta1\nkind: Application\nmetadata:\n  name: __________________________createApplication-metadata-name\n  namespace: _____________________createApplication-metadata-namespace\nspec:\n  componentKinds:\n  - group: apps.open-cluster-management.io\n    kind: Subscription\n  descriptor: {}\n  selector:\n    matchExpressions:\n      - key: _____________________createApplication-spec-selector-matchExpressions-key\n        operator: In\n        values: __________________createApplication-spec-selector-matchExpressions-key-values'
export const channelNamespaceSample =
  'apiVersion: v1______________________createChannel-namespace-apiVersion\nkind: Namespace\nmetadata:\n  name: ____________________________createChannel-namespace-metadata-name\n---\napiVersion: apps.open-cluster-management.io/v1\nkind: Channel\nmetadata:\n  name: ____________________________createChannel-metadata-name\n  namespace: _______________________createChannel-metadata-namespace\nspec:\n  gates:\n    annotations: ___________________createChannel-specNamespace-gates-annotations\n  pathname: foo ____________________createChannel-specNamespace-pathname\n  sourceNamespaces: ________________createChannel-specNamespace-sourceNamespaces\n  type: Namespace'
export const channelHelmRepoSample =
  'apiVersion: v1______________________createChannel-namespace-apiVersion\nkind: Namespace\nmetadata:\n  name: ____________________________createChannel-namespace-metadata-name\n---\napiVersion: apps.open-cluster-management.io/v1\nkind: Channel\nmetadata:\n  name: ____________________________createChannel-metadata-name\n  namespace: _______________________createChannel-metadata-namespace\nspec:\n  pathname: ________________________createChannel-specHelmRepo-pathname\n  configRef:\n    name: __________________________createChannel-specHelmRepo-configRef-name\n  type: HelmRepo\n---\napiVersion: v1______________________createChannel-configMap-apiVersion\nkind: ConfigMap\nmetadata:\n  name: ____________________________createChannel-configMap-metadata-name\n  namespace: _______________________createChannel-configMap-metadata-namespace'
export const channelObjectBucketSample =
  'apiVersion: v1______________________createChannel-namespace-apiVersion\nkind: Namespace\nmetadata:\n  name: ____________________________createChannel-namespace-metadata-name\n---\napiVersion: apps.open-cluster-management.io/v1\nkind: Channel\nmetadata:\n name: _____________________________createChannel-metadata-name\n namespace: ________________________createChannel-metadata-namespace\nspec:\n type: ObjectBucket\n pathname: _________________________createChannel-specObjectBucket-pathname\n secretRef:\n   name: ___________________________createChannel-specObjectBucket-secretRef-name\n gates:\n   annotations: ____________________createChannel-specObjectBucket-gate-annotations'
export const channelGitRepoSample =
  'apiVersion: v1______________________createChannel-namespace-apiVersion\nkind: Namespace\nmetadata:\n  name: ____________________________createChannel-metadata-name\n---\napiVersion: apps.open-cluster-management.io/v1\nkind: Channel\nmetadata:\n  name: ____________________________createChannel-metadata-name\n  namespace: _______________________createChannel-metadata-namespace\nspec:\n  type: GitHub\n  pathname: ________________________createChannel-specGitRepo-pathname'
export const subscriptionSample =
  'apiVersion: v1______________________createSubscription-namespace-resource\nkind: Namespace\nmetadata:\n  name: ____________________________createSubscription-name-resource\n---\napiVersion: apps.open-cluster-management.io/v1\nkind: Subscription\nmetadata:\n  name: ____________________________createSubscription-metadata-name\n  namespace: _______________________createSubscription-metadata-namespace\nspec:\n  channel: _________________________createSubscription-spec-channel\n  placement: \n    placementRef: \n      kind: PlacementRule\n      name: ________________________createSubscription-spec-placement-placementRef-name\ntimeWindow: \n  type: \'"active"\'\n  location: \'"America/Toronto"\'\n  weekdays: ________________________createSubscription-timeWindow-weekdays\n  hours: ___________________________createSubscription-timeWindow-hours'
export const placementRuleSample =
  'apiVersion: apps.open-cluster-management.io/v1\nkind: PlacementRule\nmetadata:\n  name: ____________________________createPlacementRule-metadata-name\n  namespace: _______________________createPlacementRule-metadata-namespace\nspec:\n  clusterSelector:\n    matchLabels: ___________________createPlacementRule-spec-clusterSelector-matchLabels\n  clusterReplicas: _________________createPlacementRule-spec-clusterReplicas'

export const getChannelSampleByType = channelSampleType => {
  let channelSample = ''
  if (channelSampleType === 'Namespace') {
    channelSample = channelNamespaceSample
  } else if (channelSampleType === 'HelmRepo') {
    channelSample = channelHelmRepoSample
  } else if (channelSampleType === 'ObjectBucket') {
    channelSample = channelObjectBucketSample
  } else if (channelSampleType === 'GitRepo') {
    channelSample = channelGitRepoSample
  }

  return channelSample
}

export const getChannelSample = (channelSampleType, locale) => {
  const channelSample = getChannelSampleByType(channelSampleType)
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

  const sample = channelSample.replace(
    /createChannel-namespace-apiVersion|createChannel-namespace-metadata-name|createChannel-metadata-namespace|createChannel-metadata-name|createChannel-specNamespace-gates-annotations|createChannel-specNamespace-pathname|createChannel-specNamespace-sourceNamespaces|createChannel-specHelmRepo-pathname|createChannel-specHelmRepo-configRef-name|createChannel-specHelmRepo-type|createChannel-configMap-apiVersion|createChannel-configMap-metadata-namespace|createChannel-configMap-metadata-name|createChannel-specObjectBucket-pathname|createChannel-specObjectBucket-secretRef-name|createChannel-specObjectBucket-gate-annotations|createChannel-specGitRepo-pathname|null|_/gi,
    matched => {
      return mapObj[matched]
    }
  )

  return sample
}

export const getSubscriptionSample = locale => {
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
    'createSubscription-timeWindow-weekdays':
      '# ' +
      msgs.get('description.createSubscription.timeWindow.weekdays', locale),
    'createSubscription-timeWindow-hours':
      '# ' +
      msgs.get('description.createSubscription.timeWindow.hours', locale),
    null: '',
    _: ' ',
    '\'': ''
  }

  const sample = subscriptionSample.replace(
    /createSubscription-namespace-resource|createSubscription-name-resource|createSubscription-apiVersion|createSubscription-kind|createSubscription-metadata-namespace|createSubscription-metadata-name|createSubscription-spec-channel|createSubscription-spec-placement-placementRef-name|createSubscription-spec-placement-placementRef-kind|createSubscription-timeWindow-weekdays|createSubscription-timeWindow-hours|null|_|'/gi,
    matched => {
      return mapObj[matched]
    }
  )

  return sample
}

export const getApplicationSample = locale => {
  const mapObj = {
    'createApplication-namespace-apiVersion':
      '# ' +
      msgs.get('description.createApplication.namespace.apiVersion', locale),
    'createApplication-namespace-metadata-name':
      '# ' +
      msgs.get('description.createApplication.namespace.metadata.name', locale),
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

  const sample = applicationSample.replace(
    /createApplication-namespace-apiVersion|createApplication-namespace-metadata-name|createApplication-metadata-namespace|createApplication-metadata-name|createApplication-spec-selector-matchExpressions-key-values|createApplication-spec-selector-matchExpressions-key|null|_/gi,
    matched => {
      return mapObj[matched]
    }
  )

  return sample
}

export const getPlacementRuleSample = locale => {
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
    'createPlacementRule-spec-clusterSelector-matchLabels':
      '# ' +
      msgs.get(
        'description.createPlacementRule.spec.clusterSelector.matchLabels',
        locale
      ),
    'createPlacementRule-spec-clusterReplicas':
      '# ' +
      msgs.get('description.createPlacementRule.spec.clusterReplicas', locale),
    null: '',
    _: ' '
  }
  const sample = placementRuleSample.replace(
    /createPlacementRule-apiVersion|createPlacementRule-kind|createPlacementRule-metadata-namespace|createPlacementRule-metadata-name|createPlacementRule-spec-clusterSelector-matchLabels|createPlacementRule-spec-clusterReplicas|null|_/gi,
    matched => {
      return mapObj[matched]
    }
  )

  return sample
}
