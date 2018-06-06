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
      link: 'www.ibm.com',
      percentage: 50,
      resourceName: 'Cluster 2',
      status: 'ok',
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
      link: 'link',
      percentage: 25,
      resourceName: 'Cluster 1',
      status: 'warning',
    },
    {
      link: 'link',
      percentage: 50,
      resourceName: 'Cluster 2',
      status: 'ok',
    },
  ],
}


const okCardProps = {
  title: 'My Card - OK',
  critical: 0,
  healthy: 0,
  warning: 13,
  table: [
    {
      link: 'link',
      percentage: 25,
      resourceName: 'Cluster 1',
      status: 'warning',
    },
    {
      link: 'link',
      percentage: 250,
      resourceName: 'Cluster 2',
      status: 'ok',
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

  .add('ok', () => (
    <DashboardCard  {...okCardProps} />
  ))

