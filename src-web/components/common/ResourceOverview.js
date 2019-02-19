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
import { withRouter } from 'react-router-dom'
import PropTypes from 'prop-types'
import { Loading } from 'carbon-components-react'
import { connect } from 'react-redux'
import StructuredListModule from '../../components/common/StructuredListModule'
import { getSingleResourceItem, resourceItemByName } from '../../reducers/common'
import { MCM_OPEN_DIAGRAM_TAB_COOKIE } from '../../../lib/shared/constants'
import resources from '../../../lib/shared/resources'

resources(() => {
  require('../../../scss/resource-overview.scss')
})

const ResourceOverview = ({
  staticResourceData,
  item,
  params,
  modules,
  resourceType
}) => {
  localStorage.removeItem(MCM_OPEN_DIAGRAM_TAB_COOKIE)
  if (!item)
    return <Loading withOverlay={false} className='content-spinner' />
  const modulesRight = []
  const modulesBottom = []
  React.Children.map(modules, module => {
    if (module.props.right) {
      modulesRight.push(React.cloneElement(module, { staticResourceData: staticResourceData, resourceType: resourceType, resourceData: item, params }))
    } else {
      modulesBottom.push(React.cloneElement(module, { staticResourceData: staticResourceData, resourceType: resourceType, resourceData: item, params }))
    }
  })

  return (
    <div className='overview-content'>
      <StructuredListModule
        title={staticResourceData.detailKeys.title}
        headerRows={staticResourceData.detailKeys.headerRows}
        rows={staticResourceData.detailKeys.rows}
        data={item} />
      {modulesRight.length > 0 &&
      <div className='overview-content-right'>
        {modulesRight}
      </div>}
      <div className='overview-content-bottom'>
        {modulesBottom}
      </div>
    </div>
  )
}

ResourceOverview.contextTypes = {
  locale: PropTypes.string
}

ResourceOverview.propTypes = {
  item: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.object,
  ]),
  modules: PropTypes.oneOfType([
    PropTypes.array,
    PropTypes.object,
  ]),
  params: PropTypes.object,
  resourceType: PropTypes.object,
  staticResourceData: PropTypes.object,
}

const mapStateToProps = (state, ownProps) => {
  const { resourceType, params } = ownProps
  const name = decodeURIComponent(params.name)
  const item = getSingleResourceItem(state, { storeRoot: resourceType.list, resourceType, name, predicate: resourceItemByName,
    namespace: params.namespace ? decodeURIComponent(params.namespace) : null })
  return { item }
}

export default withRouter(connect(mapStateToProps)(ResourceOverview))
