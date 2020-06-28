/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2017, 2019. All Rights Reserved.
 * Copyright (c) 2020 Red Hat, Inc.
 *
 * US Government Users Restricted Rights - Use, duplication or disclosure
 * restricted by GSA ADP Schedule Contract with IBM Corp.
 *******************************************************************************/
'use strict'

import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as Actions from '../actions'
import { Breadcrumb, Tabs, Tab } from 'carbon-components-react'
import { DetailPageHeader } from 'carbon-addons-cloud-react'
import resources from '../../lib/shared/resources'
import { withRouter, Link } from 'react-router-dom'
import msgs from '../../nls/platform.properties'

resources(() => {
  require('../../scss/secondary-header.scss')
})

export class SecondaryHeader extends React.Component {
  constructor(props) {
    super(props)
    this.renderBreadCrumb = this.renderBreadCrumb.bind(this)
    this.renderTabs = this.renderTabs.bind(this)
  }

  render() {
    const { tabs, title, breadcrumbItems } = this.props
    const { locale } = this.context
    if (
      (tabs && tabs.length > 0) ||
      (breadcrumbItems && breadcrumbItems.length > 0)
    ) {
      return (
        <div id="ApplicationSecondaryHeader">
          <div
            className="secondary-header-wrapper"
            role="region"
            aria-label={title}
          >
            <div className="secondary-header simple-header">
              <header aria-label={`Heading: ${title}`}>
                <div className="bx--detail-page-header-content">
                  {tabs && tabs.length > 0 ? (
                    <DetailPageHeader
                      hasTabs={true}
                      title={decodeURIComponent(title)}
                      aria-label={`${title} ${msgs.get(
                        'secondaryHeader',
                        locale
                      )}`}
                    >
                      <Breadcrumb>
                        {breadcrumbItems && this.renderBreadCrumb()}
                      </Breadcrumb>
                      <Tabs
                        selected={this.getSelectedTab() || 0}
                        aria-label={`${title} ${msgs.get(
                          'tabs.label',
                          locale
                        )}`}
                      >
                        {this.renderTabs()}
                      </Tabs>
                    </DetailPageHeader>
                  ) : (
                    <DetailPageHeader
                      hasTabs={false}
                      title={decodeURIComponent(title)}
                      aria-label={`${title} ${msgs.get(
                        'secondaryHeader',
                        locale
                      )}`}
                    >
                      <Breadcrumb>{this.renderBreadCrumb()}</Breadcrumb>
                    </DetailPageHeader>
                  )}
                </div>
              </header>
            </div>
          </div>
        </div>
      )
    } else {
      return (
        <div id="ApplicationSecondaryHeader">
          <div
            className="secondary-header-wrapper-min"
            role="region"
            aria-label={`${title} ${msgs.get('secondaryHeader', locale)}`}
          >
            <div className="secondary-header simple-header">
              <h1 className="bx--detail-page-header-title">
                {decodeURIComponent(title)}
              </h1>
            </div>
          </div>
        </div>
      )
    }
  }

  renderBreadCrumb() {
    const { breadcrumbItems } = this.props
    return (
      breadcrumbItems &&
      breadcrumbItems.map((breadcrumb, index) => {
        const key = `${breadcrumb}-${index}`
        return (
          <div
            key={key}
            className="bx--breadcrumb-item"
            title={decodeURIComponent(breadcrumb.label)}
          >
            {index === 0 ? (
              <Link
                to={breadcrumb.url}
                className="bx--link"
                onClick={() => {
                  this.props.actions.setSelectedAppTab(0)
                }}
              >
                {decodeURIComponent(breadcrumb.label)}
              </Link>
            ) : (
              <Link to={breadcrumb.url} className="bx--link">
                {decodeURIComponent(breadcrumb.label)}
              </Link>
            )}
          </div>
        )
      })
    )
  }

  renderTabs() {
    const { tabs } = this.props,
          { locale } = this.context
    return tabs.map(tab => {
      return (
        <Tab
          label={msgs.get(tab.label, locale)}
          key={tab.id}
          id={tab.id}
          href={tab.url}
          onClick={
            tab.handleClick
              ? tab.handleClick
              : this.clickTab.bind(this, tab.url)
          }
        />
      )
    })
  }

  getSelectedTab() {
    const { tabs, location } = this.props
    const selectedTab = tabs
      .map((tab, index) => {
        tab.index = index
        return tab
      })
      .filter((tab, index) => {
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

SecondaryHeader.propTypes = {
  actions: PropTypes.object,
  breadcrumbItems: PropTypes.array,
  history: PropTypes.object,
  location: PropTypes.object,
  tabs: PropTypes.object,
  title: PropTypes.string
}

const mapDispatchToProps = dispatch => {
  return {
    actions: bindActionCreators(Actions, dispatch)
  }
}

const mapStateToProps = state => {
  return {
    title: state.secondaryHeader.title,
    tabs: state.secondaryHeader.tabs,
    breadcrumbItems: state.secondaryHeader.breadcrumbItems,
    links: state.secondaryHeader.links,
    role: state.role && state.role.role
  }
}

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(SecondaryHeader)
)
