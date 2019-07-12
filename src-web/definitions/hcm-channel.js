/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2018. All Rights Reserved.
 *
 * Note to U.S. Government Users Restricted Rights:
 * Use, duplication or disclosure restricted by GSA ADP Schedule
 * Contract with IBM Corp.
 *******************************************************************************/
import lodash from 'lodash';
import { validator } from './validators/hcm-channel-validator';

export default {
  defaultSortField: 'metadata.name',
  primaryKey: 'metadata.name',
  secondaryKey: 'cluster.metadata.name',
  validator,
};
