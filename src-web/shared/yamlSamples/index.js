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
import channelNamespaceSample from 'js-yaml-loader!./channelNamespaceSample.yml'

export const getChannelNamespaceSample = () => {
  const mapObj = {
    "createChannel-apiVersion": "# " + msgs.get('description.createChannel.apiVersion'),
    "createChannel-kind": "# " + msgs.get('description.createChannel.kind'),
    "createChannel-metadata-name": "# " + msgs.get('description.createChannel.metadata.name'),
    "createChannel-metadata-namespace": "# " + msgs.get('description.createChannel.metadata.namespace'),
    "createChannel-spec-gates-annotations": "# " + msgs.get('description.createChannel.spec.gates.annotations'),
    "createChannel-spec-sourceNamespaces": "# " + msgs.get('description.createChannel.spec.sourceNamespaces'),
    "createChannel-spec-type": "# " + msgs.get('description.createChannel.spec.type'),
    "null": "",
    "_": " "
  };

  var sample = YAML.stringify(channelNamespaceSample).replace(/createChannel-apiVersion|createChannel-kind|createChannel-metadata-name|createChannel-metadata-namespace|createChannel-spec-gates-annotations|createChannel-spec-sourceNamespaces|createChannel-spec-type|null|_/gi, function (matched) {
    return mapObj[matched]
  })

  return sample
}
