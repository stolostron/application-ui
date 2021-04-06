/** *****************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2018, 2019. All Rights Reserved.
 *
 * US Government Users Restricted Rights - Use, duplication or disclosure
 * restricted by GSA ADP Schedule Contract with IBM Corp.
 *******************************************************************************/
// Copyright (c) 2020 Red Hat, Inc.
// Copyright Contributors to the Open Cluster Management project
import React from 'react'
import { withRouter } from 'react-router-dom'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as Actions from '../../../actions'
import { ApplicationTopologyModule } from '../../ApplicationTopologyModule'
import {
  getSingleResourceItem,
  resourceItemByName
} from '../../../reducers/common'
import { withLocale } from '../../../providers/LocaleProvider'
import resources from '../../../../lib/shared/resources'
import OverviewCards from '../OverviewCards'
import HeaderActions from '../../common/HeaderActions'

resources(() => {
  require('./style.scss')
})

const ResourceOverview = withLocale(
  ({ params, actions, showExpandedTopology, handleErrorMsg }) => {
    const serverProps = {}
    return (
      <div id="resource-overview" className="overview-content">
        <HeaderActions />
        <React.Fragment>
          <div className="overview-content-bottom overview-content-with-padding">
            <OverviewCards
              selectedAppName={params.name}
              selectedAppNS={params.namespace}
              serverProps={serverProps}
              handleErrorMsg={handleErrorMsg}
            />
          </div>

          <div className="overview-content-bottom overview-content-with-padding">
            <ApplicationTopologyModule
              showExpandedTopology={showExpandedTopology}
              params={params}
              actions={actions}
              handleErrorMsg={handleErrorMsg}
            />
          </div>
        </React.Fragment>
      </div>
    )
  }
)

ResourceOverview.propTypes = {
  item: PropTypes.oneOfType([PropTypes.bool, PropTypes.object]),
  params: PropTypes.object,
  resourceType: PropTypes.object,
  staticResourceData: PropTypes.object
}

const mapDispatchToProps = dispatch => {
  return {
    actions: bindActionCreators(Actions, dispatch)
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
    loading: AppDeployments.loading
  }
}

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(withLocale(ResourceOverview))
)
