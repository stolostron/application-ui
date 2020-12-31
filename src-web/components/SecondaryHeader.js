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

import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { Breadcrumb, Tabs, Tab, Button } from 'carbon-components-react'
import { DetailPageHeader } from 'carbon-addons-cloud-react'
import resources from '../../lib/shared/resources'
import { Link } from 'react-router-dom'
import msgs from '../../nls/platform.properties'
import SecondaryHeaderTooltip from './SecondaryHeaderTooltip'
import classNames from 'classnames'
import { withLocale } from '../providers/LocaleProvider'

resources(() => {
  require('../../scss/secondary-header.scss')
})

const renderBreadCrumb = breadcrumbItems => {
  return (
    breadcrumbItems &&
    breadcrumbItems.map((breadcrumb, index) => {
      const key = `${breadcrumb}-${index}`
      return (
        <React.Fragment key={key}>
          <div
            className="bx--breadcrumb-item"
            title={decodeURIComponent(breadcrumb.label)}
          >
            <Link to={breadcrumb.url} className="bx--link">
              {decodeURIComponent(breadcrumb.label)}
            </Link>
          </div>
        </React.Fragment>
      )
    })
  )
}

const renderLinks = (links, locale, history) => {
  return links.map(link => {
    const {
      id,
      label,
      url,
      kind = 'primary',
      title,
      handleClick = () => history.push(url)
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

const renderActions = actions => {
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

const renderTabs = (tabs, history, locale) => {
  return tabs.map(tab => {
    return (
      <Tab
        label={msgs.get(tab.label, locale)}
        key={tab.id}
        id={tab.id}
        href={tab.url}
        onClick={() => {
          clickTab(tab.url, history)
        }}
      />
    )
  })
}

const renderTooltip = (tooltip, links, locale) => {
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

const getSelectedTab = (tabs, location) => {
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

const clickTab = (url, history) => {
  history.replace(url, { tabChange: true })
}

const SecondaryHeader = ({
  location,
  tabs,
  breadcrumbItems,
  links,
  titleId,
  actions,
  tooltip,
  history,
  locale,
  mainButton
}) => {
  const title = msgs.get(titleId, locale)

  function useShadowScroll() {
    const listenToScroll = () => {
      if (window.scrollY > 0.1 && shadowPresent === false) {
        setShadowPresent(true)
      } else if (window.scrollY <= 0.1 && shadowPresent === true) {
        setShadowPresent(false)
      }
    }

    const [shadowPresent, setShadowPresent] = useState(false)
    useEffect(() => {
      window.addEventListener('scroll', listenToScroll)

      return () => {
        window.removeEventListener('scroll', listenToScroll)
      }
    })

    return shadowPresent
  }

  //show shadow on header when scrolling the page
  const shadowPresent = useShadowScroll()
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
          <React.Fragment>
            <DetailPageHeader
              hasTabs={true}
              title={decodeURIComponent(title)}
              statusText={null}
              statusContent={renderTooltip(tooltip, links, locale)}
              aria-label={`${title} ${msgs.get('secondaryHeader', locale)}`}
            >
              {breadcrumbItems && (
                <Breadcrumb>{renderBreadCrumb(breadcrumbItems)}</Breadcrumb>
              )}
            </DetailPageHeader>
            {shadowPresent && (
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
                    selected={getSelectedTab(tabs, location) || 0}
                    aria-label={`${title} ${msgs.get('tabs.label', locale)}`}
                  >
                    {renderTabs(tabs, history, locale)}
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
          </React.Fragment>
          {actions && renderActions(actions)}
        </div>
        {links &&
          links.length > 0 && (
            <div className="secondary-header-links">
              {renderLinks(links, locale, history)}
            </div>
        )}
      </div>
    )
  } else {
    return (
      <div
        className="secondary-header-wrapper"
        role="region"
        aria-label={`${title} ${msgs.get('secondaryHeader', locale)}`}
      >
        <div className="secondary-header simple-header">
          <h1 className="bx--detail-page-header-title">
            {decodeURIComponent(title)}
          </h1>
          {renderTooltip(tooltip, links, locale)}
        </div>
      </div>
    )
  }
}

SecondaryHeader.propTypes = {
  breadcrumbItems: PropTypes.array,
  history: PropTypes.object,
  links: PropTypes.array,
  locale: PropTypes.string,
  location: PropTypes.object,
  mainButton: PropTypes.object,
  tabs: PropTypes.array,
  title: PropTypes.string
}

export default withLocale(SecondaryHeader)
