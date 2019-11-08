/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2019. All Rights Reserved.
 *
 * Note to U.S. Government Users Restricted Rights:
 * Use, duplication or disclosure restricted by GSA ADP Schedule
 * Contract with IBM Corp.
 *******************************************************************************/
'use strict'

import msgs from '../../../../../nls/platform.properties'
import _ from 'lodash'

export const getNodeDescription = (node, locale) => {
  let description =''
  const {type, namespace, layout={}} = node
  switch (type) {
  case 'internet':
    description = namespace
    break

  case 'cluster':
    description = _.get(node, 'specs.cluster.clusterip', '') //consoleURL
    break

  case 'application':
  case 'subscription':
    description = namespace
    break

  case 'policy': {
    const annotations = _.get(node, 'specs.policy.metadata.annotations', {})
    description = annotations['policy.mcm.ibm.com/standards']||''
    break
  }

  case 'deployable':
    description = _.get(node, 'deployable.chartName.$v')
    break

  case 'dependency':
    description = _.get(node, 'dependency.kind.$v')
    break

  default:
    if (layout.hasPods) {
      const npods = layout.pods.length
      description = msgs.get('topology.controller.pods', [type, npods], locale)
    }
    break
  }

  // hubs are drawn bigger
  if (layout.isMajorHub) {
    layout.scale = 1.6
  } else if (layout.isMinorHub) {
    layout.scale = 1.4
  }
  return description
}
