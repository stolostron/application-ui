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
import { Route, Switch, Redirect, withRouter} from 'react-router-dom'
import ClustersOverviewTab from './ClustersOverviewTab'
import ClustersPodsTab from './ClustersPodsTab'
import ClustersNodesTab from './ClustersNodesTab'
import ClustersPVsTab from './ClustersPVsTab'
import Page from '../components/common/Page'

const Clusters =({ match }) =>
  <Page>
    <Switch>
      <Route path={`${match.url}/overview`} render={() => <ClustersOverviewTab secondaryHeaderProps={{title: 'routes.clusters.overview'}} />} />
      <Route path={`${match.url}/pods`} render={() => <ClustersPodsTab secondaryHeaderProps={{title: 'routes.clusters.pods'}} />} />
      <Route path={`${match.url}/nodes`} render={() => <ClustersNodesTab secondaryHeaderProps={{title: 'routes.clusters.nodes'}} />} />
      <Route path={`${match.url}/pvs`} render={() => <ClustersPVsTab secondaryHeaderProps={{title: 'routes.clusters.pvs'}} />} />
      <Redirect to={`${match.url}/overview`} />
    </Switch>
  </Page>

export default withRouter(Clusters)
