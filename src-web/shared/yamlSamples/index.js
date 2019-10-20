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
  var sample = YAML.stringify(channelSample).replace(
    /createChannel-apiVersion|createChannel-kind|createChannel-metadata-name|createChannel-metadata-namespace|createChannel-spec-gates-annotations|createChannel-spec-sourceNamespaces|createChannel-spec-type|null|_/gi,
    matched => {
      return mapObj[matched]
    }
  )

  return sample
}

export const getSubscriptionSample = (subsciptionSample, locale) => {
  const mapObj = {
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
  var sample = YAML.stringify(subsciptionSample).replace(
    /createSubscription-apiVersion|createSubscription-kind|createSubscription-metadata-name|createSubscription-metadata-namespace|createSubscription-spec-channel|createSubscription-spec-placement-placementRef-name|createSubscription-spec-placement-placementRef-kind|null|_/gi,
    matched => {
      return mapObj[matched]
    }
  )

  return sample
}

export const getApplicationSample = (applicationSample, locale) => {
  const mapObj = {
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
    null: '',
    _: ' '
  }
  var sample = YAML.stringify(applicationSample).replace(
    /createApplication-apiVersion|createApplication-kind|createApplication-metadata-name|createApplication-metadata-namespace|createApplication-spec-componentKinds|createApplication-spec-selector-matchExpressions|null|_/gi,
    matched => {
      return mapObj[matched]
    }
  )

  return sample
}
