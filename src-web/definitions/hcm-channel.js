/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2018, 2019. All Rights Reserved.
 *
 * US Government Users Restricted Rights - Use, duplication or disclosure
 * restricted by GSA ADP Schedule Contract with IBM Corp.
 *******************************************************************************/
import { validator } from './validators/hcm-channel-validator'

export default {
  defaultSortField: 'name',
  primaryKey: 'name',
  secondaryKey: 'namespace',
  validator,
  tableKeys: [
    {
      msgKey: 'table.header.name',
      resourceKey: 'name',
      //transformFunction: createApplicationLink
    },
    {
      msgKey: 'table.header.namespace',
      resourceKey: 'namespace'
    }
  ]
}
