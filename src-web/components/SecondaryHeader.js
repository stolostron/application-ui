/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2017, 2018. All Rights Reserved.
 *
 * Note to U.S. Government Users Restricted Rights:
 * Use, duplication or disclosure restricted by GSA ADP Schedule
 * Contract with IBM Corp.
 *******************************************************************************/
'use strict'

import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Breadcrumb, DetailPageHeader, Tabs, Tab } from 'carbon-components-react'
import resources from '../../lib/shared/resources'
import { withRouter, Link } from 'react-router-dom'
import msgs from '../../nls/platform.properties'
import { ROLES } from '../../lib/shared/constants'

resources(() => {
  require('../../scss/secondary-header.scss')
})

class SecondaryHeader extends React.Component {
  constructor(props) {
    super(props)
    this.renderBreadCrumb = this.renderBreadCrumb.bind(this)
    this.renderTabs = this.renderTabs.bind(this)
  }

  render() {
    const { tabs, title, breadcrumbItems } = this.props
    const { locale } = this.context
    if ((tabs && tabs.length > 0) || (breadcrumbItems && breadcrumbItems.length > 0)) {
      return (
        <div className='secondary-header-wrapper' role='region' aria-label={title}>
          <div className='secondary-header'>
            {tabs && tabs.length > 0 ? (
              <DetailPageHeader hasTabs={true} title={decodeURIComponent(title)} aria-label={`${title} ${msgs.get('secondaryHeader', locale)}`}>
                <Breadcrumb>
                  {breadcrumbItems && this.renderBreadCrumb()}
                </Breadcrumb>
                <Tabs selected={this.getSelectedTab() || 0} aria-label={`${title} ${msgs.get('tabs.label', locale)}`}>
                  {this.renderTabs()}
                </Tabs>
              </DetailPageHeader>
            ) : (
              <DetailPageHeader hasTabs={true} title={decodeURIComponent(title)} aria-label={`${title} ${msgs.get('secondaryHeader', locale)}`}>
                <Breadcrumb>
                  {this.renderBreadCrumb()}
                </Breadcrumb>
              </DetailPageHeader>
            )}
          </div>
        </div>
      )
    } else {
      return (
        <div className='secondary-header-wrapper-min' role='region' aria-label={`${title} ${msgs.get('secondaryHeader', locale)}`}>
          <div className='secondary-header simple-header'>
            <h1 className='bx--detail-page-header-title'>{decodeURIComponent(title)}</h1>
          </div>
        </div>
      )
    }
  }

  renderBreadCrumb() {
    const { breadcrumbItems } = this.props
    return breadcrumbItems && breadcrumbItems.map((breadcrumb, index) => {
      return (
        /* eslint-disable-next-line react/no-array-index-key */
        <div key={`${breadcrumb}-${index}`} className='bx--breadcrumb-item' title={decodeURIComponent(breadcrumb.label)}>
          <Link to={breadcrumb.url} className='bx--link'>{decodeURIComponent(breadcrumb.label)}</Link>
        </div>
      )
    })
  }

  renderTabs() {
    const { tabs, role } = this.props,
          { locale } = this.context
    return tabs.map(tab => {
      if (!(tab.id === 'logs-tab' && (role === ROLES.VIEWER || role === ROLES.EDITOR)))
        return <Tab label={msgs.get(tab.label, locale)} key={tab.id} id={tab.id} href={tab.url} onClick={this.clickTab.bind(this, tab.url)} />
    })
  }

  getSelectedTab() {
    const { tabs, location } = this.props
    const selectedTab = tabs.map((tab, index) => {
      tab.index = index
      return tab
    }).filter((tab, index) => {
      if (index !== 0) {
        return location.pathname.startsWith(tab.url)
      }
    })
    return selectedTab[0] && selectedTab[0].index
  }

  clickTab(url) {
    this.props.history.push(url)
  }
}

SecondaryHeader.contextTypes = {
  locale: PropTypes.string
}

const mapStateToProps = (state) => {
  return {
    title: state.secondaryHeader.title,
    tabs: state.secondaryHeader.tabs,
    breadcrumbItems: state.secondaryHeader.breadcrumbItems,
    links: state.secondaryHeader.links,
    role: state.role && state.role.role
  }
}

export default withRouter(connect(mapStateToProps)(SecondaryHeader))
