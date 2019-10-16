/*******************************************************************************
 * Licensed Materials - Property of IBM
 * 5737-E67
 * (c) Copyright IBM Corporation 2019. All Rights Reserved.
 *
 * US Government Users Restricted Rights - Use, duplication or disclosure
 * restricted by GSA ADP Schedule Contract with IBM Corp.
 *******************************************************************************/

import msgs from '../../../nls/platform.properties'
import channelNamespaceSample from 'js-yaml-loader!./channelNamespaceSample.yml'

// for (var prop in yamlObj) {
//   if (Object.prototype.hasOwnProperty.call(yamlObj, prop)) {
//     console.log(yamlObj[prop])
//   }
// }
// Object.keys(channelNamespaceSample)
// {YAML.stringify(samples.createChannelSample).split("null").join("")}

export const getChannelNamespaceSample = () => {
  const sample =
    "apiVersion: " + channelNamespaceSample.apiVersion + "\t# " + msgs.get('description.createChannel.apiVersion') + "\n" +
    "kind: " + channelNamespaceSample.kind + "\t\t\t\t\t\t\t\t\t\t\t# " + msgs.get('description.createChannel.kind') + "\n" +
    "metadata: " + "\n" +
    "\tname: " + channelNamespaceSample.metadata.name + "\t\t\t\t\t\t\t\t\t\t\t\t# " + msgs.get('description.createChannel.metadata.name') + "\n" +
    "\tnamespace: " + channelNamespaceSample.metadata.namespace + "\t\t\t\t\t\t\t\t# " + msgs.get('description.createChannel.metadata.namespace') + "\n" +
    "spec: " + "\n" +
    "\tsourceNamespaces: " + "\t\t\t\t\t\t\t# " + msgs.get('description.createChannel.spec.sourceNamespaces') + "\n" +
    "\t- default" + "\n" +
    "\ttype: " + channelNamespaceSample.spec.type + "\t\t\t\t\t\t\t\t\t# " + msgs.get('description.createChannel.spec.type') + "\n" +
    "\tpathname: " + channelNamespaceSample.spec.pathname + "\t\t\t\t\t\t\t\t\t# " + msgs.get('description.createChannel.spec.pathname') + "\n" +
    "\tgates: " + "\t\t\t\t\t\t\t\t\t\t\t\t\t# " + msgs.get('description.createChannel.spec.gates') + "\n" +
    "\t\tannotations: " + "\t\t\t\t\t\t\t\t\t# " + msgs.get('description.createChannel.spec.gates.annotations') + "\n" +
    "\t\t\tdev-ready: " + channelNamespaceSample.spec.gates.annotations["dev-ready"]

  return sample
}