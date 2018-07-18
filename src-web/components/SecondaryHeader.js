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
import { DetailPageHeader, Tabs, Tab } from 'carbon-components-react'
import resources from '../../lib/shared/resources'
import { withRouter    } from 'react-router-dom'
import msgs from '../../nls/platform.properties'

resources(() => {
  require('../../scss/secondary-header.scss')
})

export class SecondaryHeader extends React.Component {
  /* FIXME: Please fix disabled eslint rules when making changes to this file. */
  /* eslint-disable react/prop-types, react/jsx-no-bind */

  constructor(props) {
    super(props)
    this.renderTabs = this.renderTabs.bind(this)
  }

  render() {
    const { tabs, title } = this.props
    const { locale } = this.context
    if ((tabs && tabs.length > 0)) {
      return (
        <div className='secondary-header-wrapper' role='region' aria-label={title}>
          <div className='secondary-header'>
            {tabs && tabs.length > 0 ? (
              <DetailPageHeader hasTabs={true} title={decodeURIComponent(title)} aria-label={`${title} ${msgs.get('secondaryHeader', locale)}`}>
                <Tabs selected={this.getSelectedTab() || 0} aria-label={`${title} ${msgs.get('tabs.label', locale)}`}>
                  {this.renderTabs()}
                </Tabs>
              </DetailPageHeader>
            ) : (
              <DetailPageHeader hasTabs={true} title={decodeURIComponent(title)} aria-label={`${title} ${msgs.get('secondaryHeader', locale)}`}>
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

  renderTabs() {
    const { tabs } = this.props,
          { locale } = this.context
    return tabs.map(tab => {
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
    links: state.secondaryHeader.links,
    role: state.role && state.role.role,
  }
}

export default withRouter(connect(mapStateToProps)(SecondaryHeader))
