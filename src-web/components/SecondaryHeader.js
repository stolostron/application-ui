/** *****************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2017, 2018. All Rights Reserved.
 *
 * Note to U.S. Government Users Restricted Rights:
 * Use, duplication or disclosure restricted by GSA ADP Schedule
 * Contract with IBM Corp.
 ****************************************************************************** */
// Copyright (c) 2020 Red Hat, Inc.
// Copyright Contributors to the Open Cluster Management project
'use strict'

import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Button } from '@patternfly/react-core'
import {
  AcmPageHeader,
  AcmSecondaryNav,
  AcmSecondaryNavItem
} from '@stolostron/ui-components'
import resources from '../../lib/shared/resources'
import { withRouter, Link } from 'react-router-dom'
import msgs from '../../nls/platform.properties'
import loadable from '@loadable/component'

const AutoRefreshSelect = loadable(() =>
  import(/* webpackChunkName: "autoRefreshSelect" */ './common/AutoRefreshSelect')
)

resources(() => {
  require('../../scss/secondary-header.scss')
})

export class SecondaryHeader extends React.Component {
  constructor(props) {
    super(props)
    this.renderTabs = this.renderTabs.bind(this)
    this.renderLinks = this.renderLinks.bind(this)
  }

  render() {
    const {
      tabs,
      title,
      breadcrumbItems,
      links,
      label,
      labelColor
    } = this.props
    const { locale } = this.context

    const headerArgs = {
      breadcrumb: breadcrumbItems && this.getBreadcrumbs(),
      title: decodeURIComponent(title),
      navigation: tabs &&
        tabs.length > 0 && (
          <AcmSecondaryNav
            aria-label={`${title} ${msgs.get('tabs.label', locale)}`}
          >
            {this.renderTabs()}
          </AcmSecondaryNav>
      ),
      controls: <AutoRefreshSelect route={this.props.location} />,
      actions: (
        <Fragment>
          {links && (
            <div className="secondary-header-links">{this.renderLinks()}</div>
          )}
        </Fragment>
      ),
      switches: (
        <div className="switch-controls">
          <div id="edit-button-portal-id" />
        </div>
      ),
      label,
      labelColor
    }
    return <AcmPageHeader {...headerArgs} />
  }

  getBreadcrumbs() {
    const { breadcrumbItems } = this.props
    return breadcrumbItems
      ? breadcrumbItems.map(breadcrumb => {
        return { text: breadcrumb.label, to: breadcrumb.url }
      })
      : null
  }

  renderLinks() {
    const { links } = this.props,
          { locale } = this.context
    return links.map(link => {
      const {
        id,
        label,
        url,
        kind = 'primary',
        title,
        handleClick = () => this.props.history.push(url)
      } = link
      // if portal, react component will create the button using a portal
      if (kind === 'portal') {
        return !title ? <div key={id} id={id} className="portal" /> : null
      }
      return (
        <Button key={id} id={id} onClick={handleClick} kind={kind}>
          {msgs.get(label, locale)}
        </Button>
      )
    })
  }

  renderTabs() {
    const { tabs, location } = this.props,
          { locale } = this.context
    return tabs.map((tab, idx) => {
      return (
        <AcmSecondaryNavItem
          key={tab.id}
          id={tab.id}
          isActive={(this.getSelectedTab() || 0) === idx}
          onClick={tab.handleClick || undefined}
        >
          <Link
            to={{
              ...location,
              pathname: tab.url,
              state: { tabChange: location }
            }}
            replace={true}
          >
            {msgs.get(tab.label, locale)}
          </Link>
        </AcmSecondaryNavItem>
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
        if (index === 0) {
          return false
        }
        return location.pathname.startsWith(tab.url)
      })
    return selectedTab[0] && selectedTab[0].index
  }
}

SecondaryHeader.propTypes = {
  breadcrumbItems: PropTypes.array,
  history: PropTypes.object,
  label: PropTypes.string,
  labelColor: PropTypes.string,
  links: PropTypes.array,
  location: PropTypes.object,
  tabs: PropTypes.array,
  title: PropTypes.string,
  tooltip: PropTypes.string
}

SecondaryHeader.contextTypes = {
  locale: PropTypes.string
}

const mapStateToProps = state => {
  return {
    title: state.secondaryHeader.title,
    tabs: state.secondaryHeader.tabs,
    breadcrumbItems: state.secondaryHeader.breadcrumbItems,
    links: state.secondaryHeader.links,
    tooltip: state.secondaryHeader.tooltip,
    role: state.role && state.role.role,
    label: state.secondaryHeader.label,
    labelColor: state.secondaryHeader.labelColor
  }
}

export default withRouter(connect(mapStateToProps)(SecondaryHeader))
