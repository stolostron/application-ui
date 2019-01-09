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
import resources from '../../../lib/shared/resources'
import PolicyTemplates from '../../components/common/PolicyTemplates'
import ResourceTableModule from '../../components/common/ResourceTableModuleFromProps'
import { updateSecondaryHeader} from '../../actions/common'
import lodash from 'lodash'
import {getTabs} from '../../../lib/client/resource-helper'
import { RESOURCE_TYPES } from '../../../lib/shared/constants'
import msgs from '../../../nls/platform.properties'
import { Query } from 'react-apollo'
import { HCMPolicy } from '../../../lib/client/queries'

resources(() => {
  require('../../../scss/resource-overview.scss')
})


class CompliancePolicyDetail extends React.Component {
  static propTypes = {
    baseUrl: PropTypes.string,
    location: PropTypes.object,
    params: PropTypes.object,
    resourceType: PropTypes.object,
    staticResourceData: PropTypes.object,
    tabs: PropTypes.array,
    updateSecondaryHeader: PropTypes.func,
  }

  static contextTypes = {
    locale: PropTypes.string
  }

  constructor (props) {
    super(props)
  }

  componentWillMount() {
    const { updateSecondaryHeader, baseUrl, params, tabs } = this.props
    // details page mode
    if (params) {
      updateSecondaryHeader(this.getPolicyName(), getTabs(tabs, (tab, index) => {
        return index === 0 ? baseUrl : `${baseUrl}/${tab}`
      }), this.getBreadcrumb())
    }
  }

  getPolicyName() {
    const { location } = this.props,
          urlSegments = location.pathname.split('/')
    return urlSegments[urlSegments.length - 2]
  }

  getBreadcrumb() {
    const breadcrumbItems = []
    const { tabs, location, resourceType } = this.props,
          { locale } = this.context,
          urlSegments = location.pathname.split('/'),
          lastSegment = urlSegments[urlSegments.length - 1],
          currentTab = tabs.find(tab => tab === lastSegment)

    // The details path
    if (resourceType.name === RESOURCE_TYPES.HCM_COMPLIANCES.name) {
      breadcrumbItems.push({
        label: msgs.get(`tabs.${resourceType.name.toLowerCase()}`, locale),
        url: urlSegments.slice(0, 3).join('/')
      })

      breadcrumbItems.push({
        label: urlSegments[4],
        url: location.pathname.replace(/compliancePolicy\/[A-Za-z0-9-]+\/[A-Za-z0-9-]+/, '')
      })

      if (location.pathname.includes('/compliancePolicy')) {
        const label = location.pathname.match(/compliancePolicy\/[A-Za-z0-9-]+/)[0].replace('compliancePolicy/', '')
        breadcrumbItems.push({
          label,
          url: currentTab ? location.pathname.replace(`/${currentTab}`, '') : location.pathname
        })
      }
    }

    return breadcrumbItems
  }

  render() {
    const policyName = lodash.get(this.props, 'match.params.policyName')
    const policyNamespace = lodash.get(this.props, 'match.params.policyNamespace')
    const {staticResourceData, params, resourceType} = this.props
    return (
      <Query query={HCMPolicy} variables={{name: policyName, clusterName: policyNamespace}}>
        {({ data, loading }) => {
          if (loading) {
            return (<Loading withOverlay={false} className='content-spinner' />)
          }
          const policy = data.policies[0], modulesRight = [], modulesBottom = []
          React.Children.map([
            <PolicyTemplates key='Policy Templates' headerKey='table.header.policyTemplate' right />,
            <ResourceTableModule key='roleTemplates' definitionsKey='policyRoleTemplates' />,
            <ResourceTableModule key='roleBindingTemplates' definitionsKey='policyRoleBindingTemplates' />,
            <ResourceTableModule key='objectTemplates' definitionsKey='policyObjectTemplates' />,
            <ResourceTableModule key='rules' definitionsKey='policyRules' />,
            <ResourceTableModule key='violations' definitionsKey='policyViolations' />], module => {
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
        }}
      </Query>

    )
  }
}

const mapStateToProps = () => {
  return {}
}


const mapDispatchToProps = (dispatch) => {
  return {
    updateSecondaryHeader: (title, tabs, breadcrumbItems, links) => dispatch(updateSecondaryHeader(title, tabs, breadcrumbItems, links))
  }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(CompliancePolicyDetail))
