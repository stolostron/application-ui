/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2018. All Rights Reserved.
 *
 * Note to U.S. Government Users Restricted Rights:
 * Use, duplication or disclosure restricted by GSA ADP Schedule
 * Contract with IBM Corp.
 *******************************************************************************/

import React from 'react'
import msgs from '../../nls/platform.properties'
import config from '../../lib/shared/config'
import { Link } from 'react-router-dom'
import { Icon } from 'carbon-components-react'

/* eslint-disable react/prop-types */

export const Kubernetes = ({ locale, showHorizontalRule }) =>
  <li className='bx--list__item'>
    {msgs.get('welcome.box.one.bullet.one', locale)}
    <div className='content'> {/* TODO rename class? */}
      <Icon name='launch--glyph' fill='#d1d7f4' description={msgs.get('svg.description.launch', locale)} />
      <a href='https://kubernetes.io/docs/concepts/overview/what-is-kubernetes/' className='bx--link' target='kubernetes' aria-describedby='launchWindow'>{msgs.get('welcome.box.one.bullet.one.link', locale)}</a>
    </div>
    {showHorizontalRule && <div className='horizontal-rule' />}
  </li>

export const Catalog = ({ locale, showHorizontalRule }) =>
  <li className='bx--list__item'>
    {msgs.get('welcome.box.one.bullet.two', locale)}
    <div className='content'>
      <a href='/catalog' className='bx--link'>{msgs.get('welcome.box.one.bullet.two.link.catalog', locale)}</a>
      <span className='divider'>|</span>
      <a href='/catalog/instances' className='bx--link'>{msgs.get('welcome.box.one.bullet.two.link.helm', locale)}</a>
    </div>
    {showHorizontalRule && <div className='horizontal-rule' />}
  </li>

// TODO: update doc link
export const Clusters = ({ locale, hideVerticalRule }) =>
  <li className={`bx--list__item${hideVerticalRule ? ' no-vertical-rule' : ''}`}>
    {msgs.get('welcome.box.two.bullet.one', locale)}
    <div className='content'>
      <Icon name='launch--glyph' fill='#3d70b2' description={msgs.get('svg.description.launch', locale)} />
      <a href={'https://www.ibm.com/support/knowledgecenter/SSBS6K_3.1.0/mcm/manage_cluster/add_remove_cluster.html'} target="_cluster" className='bx--link' aria-describedby='launchWindow'>{msgs.get('welcome.box.two.bullet.one.link', locale)}</a>
    </div>
  </li>

export const HelmRepo = ({ locale, hideVerticalRule }) =>
  <li className={`bx--list__item${hideVerticalRule ? ' no-vertical-rule' : ''}`}>
    {msgs.get('welcome.box.two.bullet.two', locale)}
    <div className='content'><a href={'/catalog'} className='bx--link'>{msgs.get('welcome.box.two.bullet.two.link', locale)}</a></div>
  </li>

export const Application = ({ locale, hideVerticalRule }) =>
  <li className={`bx--list__item${hideVerticalRule ? ' no-vertical-rule' : ''}`}>
    {msgs.get('welcome.box.two.bullet.three', locale)}
    <div className='content'><Link to={`${config.contextPath}/applications`} className='bx--link'>{msgs.get('welcome.box.two.bullet.three.link', locale)}</Link></div>
  </li>

export const Compliance = ({ locale, hideVerticalRule }) =>
  <li className={`bx--list__item${hideVerticalRule ? ' no-vertical-rule' : ''}`}>
    {msgs.get('welcome.box.two.bullet.four', locale)}
    <div className='content'><Link to={`${config.contextPath}/policies`} className='bx--link'>{msgs.get('welcome.box.two.bullet.four.link', locale)}</Link></div>
  </li>

export const Users = ({ locale, hideVerticalRule }) =>
  <li className={`bx--list__item${hideVerticalRule ? ' no-vertical-rule' : ''}`}>
    {msgs.get('welcome.box.two.bullet.five', locale)}
    <div className='content'><a href={'/console/manage/identity-access'} className='bx--link'>{msgs.get('welcome.box.two.bullet.five.link', locale)}</a></div>
  </li>
