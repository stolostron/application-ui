/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2018, 2019. All Rights Reserved.
 *
 * Note to U.S. Government Users Restricted Rights:
 * Use, duplication or disclosure restricted by GSA ADP Schedule
 * Contract with IBM Corp.
 *******************************************************************************/

import React from 'react'
//import { Loading } from 'carbon-components-react'
//import lodash from 'lodash'
import {
  getAgeForIncident,
  getTimeGMT,
} from '../../lib/client/resource-helper'


export default {
  defaultSortField: 'lastUpdated',
  uriKey: 'id',
  primaryKey: 'id',
  secondaryKey: 'id',
  tableKeys: [
    {
      msgKey: 'table.header.incidentName',
      resourceKey: 'id',
      //transformFunction: createIncidentLink,
    },
    {
      msgKey: 'table.header.incidentPriority',
      resourceKey: 'priority',
    },
    {
      msgKey: 'table.header.openfor',
      resourceKey: 'createdTime',
      transformFunction: getAgeForIncident,
    },
    {
      msgKey: 'table.header.lastChanged',
      resourceKey: 'lastChanged',
      transformFunction: getTimeGMT,
    },
    {
      msgKey: 'table.header.escalated',
      resourceKey: 'escalated',
    },
    // {
    //   msgKey: 'table.header.failedDeployments',
    //   resourceKey: 'incidentURL',
    // },
    {
      msgKey: 'table.header.events',
      resourceKey: 'eventSummary.events',
    },
    // {
    //   msgKey: 'table.header.labels',
    //   resourceKey: 'metadata.labels',
    //   transformFunction: getLabelsToString,
    // },
    // {
    //   msgKey: 'table.header.status',
    //   resourceKey: 'metadata.status',
    //   transformFunction: getStatus,
    // },
  ],
  tableActions: [],
  detailKeys: [],
};

export function createIncidentLink({ id = '' }, locale) {
  const link = `${config.cfcRouterUrl}/cemui/incidents/${id}/resolution`;
  if (id !== null && id !== '') {
    return (
      <a target="_blank" rel="noopener noreferrer" href={link}>
        {id}
      </a>
    );
  }

  return '-';
}