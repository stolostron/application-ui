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
import ClustersOverviewTab from './ClustersTab'
import ClustersPodsTab from './ClustersPodsTab'
import ClustersNodesTab from './ClustersNodesTab'
import ClustersNamespacesTab from './ClustersNamespacesTab'
import ClustersPVsTab from './ClustersPVsTab'
import ClustersChartsTab from './ClustersChartsTab'
import ClustersReleasesTab from './ClustersReleasesTab'
import ClustersRepositoriesTab from './ClustersRepositoriesTab'
import Page from '../components/common/Page'

/* FIXME: Please fix disabled eslint rules when making changes to this file. */
/* eslint-disable react/prop-types, react/jsx-no-bind */
const Clusters =({ match }) =>
  <Page>
    <Switch>
      <Route path={`${match.url}/overview`} render={() => <ClustersOverviewTab secondaryHeaderProps={{title: 'routes.clusters.overview'}} />} />
      <Route path={`${match.url}/pods`} render={() => <ClustersPodsTab secondaryHeaderProps={{title: 'routes.clusters.pods'}} />} />
      <Route path={`${match.url}/nodes`} render={() => <ClustersNodesTab secondaryHeaderProps={{title: 'routes.clusters.nodes'}} />} />
      <Route path={`${match.url}/namespaces`} render={() => <ClustersNamespacesTab secondaryHeaderProps={{title: 'routes.clusters.namespaces'}} />} />
      <Route path={`${match.url}/pvs`} render={() => <ClustersPVsTab secondaryHeaderProps={{title: 'routes.clusters.pvs'}} />} />
      <Route path={`${match.url}/charts`} render={() => <ClustersChartsTab secondaryHeaderProps={{title: 'routes.clusters.charts'}} />} />
      <Route path={`${match.url}/releases`} render={() => <ClustersReleasesTab secondaryHeaderProps={{title: 'routes.clusters.releases'}} />} />
      <Route path={`${match.url}/repositories`} render={() => <ClustersRepositoriesTab secondaryHeaderProps={{title: 'routes.clusters.repositories'}} />} />
      <Redirect to={`${match.url}/overview`} />
    </Switch>
  </Page>

export default withRouter(Clusters)
