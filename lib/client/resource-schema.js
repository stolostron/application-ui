/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2017. All Rights Reserved.
 *
 * Note to U.S. Government Users Restricted Rights:
 * Use, duplication or disclosure restricted by GSA ADP Schedule
 * Contract with IBM Corp.
 *******************************************************************************/
'use strict'

import { schema } from 'normalizr'
import lodash from 'lodash'

export const createResourcesSchema = attribute => {
  return new schema.Entity('items', {}, { idAttribute: value => `${lodash.get(value, attribute)}-${lodash.get(value, 'cluster')}` }) // to support multi cluster, use ${name}-${cluster} as unique id
}
