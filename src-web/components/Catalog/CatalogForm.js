/* eslint-disable */
/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2018. All Rights Reserved.
 *
 * Note to U.S. Government Users Restricted Rights:
 * Use, duplication or disclosure restricted by GSA ADP Schedule
 * Contract with IBM Corp.
 *******************************************************************************/

import React from 'react'
import { Link } from 'react-router-dom'
import { callOnEnter } from '../../shared/utils'

export const Resource = ({ onSelectChart, name, repoName }, { locale }) => (
  <Link
    id={`resourceLink_${name}`}
    role="button"
    className="category-border"
    to=''
    onKeyPress={callOnEnter(onSelectChart)}
  >
    <div className="resource-tile__wrapper">
      <div className="content-wrapper">
        <div className="resource-tile__text">
          <p className="text__headline--catalog">{name}</p>
          <div className="tile__tag-bubble-wrapper">
            <div className="tile__tag-bubble">
              {repoName}
            </div>
          </div>
        </div>
      </div>
    </div>
  </Link>
)

export const ResourceWrapper = ({ children, description }) => (
  <div className="detail-main-content__container catalog-page">
    <div className="category-section">
      <div className="category-description">{description}</div>
    </div>
    <div className="category-section">{children}</div>
  </div>
)

export const CatalogSearchFiltersWrapper = ({ children, ...props }) => (
  <div className="searchDiv">
    <div
      data-search
      className="bx--search bx--search--lg"
      role="search"
      {...props}
    >
      {children}
    </div>
  </div>
)

export const CatalogFormWrapper = ({ children, ...props }) => (
  <div className="catalogDetails detail-page-pieces catalog-section" {...props}>
    <div className="detail-page-pieces catalog-section">
      <div className="catalogDiv">{children}</div>
    </div>
  </div>
)
