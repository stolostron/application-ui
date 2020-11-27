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
import ResourceDetails from './ResourceDetails'
import ResourceList from './ResourceList'
import getResourceDefinitions from '../../definitions'
import { makeGetVisibleTableItemsSelector } from '../../reducers/common'
import Page from './Page'

const WrappedResourceList = props => (
  <div>
    <ResourceList
      {...props}
      tabs={props.secondaryHeaderProps.tabs}
      title={props.secondaryHeaderProps.title}
      mainButton={props.secondaryHeaderProps.mainButton}
    >
      {props.buttons}
    </ResourceList>
  </div>
)

const WrappedResourceDetails = props => (
  <ResourceDetails
    resourceType={props.resourceType}
    staticResourceData={props.staticResourceData}
    tabs={props.secondaryHeaderProps.tabs}
    mainButton={props.secondaryHeaderProps.mainButton}
    routes={props.routes}
    getVisibleResources={props.getVisibleResources}
  >
    {props.modules}
  </ResourceDetails>
)

const typedResourcePageList = (resourceType, buttons, routes, modules) => {
  const staticResourceData = getResourceDefinitions(resourceType)
  const getVisibleResources = makeGetVisibleTableItemsSelector(resourceType)

  // eslint-disable-next-line react/display-name
  return class extends React.PureComponent {
    constructor(props) {
      super(props)
    }

    render() {
      return (
        <Page>
          <WrappedResourceList
            {...this.props}
            routes={routes}
            resourceType={resourceType}
            staticResourceData={staticResourceData}
            getVisibleResources={getVisibleResources}
            buttons={buttons}
            modules={modules}
          />
        </Page>
      )
    }
  }
}

const typedResourcePageDetails = (resourceType, buttons, routes, modules) => {
  const staticResourceData = getResourceDefinitions(resourceType)
  const getVisibleResources = makeGetVisibleTableItemsSelector(resourceType)

  // eslint-disable-next-line react/display-name
  return class extends React.PureComponent {
    constructor(props) {
      super(props)
    }

    render() {
      return (
        <Page>
          <WrappedResourceDetails
            {...this.props}
            routes={routes}
            resourceType={resourceType}
            staticResourceData={staticResourceData}
            getVisibleResources={getVisibleResources}
            buttons={buttons}
            modules={modules}
          />
        </Page>
      )
    }
  }
}

WrappedResourceList.propTypes = {
  buttons: PropTypes.array,
  secondaryHeaderProps: PropTypes.object,
  staticResourceData: PropTypes.object
}

WrappedResourceDetails.propTypes = {
  getVisibleResources: PropTypes.func,
  modules: PropTypes.array,
  resourceType: PropTypes.object,
  routes: PropTypes.array,
  secondaryHeaderProps: PropTypes.object,
  staticResourceData: PropTypes.object
}

export { typedResourcePageList, typedResourcePageDetails }
