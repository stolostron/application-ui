/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2018. All Rights Reserved.
 *
 * Note to U.S. Government Users Restricted Rights:
 * Use, duplication or disclosure restricted by GSA ADP Schedule
 * Contract with IBM Corp.
 *******************************************************************************/

import React from 'react'

import { storiesOf } from '@storybook/react'
import DashboardCard from '../src-web/components/DashboardCard'


const criticalCardProps = {
  title: 'My Card - Critical',
  critical: 2,
  healthy: 10,
  warning: 3,
  table: [
    {
      link: 'www.ibm.coim',
      percentage: 25,
      resourceName: 'Cluster 1',
      status: 'critical',
    },
    {
      link: 'www.ibm.coim',
      percentage: 35,
      resourceName: 'Cluster 2',
      status: 'warning',
    },
    {
      link: 'www.ibm.com',
      percentage: 50,
      resourceName: 'Cluster 3',
      status: 'healthy',
    },
  ],
}


const warningCardProps = {
  title: 'My Card - Warning',
  critical: 0,
  healthy: 10,
  warning: 3,
  table: [
    {
      link: 'www.ibm.coim',
      percentage: 25,
      resourceName: 'Cluster 1',
      status: 'critical',
    },
    {
      link: 'www.ibm.coim',
      percentage: 35,
      resourceName: 'Cluster 2',
      status: 'warning',
    },
    {
      link: 'www.ibm.com',
      percentage: 50,
      resourceName: 'Cluster 3',
      status: 'healthy',
    },
  ],
}


const healthyCardProps = {
  title: 'My Card - healthy',
  critical: 0,
  healthy: 13,
  warning: 0,
  table: [
    {
      link: 'www.ibm.coim',
      percentage: 25,
      resourceName: 'Cluster 1',
      status: 'critical',
    },
    {
      link: 'www.ibm.coim',
      percentage: 35,
      resourceName: 'Cluster 2',
      status: 'warning',
    },
    {
      link: 'www.ibm.com',
      percentage: 50,
      resourceName: 'Cluster 3',
      status: 'healthy',
    },
  ],
}

storiesOf('DashbordCard', module)

  .add('critical', () => (
    <DashboardCard  {...criticalCardProps} />
  ))

  .add('warning', () => (
    <DashboardCard  {...warningCardProps} />
  ))

  .add('healthy', () => (
    <DashboardCard  {...healthyCardProps} />
  ))

