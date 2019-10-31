/*******************************************************************************
 * Licensed Materials - Property of IBM
 * 5737-E67
 * (c) Copyright IBM Corporation 2018, 2019. All Rights Reserved.
 *
 * US Government Users Restricted Rights - Use, duplication or disclosure
 * restricted by GSA ADP Schedule Contract with IBM Corp.
 *******************************************************************************/

import React from 'react'
import { withRouter } from 'react-router-dom'
import PropTypes from 'prop-types'
import { Loading, Link, Icon } from 'carbon-components-react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as Actions from '../../../actions'
import CountsCardModule from '../../CountsCardModule'
import ApplicationTopologyModule from '../../ApplicationTopologyModule'
import StructuredListModule from '../../../components/common/StructuredListModule'
import {
  getSingleResourceItem,
  resourceItemByName
} from '../../../reducers/common'
import {
  getNumDeployables,
  getNumDeployments,
  getSearchLinkForOneApplication
} from './utils'
import { getResourcesStatusPerChannel } from '../../ApplicationDeploymentPipeline/components/PipelineGrid/utils'
import { withLocale } from '../../../providers/LocaleProvider'
import resources from '../../../../lib/shared/resources'
import { isAdminRole } from '../../../../lib/client/access-helper'
import msgs from '../../../../nls/platform.properties'
import {
  fetchApplicationResource,
  closeModals
} from '../../../reducers/reducerAppDeployments'
import apolloClient from '../../../../lib/client/apollo-client'
import { editResourceClick } from '../../ApplicationDeploymentPipeline/components/PipelineGrid/utils'

resources(() => {
  require('./style.scss')
})

const ResourceOverview = withLocale(
  ({
    staticResourceData,
    item,
    params,
    modules,
    resourceType,
    actions,
    showAppDetails,
    showExpandedTopology,
    incidentCount,
    userRole,
    locale,
    getApplicationResource,
    loading
  }) => {
    const modulesRight = []
    const modulesBottom = []
    React.Children.map(modules, module => {
      if (module.props.right) {
        modulesRight.push(
          React.cloneElement(module, {
            staticResourceData,
            resourceType,
            resourceData: item,
            params
          })
        )
      } else {
        modulesBottom.push(
          React.cloneElement(module, {
            staticResourceData,
            resourceType,
            resourceData: item,
            params
          })
        )
      }
    })
    const deployables = getNumDeployables(item)
    const deployments = getNumDeployments(item)
    const status = getResourcesStatusPerChannel(item, false)
    const completedDeployments = status[0] + status[4]
    const inProgressDeployments = status[2] + status[3]
    const failedDeployments = status[1]
    const countsCardData = [
      {
        msgKey:
          deployables > 1
            ? 'dashboard.card.deployables'
            : 'dashboard.card.deployable',
        textKey: 'dashboard.card.perInstance',
        count: deployables,
        targetLink: getSearchLinkForOneApplication(params),
        border: 'right'
      },
      {
        msgKey:
          deployments > 1
            ? 'dashboard.card.deployments'
            : 'dashboard.card.deployment',
        textKey: 'dashboard.card.total',
        count: deployments,
        targetTab: 1
      },
      {
        msgKey: 'dashboard.card.deployment.completed',
        textKey:
          completedDeployments > 1
            ? 'dashboard.card.deployments'
            : 'dashboard.card.deployment',
        count: completedDeployments,
        targetTab: 1
      },
      {
        msgKey: 'dashboard.card.deployment.inProgress',
        textKey:
          inProgressDeployments > 1
            ? 'dashboard.card.deployments'
            : 'dashboard.card.deployment',
        count: inProgressDeployments,
        targetTab: 1
      },
      {
        msgKey: 'dashboard.card.deployment.failed',
        textKey:
          failedDeployments > 1
            ? 'dashboard.card.deployments'
            : 'dashboard.card.deployment',
        count: failedDeployments,
        alert: failedDeployments > 0 ? true : false,
        targetTab: 1
      }
    ]
    if (isAdminRole(userRole)) {
      countsCardData.push({
        msgKey:
          incidentCount > 1
            ? 'dashboard.card.incidents'
            : 'dashboard.card.incident',
        textKey: 'dashboard.card.total',
        count: incidentCount,
        alert: incidentCount > 0 ? true : false,
        targetTab: 2,
        border: 'left'
      })
    }
    const dashboard = (item && item.dashboard) || ''

    return (
      <div id="resource-overview" className="overview-content">
        <div className="app-info-and-dashboard-links">
          <Link
            href={dashboard}
            aria-disabled={!dashboard}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Icon
              className="app-dashboard-icon"
              name="icon--launch"
              fill="#3D70B2"
            />
            {msgs.get('application.launch.grafana', locale)}
          </Link>
          <span className="app-info-and-dashboard-links-separator" />
          <Link
            href="#"
            onClick={() => {
              editResourceClick(item, getApplicationResource)
            }}
          >
            <Icon
              className="app-dashboard-icon"
              name="icon--edit"
              fill="#3D70B2"
            />
            {msgs.get('application.edit.app', locale)}
          </Link>
          <span className="app-info-and-dashboard-links-separator" />
          <Link
            href="#"
            onClick={() => {
              //call delete app here
            }}
          >
            <Icon
              className="app-dashboard-icon"
              name="icon--delete"
              fill="#3D70B2"
            />
            {msgs.get('application.delete.app', locale)}
          </Link>
        </div>
        {(!item || loading) && <Loading withOverlay={true} />}
        {showAppDetails ? (
          <React.Fragment>
            <StructuredListModule
              title={staticResourceData.detailKeys.title}
              headerRows={staticResourceData.detailKeys.headerRows}
              rows={staticResourceData.detailKeys.rows}
              data={item}
            />
            {modulesRight.length > 0 && (
              <div className="overview-content-right">{modulesRight}</div>
            )}
            <div className="overview-content-bottom">{modulesBottom}</div>
          </React.Fragment>
        ) : !showExpandedTopology ? (
          <React.Fragment>
            <div className="overview-content-bottom overview-content-with-padding">
              <CountsCardModule
                data={countsCardData}
                title="dashboard.card.deployment.summary.title"
                link="#"
              />
            </div>
            <div className="overview-content-bottom overview-content-with-padding">
              <ApplicationTopologyModule
                showExpandedTopology={showExpandedTopology}
                params={params}
                actions={actions}
              />
            </div>
          </React.Fragment>
        ) : (
          <div className="overview-content-bottom overview-content-with-padding">
            <ApplicationTopologyModule
              showExpandedTopology={showExpandedTopology}
              params={params}
              actions={actions}
            />
          </div>
        )}
      </div>
    )
  }
)

ResourceOverview.contextTypes = {
  locale: PropTypes.string
}

ResourceOverview.propTypes = {
  item: PropTypes.oneOfType([PropTypes.bool, PropTypes.object]),
  modules: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
  params: PropTypes.object,
  resourceType: PropTypes.object,
  staticResourceData: PropTypes.object
}

const mapDispatchToProps = dispatch => {
  return {
    actions: bindActionCreators(Actions, dispatch),
    getApplicationResource: (selfLink, namespace, name, cluster) =>
      dispatch(
        fetchApplicationResource(
          apolloClient,
          selfLink,
          namespace,
          name,
          cluster
        )
      ),
    closeModal: () => dispatch(closeModals())
  }
}

const mapStateToProps = (state, ownProps) => {
  const { resourceType, params } = ownProps
  const { role, AppDeployments } = state

  const name = decodeURIComponent(params.name)
  const item = getSingleResourceItem(state, {
    storeRoot: resourceType.list,
    resourceType,
    name,
    predicate: resourceItemByName,
    namespace: params.namespace ? decodeURIComponent(params.namespace) : null
  })
  return {
    item,
    userRole: role.role,
    loading: AppDeployments.loading,
    openEditApplicationModal: AppDeployments.openEditApplicationModal
  }
}

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(withLocale(ResourceOverview))
)
