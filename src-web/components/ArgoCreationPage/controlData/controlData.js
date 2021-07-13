/** *****************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2019. All Rights Reserved.
 *
 * Note to U.S. Government Users Restricted Rights:
 * Use, duplication or disclosure restricted by GSA ADP Schedule
 * Contract with IBM Corp.
 ****************************************************************************** */
// Copyright (c) 2020 Red Hat, Inc.
// Copyright Contributors to the Open Cluster Management project
'use strict'

export const controlData = [
  {
    title: 'argo.create.title',
    cancelLabel: 'common.cancel',
    nextLabel: 'common.next',
    backLabel: 'common.back',
    sections: [
      {
        type: 'Section',
        title: 'argo.basic.info',
        inputs: [
          {
            id: 'appSetName',
            type: 'Text',
            label: 'argo.create.name',
            placeholder: 'argo.create.placeholder',
            isRequired: true
          },
          {
            id: 'clusterName',
            type: 'Text',
            label: 'argo.cluster.name',
            placeholder: 'argo.cluster.placeholder',
            isRequired: true
          }
        ]
      }
    ]
  }
]
