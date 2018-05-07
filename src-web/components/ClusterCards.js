/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2018. All Rights Reserved.
 *
 * Note to U.S. Government Users Restricted Rights:
 * Use, duplication or disclosure restricted by GSA ADP Schedule
 * Contract with IBM Corp.
 *******************************************************************************/
'use strict'

import React from 'react'
import {
  Card,
  CardContent,
  CardFooter,
  CardStatus,
} from 'carbon-components-react'
import msgs from '../../nls/platform.properties'

/* FIXME: Please fix disabled eslint rules when making changes to this file. */
/* eslint-disable react/prop-types */

const ClusterSummaryCard = ({ context, ClusterName, TotalDeployments, TotalNodes, Status, ...other }) => (
  <Card className="clusterCard" {...other} >
    <CardContent
      cardTitle={ClusterName}
      cardIcon="services"
      cardInfo={[
        `${msgs.get('table.header.nodes', context.locale)}: ${TotalNodes}`,
        `${msgs.get('table.header.deployments', context.locale)}: ${TotalDeployments}`,
      ]} >
    </CardContent>
    <CardFooter>
      <CardStatus
        status={ Status == 'healthy' ? CardStatus.appStatus.RUNNING : CardStatus.appStatus.NOT_RUNNING }
        runningText={`${msgs.get('table.header.status.healthy', context.locale)}`}
        notRunningText={`${msgs.get('table.header.status.unhealthy', context.locale)}`}
      />
    </CardFooter>
  </Card>
)

const ClusterDetailsCard = ({ context, details = [], title = '', status }) => (
  <Card className="detailsCard" >
    <CardContent
      cardTitle={title}
      cardIcon="services"
      cardInfo={details} />
    <CardFooter>
      {status && (<CardStatus
        status={status == 'healthy' ? CardStatus.appStatus.RUNNING : CardStatus.appStatus.NOT_RUNNING}
        runningText={`${msgs.get('table.header.status.healthy', context.locale)}`}
        notRunningText={`${msgs.get('table.header.status.unhealthy', context.locale)}`}
      />)}
    </CardFooter>
  </Card>
)

export { ClusterSummaryCard, ClusterDetailsCard }
