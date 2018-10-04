/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2018. All Rights Reserved.
 *
 * Note to U.S. Government Users Restricted Rights:
 * Use, duplication or disclosure restricted by GSA ADP Schedule
 * Contract with IBM Corp.
 *******************************************************************************/

import React from 'react'
import resources from '../../lib/shared/resources'
import msgs from '../../nls/platform.properties'
import PropTypes from 'prop-types'
import config from '../../lib/shared/config'
// add back once we support access control
// import { ROLES } from '../../lib/shared/constants'
import { Kubernetes, Catalog, Clusters, HelmRepo, Application, Compliance, Users } from '../components/WelcomeSummaryItems'

/* eslint-disable react/prop-types, react/jsx-no-bind */

resources(() => {
  require('../../scss/welcome.scss')
})

class Welcome extends React.PureComponent {
  constructor(props) {
    super(props)
    this.state = {}
  }

  render() {
    const { locale } = this.context
    return (
      <div className={`welcome${this.hasDynamicSummaryItems() ? ' welcome--condensed' : ''}`}>
        <div className='welcome--introduction' role='region' aria-label={msgs.get('welcome.label', locale)}>
          <div className='welcome--introduction__description'>
            <div className='welcome--text'>
              <h1>{msgs.get('welcome.heading', locale)} <span>{msgs.get('welcome.mcm', locale)}</span></h1>
              <p><span className='welcome--text-secondary'>{msgs.get('welcome.paragraph.mcm.title', locale)}</span> {msgs.get('welcome.paragraph.mcm.description', locale)}</p>
              <p><span className='welcome--text-secondary'>{msgs.get('welcome.paragraph.example.title', locale)}</span> {msgs.get('welcome.paragraph.example.description', locale)}</p>
            </div>
            <div className='welcome--image'>
              <img src={`${config.contextPath}/graphics/MCM-GettingStarted-Header.png`} alt={msgs.get('welcome.svg.description.welcome', locale)} />
            </div>
          </div>
        </div>
        {this.renderWelcomeSummary()}
        <div className='welcome--connect' role='region' aria-label={msgs.get('welcome.connect.label', locale)} >
          <div className='welcome--connect__heading'>
            <h2>{msgs.get('welcome.connect.heading', locale)}</h2>
            <p>{msgs.get('welcome.connect.description.one', locale)}</p>
            <p>{msgs.get('welcome.connect.description.two', locale)}</p>
          </div>
          {/* TODO: update link*/}
          <div className='welcome--connect__details'>
            <div className='welcome--connect__section'>
              <img className='welcome--img__blog' src={`${config.contextPath}/graphics/ICP-Connect_Icons-VideoBlog.svg`} alt={msgs.get('svg.description.blog', locale)} />
              <p>{msgs.get('welcome.connect.box.one.title.one', locale)}</p>
              <p>{msgs.get('welcome.connect.box.one.title.two', locale)}</p>
              <a target='dev-community' href='https://www.ibm.com/developerworks/community/wikis/home?lang=en#!/wiki/W1559b1be149d_43b0_881e_9783f38faaff' className='bx--link' aria-describedby='launchWindow'>{msgs.get('welcome.connect.box.one.link', locale)}</a>
            </div>
            <div className='welcome--connect__section has-divider'>
              <img className='welcome--img__slack' src={`${config.contextPath}/graphics/ICP-Connect_Icons-Slack.svg`} alt={msgs.get('svg.description.slack', locale)} />
              <p>{msgs.get('welcome.connect.box.two.title.one', locale)}</p>
              <p>{msgs.get('welcome.connect.box.two.title.two', locale)}</p>
              <a target='slack' href='http://ibm.biz/BdsHmN' className='bx--link' aria-describedby='launchWindow'>{msgs.get('welcome.connect.box.two.link', locale)}</a>
            </div>
            <div className='welcome--connect__section'>
              <img className='welcome--img__support' src={`${config.contextPath}/graphics/ICP-Connect_Icons-Support.svg`} alt={msgs.get('svg.description.support', locale)} />
              <p>{msgs.get('welcome.connect.box.three.title.one', locale)}</p>
              <p>{msgs.get('welcome.connect.box.three.title.two', locale)}</p>
              <a target='support' href='https://ibm.biz/icpsupport' className='bx--link' aria-describedby='launchWindow'>{msgs.get('welcome.connect.box.three.link', locale)}</a>
            </div>
          </div>
        </div>
      </div>
    )
  }

  renderWelcomeSummary() {
    const { locale } = this.context
    if (this.hasDynamicSummaryItems()) {
      return (
        <div className='welcome--summary--condensed' role='region' aria-label={msgs.get('welcome.box.label', locale)}>
          <h2>{msgs.get('welcome.box.one.title', locale)}</h2>
          <p>{msgs.get('welcome.box.one.description', locale)}</p>
          <ul className='bx--list--unordered'>
            <Kubernetes locale={locale} showHorizontalRule={true} />
            <Catalog locale={locale} showHorizontalRule={true} />
            {this.hasRoleAccess('clusters') && <Clusters locale={locale} />}
            {this.hasRoleAccess('helmrepo') && <HelmRepo locale={locale} />}
            {this.hasRoleAccess('applications') && <Application locale={locale} />}
            {this.hasRoleAccess('compliance') && <Compliance locale={locale} />}
            {this.hasRoleAccess('users') && <Users locale={locale} />}
          </ul>
        </div>
      )
    } else {
      return (
        <div className='welcome--summary' role='region' aria-label={msgs.get('welcome.box.label', locale)}>
          <div className='welcome--summary__section welcome--summary__one'>
            <div className='welcome--summary__inner'>
              <h2>{msgs.get('welcome.box.one.title', locale)}</h2>
              <p>{msgs.get('welcome.box.one.description', locale)}</p>
              <ul className='bx--list--unordered'>
                <Kubernetes locale={locale} />
                <Catalog locale={locale} />
              </ul>
            </div>
          </div>
          <div className='welcome--summary__section welcome--summary__two'>
            <div className='welcome--summary__inner'>
              <h2>{msgs.get('welcome.box.two.title', locale)}</h2>
              <p>{msgs.get('welcome.box.two.description', locale)}</p>
              <ul className='bx--list--unordered'>
                {this.hasRoleAccess('clusters') && <Clusters locale={locale} />}
                {this.hasRoleAccess('helmrepo') && <HelmRepo locale={locale} />}
                {this.hasRoleAccess('applications') && <Application locale={locale} />}
                {this.hasRoleAccess('compliance') && <Compliance locale={locale} />}
                {this.hasRoleAccess('users') && <Users locale={locale} />}
              </ul>
            </div>
          </div>
        </div>
      )
    }
  }

  hasDynamicSummaryItems() {
    const dynamicSummaryItems = [
      this.hasRoleAccess('clusters'),
      this.hasRoleAccess('helmrepo'),
      this.hasRoleAccess('applications'),
      this.hasRoleAccess('compiance'),
      this.hasRoleAccess('users'),
    ].filter(item => item === true)
    return dynamicSummaryItems.length < 1
  }

  hasRoleAccess(page) {
    // const { role } = this.props
    // return page === 'dashboard' ? role === ROLES.CLUSTER_ADMIN : role === ROLES.CLUSTER_ADMIN || role === ROLES.ADMIN
    // mcm doesn't have role access control so far, keep this function for later usage once we do support access control
    return !!page
  }
}

Welcome.contextTypes = {
  locale: PropTypes.string
}

Welcome.propTypes = {
  // role: PropTypes.string,
}


export default Welcome
