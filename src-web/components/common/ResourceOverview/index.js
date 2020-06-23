/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2018, 2019. All Rights Reserved.
 * Copyright (c) 2020 Red Hat, Inc.
 *
 * US Government Users Restricted Rights - Use, duplication or disclosure
 * restricted by GSA ADP Schedule Contract with IBM Corp.
 *******************************************************************************/
import R from 'ramda'
import React from 'react'
import { withRouter } from 'react-router-dom'
import PropTypes from 'prop-types'
import { Loading } from 'carbon-components-react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as Actions from '../../../actions'
import { ApplicationTopologyModule } from '../../ApplicationTopologyModule'
import {
  getSingleResourceItem,
  resourceItemByName
} from '../../../reducers/common'
import { handleEditResource } from './utils'
import { withLocale } from '../../../providers/LocaleProvider'
import resources from '../../../../lib/shared/resources'
import msgs from '../../../../nls/platform.properties'
import {
  fetchApplicationResource,
  closeModals
} from '../../../reducers/reducerAppDeployments'
import apolloClient from '../../../../lib/client/apollo-client'
import OverviewCards from '../../ApplicationDeploymentPipeline/components/InfoCards/OverviewCards'
import { RESOURCE_TYPES, DOC_LINKS } from '../../../../lib/shared/constants'
import { updateModal } from '../../../actions/common'
import HeaderActions from '../../common/HeaderActions'

resources(() => {
  require('./style.scss')
})

const ResourceOverview = withLocale(
  ({
    item,
    params,
    actions,
    selectedNodeId,
    showExpandedTopology,
    locale,
    getApplicationResource,
    loading,
    showGrafanaAction,
    openEditApplicationModal,
    currentApplicationInfo,
    closeModal,
    editResource
  }) => {
    if (!item) {
      return <Loading withOverlay={false} className="content-spinner" />
    }

    if (openEditApplicationModal) {
      const data = R.pathOr([], ['data', 'items'], currentApplicationInfo)[0]
      const name = R.pathOr('', ['metadata', 'name'], data)
      const namespace = R.pathOr('', ['metadata', 'namespace'], data)
      closeModal()
      editResource(RESOURCE_TYPES.HCM_APPLICATIONS, {
        name: name,
        namespace: namespace,
        data: data,
        helpLink: DOC_LINKS.APPLICATIONS
      })
    }

    const serverProps = {
      isGrafanaRunning: showGrafanaAction
    }

    return (
      <div id="resource-overview" className="overview-content">
        <HeaderActions
          serverProps={serverProps}
          getApplicationResource={getApplicationResource}
          app={item}
        />
        {(!item || loading) && <Loading withOverlay={true} />}
        {!showExpandedTopology ? (
          <React.Fragment>
            <div className="overview-content-bottom overview-content-with-padding">
              <div className="overview-content-header">
                {msgs.get('dashboard.card.deployment.summary.title', locale)}
              </div>
              <div className="overview-cards-info-container">
                <OverviewCards
                  selectedAppName={params.name}
                  selectedAppNS={params.namespace}
                  serverProps={serverProps}
                />
              </div>
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
          <React.Fragment>
            <div className="overview-content-bottom overview-content-with-padding">
              <ApplicationTopologyModule
                selectedNodeId={selectedNodeId}
                showExpandedTopology={showExpandedTopology}
                params={params}
                actions={actions}
              />
            </div>
            <div className="overview-content-space-filler" />
          </React.Fragment>
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
    editResource: (resourceType, data) =>
      handleEditResource(dispatch, updateModal, resourceType, data),
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
    userRole: role && role.role,
    loading: AppDeployments.loading,
    currentApplicationInfo: AppDeployments.currentApplicationInfo || {},
    openEditApplicationModal: AppDeployments.openEditApplicationModal
  }
}

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(withLocale(ResourceOverview))
)
