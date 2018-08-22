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
import resources from '../../../lib/shared/resources'
import PolicyTemplates from '../../components/common/PolicyTemplates'
import ResourceTableModule from '../../components/common/ResourceTableModule'
import {fetchResource} from '../../actions/common'
import lodash from 'lodash'

resources(() => {
  require('../../../scss/resource-overview.scss')
})


class CompliancePolicyDetail extends React.Component {
  static propTypes = {
    fetchResource: PropTypes.func,
    item: PropTypes.oneOfType([
      PropTypes.bool,
      PropTypes.object,
    ]),
    params: PropTypes.object,
    resourceType: PropTypes.object,
    staticResourceData: PropTypes.object,
  }

  static contextTypes = {
    locale: PropTypes.string
  }

  constructor (props) {
    super(props)
  }

  componentWillMount() {
    this.props.fetchResource()
  }

  render() {
    const policyName = lodash.get(this.props, 'match.params.policyName')
    const policyNamespace = lodash.get(this.props, 'match.params.policyNamespace')
    const {staticResourceData,params,item,resourceType} = this.props
    if (!item)
      return <Loading withOverlay={false} className='content-spinner' />
    const modulesRight = []
    const modulesBottom = []
    const detail = lodash.get(item, 'complianceStatus', [])
    const policy = detail.find(item => lodash.get(item, 'name', '') === policyName && lodash.get(item, 'cluster', '') === policyNamespace)
    React.Children.map([<PolicyTemplates key='Policy Templates' right />,  <ResourceTableModule key='rules' definitionsKey='policyRules' />,  <ResourceTableModule key='violations' definitionsKey='policyViolations' />], module => {
      if (module.props.right) {
        modulesRight.push(React.cloneElement(module, { staticResourceData: staticResourceData, resourceType: resourceType, resourceData: policy, params }))
      } else {
        modulesBottom.push(React.cloneElement(module, { staticResourceData: staticResourceData, resourceType: resourceType, resourceData: policy, params }))
      }
    })
    return (
      <div className='overview-content'>
        <StructuredListModule
          title={staticResourceData.policyDetailKeys.title}
          headerRows={staticResourceData.policyDetailKeys.headerRows}
          rows={staticResourceData.policyDetailKeys.rows}
          data={policy} />
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
}

const mapStateToProps = (state, ownProps) => {
  const { resourceType, params } = ownProps
  const name = decodeURIComponent(params.name)
  const item = getSingleResourceItem(state, { storeRoot: resourceType.list, resourceType, name, predicate: resourceItemByName,
    namespace: params.namespace ? decodeURIComponent(params.namespace) : null })
  return { item }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  const { resourceType, params: {name, namespace} } = ownProps
  return {
    fetchResource: () => dispatch(fetchResource(resourceType, namespace, name))
  }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(CompliancePolicyDetail))
