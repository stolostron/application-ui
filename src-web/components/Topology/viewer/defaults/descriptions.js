/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2019. All Rights Reserved.
 * Copyright (c) 2020 Red Hat, Inc.
 *
 * Note to U.S. Government Users Restricted Rights:
 * Use, duplication or disclosure restricted by GSA ADP Schedule
 * Contract with IBM Corp.
 *******************************************************************************/
'use strict'

import { getWrappedNodeLabel } from '../../utils/diagram-helpers'

export const getNodeDescription = node => {
  const { layout = {} } = node

  const description = getWrappedNodeLabel((node && node.name) || '', 12, 2)

  // hubs are drawn bigger
  if (layout.isMajorHub) {
    layout.scale = 1.6
  } else if (layout.isMinorHub) {
    layout.scale = 1.4
  }

  return description
}
