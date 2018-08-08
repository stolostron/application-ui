/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2017, 2018. All Rights Reserved.
 *
 * Note to U.S. Government Users Restricted Rights:
 * Use, duplication or disclosure restricted by GSA ADP Schedule
 * Contract with IBM Corp.
 *******************************************************************************/
'use strict'

import { getLabelsToString } from '../../lib/client/resource-helper'

export default {

  detailKeys: {
    title: 'application.details',
    headerRows: ['type', 'detail'],
    rows: [
      {
        cells: [
          {
            resourceKey: 'description.title.name',
            type: 'i18n'
          },
          {
            resourceKey: 'metadata.name'
          }
        ]
      },
      {
        cells: [
          {
            resourceKey: 'description.title.description',
            type: 'i18n'
          },
          {
            resourceKey: 'metadata.description'
          }
        ]
      },
      {
        cells: [
          {
            resourceKey: 'description.title.created',
            type: 'i18n'
          },
          {
            resourceKey: 'metadata.created'
          }
        ]
      },
      {
        cells: [
          {
            resourceKey: 'description.title.labels',
            type: 'i18n'
          },
          {
            transformFunction: getLabels
          }
        ]
      },
      {
        cells: [
          {
            resourceKey: 'description.title.region',
            type: 'i18n'
          },
          {
            resourceKey: 'metadata.region'
          }
        ]
      },
      {
        cells: [
          {
            resourceKey: 'description.title.owner',
            type: 'i18n'
          },
          {
            resourceKey: 'metadata.owner'
          }
        ]
      },
      {
        cells: [
          {
            resourceKey: 'description.title.size',
            type: 'i18n'
          },
          {
            resourceKey: 'metadata.size'
          }
        ]
      },
      {
        cells: [
          {
            resourceKey: 'description.title.status',
            type: 'i18n'
          },
          {
            resourceKey: 'metadata.status'
          }
        ]
      },
    ]
  },
}

export function getLabels(item) {
  return getLabelsToString(item.labels)
}

