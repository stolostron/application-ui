/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2017, 2018. All Rights Reserved.
 *
 * Note to U.S. Government Users Restricted Rights:
 * Use, duplication or disclosure restricted by GSA ADP Schedule
 * Contract with IBM Corp.
 * Copyright (c) 2020 Red Hat, Inc.
 *******************************************************************************/
'use strict'

import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Button } from 'carbon-components-react'
import {
  AcmPageHeader,
  AcmSecondaryNav,
  AcmSecondaryNavItem
} from '@open-cluster-management/ui-components'
import resources from '../../lib/shared/resources'
import { withRouter, Link } from 'react-router-dom'
import msgs from '../../nls/platform.properties'
import SecondaryHeaderTooltip from './SecondaryHeaderTooltip'
import classNames from 'classnames'

resources(() => {
  require('../../scss/secondary-header.scss')
})

export class SecondaryHeader extends React.Component {
  constructor(props) {
    super(props)
    this.renderTabs = this.renderTabs.bind(this)
    this.renderTooltip = this.renderTooltip.bind(this)
    this.renderLinks = this.renderLinks.bind(this)

    this.state = {
      shadowPresent: false
    }
  }

  componentDidMount() {
    window.addEventListener('scroll', this.listenToScroll)
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.listenToScroll)
  }

  listenToScroll = () => {
    if (window.scrollY > 0.1 && this.state.shadowPresent === false) {
      this.setState({ shadowPresent: true })
    } else if (window.scrollY <= 0.1 && this.state.shadowPresent === true) {
      this.setState({ shadowPresent: false })
    }
  };

  render() {
    const {
      tabs,
      title,
      breadcrumbItems,
      links,
      mainButton,
      actions
    } = this.props
    const { locale } = this.context

    const headerArgs = {
      breadcrumb: breadcrumbItems && this.getBreadcrumbs(),
      title: decodeURIComponent(title),
      navigation: tabs &&
        tabs.length > 0 && (
          <React.Fragment>
            {this.state.shadowPresent && (
              <div
                className={
                  breadcrumbItems
                    ? 'header-box-shadow--tall'
                    : 'header-box-shadow'
                }
              />
            )}
            <AcmSecondaryNav
              className={classNames({
                'cluster-tabs--long': breadcrumbItems,
                'cluster-tabs': !breadcrumbItems
              })}
              // selected={this.getSelectedTab() || 0}
              aria-label={`${title} ${msgs.get('tabs.label', locale)}`}
            >
              {this.renderTabs()}
            </AcmSecondaryNav>
          </React.Fragment>
      ),
      controls: 'Refresh component',
      actions: tabs &&
        tabs.length > 0 &&
        mainButton && (
          <div
            className={classNames({
              'main-button-container': true,
              'with-breadcrumbs': breadcrumbItems
            })}
          >
            {mainButton}
          </div>
      )
    }

    if (
      (tabs && tabs.length > 0) ||
      (breadcrumbItems && breadcrumbItems.length > 0)
    ) {
      return (
        <div
          className={classNames({
            'secondary-header-wrapper': true,
            'with-tabs': tabs && tabs.length > 0,
            'with-breadcrumbs': breadcrumbItems && breadcrumbItems.length > 0
          })}
          role="region"
          aria-label={title}
        >
          <div
            className={`secondary-header ${
              actions && !tabs ? 'detailed-header-override' : ''
            }`}
          >
            <AcmPageHeader {...headerArgs} />
            {/* <React.Fragment>
              <DetailPageHeader
                hasTabs={true}
                title={decodeURIComponent(title)}
                statusText={null}
                statusContent={this.renderTooltip()}
                aria-label={`${title} ${msgs.get('secondaryHeader', locale)}`}
              >
                {breadcrumbItems && (
                  <Breadcrumb>{this.renderBreadCrumb()}</Breadcrumb>
                )}
              </DetailPageHeader>
              {this.state.shadowPresent && (
                <React.Fragment>
                  <div
                    className={
                      breadcrumbItems
                        ? 'header-box-shadow--tall'
                        : 'header-box-shadow'
                    }
                  />
                </React.Fragment>
              )}
              {tabs &&
                tabs.length > 0 && (
                  <div className="tab-container">
                    <Tabs
                      className={classNames({
                        'cluster-tabs--long': breadcrumbItems,
                        'cluster-tabs': !breadcrumbItems
                      })}
                      selected={this.getSelectedTab() || 0}
                      aria-label={`${title} ${msgs.get('tabs.label', locale)}`}
                    >
                      {this.renderTabs()}
                    </Tabs>
                    {mainButton && (
                      <div
                        className={classNames({
                          'main-button-container': true,
                          'with-breadcrumbs': breadcrumbItems
                        })}
                      >
                        {mainButton}
                      </div>
                    )}
                  </div>
              )}
            </React.Fragment> */}
            {actions && this.renderActions()}
          </div>
          {links &&
            links.length > 0 && (
              <div className="secondary-header-links">{this.renderLinks()}</div>
          )}
        </div>
      )
    } else {
      return (
        <div
          className="secondary-header-wrapper-min"
          role="region"
          aria-label={`${title} ${msgs.get('secondaryHeader', locale)}`}
        >
          <div className="secondary-header simple-header">
            <h1 className="bx--detail-page-header-title">
              {decodeURIComponent(title)}
            </h1>
            {this.renderTooltip()}
          </div>
        </div>
      )
    }
  }

  getBreadcrumbs() {
    const { breadcrumbItems } = this.props
    return breadcrumbItems
      ? breadcrumbItems.map(breadcrumb => {
        return { text: breadcrumb.label, to: breadcrumb.url }
      })
      : null
  }

  // renderBreadCrumb() {
  //   const { breadcrumbItems } = this.props
  //   return (
  //     breadcrumbItems &&
  //     breadcrumbItems.map((breadcrumb, index) => {
  //       const key = `${breadcrumb}-${index}`
  //       return (
  //         <React.Fragment key={key}>
  //           <div
  //             className="bx--breadcrumb-item"
  //             title={decodeURIComponent(breadcrumb.label)}
  //           >
  //             <Link to={breadcrumb.url} className="bx--link">
  //               {decodeURIComponent(breadcrumb.label)}
  //             </Link>
  //           </div>
  //         </React.Fragment>
  //       )
  //     })
  //   )
  // }

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

  renderActions() {
    const { actions } = this.props
    return (
      <div className="secondary-header-actions">
        <Button
          kind="secondary"
          onClick={() => actions.secondary && actions.secondary.action()}
          className="secondary-header-actions-secondary"
        >
          {actions.secondary && actions.secondary.label}
        </Button>
        <Button
          kind="primary"
          onClick={() => actions.primary && actions.primary.action()}
          disabled={actions.primary.disabled}
          className="secondary-header-actions-primary"
        >
          {actions.primary && actions.primary.label}
        </Button>
      </div>
    )
  }

  renderTabs() {
    const { tabs } = this.props,
          { locale } = this.context
    return tabs.map((tab, idx) => {
      return (
        <AcmSecondaryNavItem
          key={tab.id}
          id={tab.id}
          isActive={(this.getSelectedTab() || 0) === idx}
          onClick={
            tab.handleClick
              ? tab.handleClick
              : this.clickTab.bind(this, tab.url)
          }
        >
          <Link to={tab.url}>{msgs.get(tab.label, locale)}</Link>
        </AcmSecondaryNavItem>
      )
    })
  }

  renderTooltip() {
    const { tooltip } = this.props
    const { locale } = this.context
    const { links = [] } = this.props
    return (
      <React.Fragment>
        {tooltip && (
          <SecondaryHeaderTooltip
            text={tooltip.text}
            link={tooltip.link}
            linkText={msgs.get('tooltip.link', locale)}
          />
        )}
        {links &&
          links.map(link => {
            const { id, kind, title } = link
            // if portal, react component will create the button using a portal
            if (kind === 'portal' && title) {
              return <div key={id} id={id} className="portal" />
            } else {
              return null
            }
          })}
      </React.Fragment>
    )
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

  clickTab(url) {
    this.props.history.replace(url, { tabChange: true })
  }
}

SecondaryHeader.propTypes = {
  actions: PropTypes.array,
  breadcrumbItems: PropTypes.array,
  history: PropTypes.object,
  links: PropTypes.array,
  location: PropTypes.object,
  mainButton: PropTypes.object,
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
    actions: state.secondaryHeader.actions,
    mainButton: state.secondaryHeader.mainButton,
    breadcrumbItems: state.secondaryHeader.breadcrumbItems,
    links: state.secondaryHeader.links,
    tooltip: state.secondaryHeader.tooltip,
    role: state.role && state.role.role
  }
}

export default withRouter(connect(mapStateToProps)(SecondaryHeader))
