/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2019. All Rights Reserved.
 *
 * Note to U.S. Government Users Restricted Rights:
 * Use, duplication or disclosure restricted by GSA ADP Schedule
 * Contract with IBM Corp.
 * Copyright (c) 2020 Red Hat, Inc.
 *******************************************************************************/

import React from 'react'
import resources from '../../../lib/shared/resources'
import msgs from '../../../nls/platform.properties'
import { Query } from 'react-apollo'
import { getApplication } from '../../../lib/client/queries'
import PropTypes from 'prop-types'
import Page from '../common/Page'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import {
  createApplication,
  updateApplication,
  clearCreateStatus
} from '../../actions/application'
import { updateSecondaryHeader } from '../../actions/common'
import { canCreateActionAllNamespaces } from '../../../lib/client/access-helper'
import { TemplateEditor } from '../TemplateEditor'
import { controlData } from './controlData/ControlData'
import createTemplate from './templates/template.hbs'
import { getApplicationResources } from './transformers/transform-data-to-resources'

import _ from 'lodash'

const Portals = Object.freeze({
  editBtn: 'edit-button-portal-id',
  cancelBtn: 'cancel-button-portal-id',
  createBtn: 'create-button-portal-id'
})

resources(() => {
  require('./style.scss')
})

class ApplicationCreationPage extends React.Component {
  static propTypes = {
    cleanReqStatus: PropTypes.func,
    editApplication: PropTypes.object,
    handleCreateApplication: PropTypes.func,
    handleUpdateApplication: PropTypes.func,
    history: PropTypes.object,
    location: PropTypes.object,
    match: PropTypes.object,
    mutateErrorMsgs: PropTypes.array,
    mutateStatus: PropTypes.string,
    savedFormData: PropTypes.oneOfType([
      PropTypes.object,
      PropTypes.arrayOf(PropTypes.object)
    ]),
    secondaryHeaderProps: PropTypes.object,
    updateFormState: PropTypes.func,
    updateSecondaryHeader: PropTypes.func
  };

  static getDerivedStateFromProps(props, state) {
    const { importMerged } = state
    if (!importMerged) {
      const mergedData = _.cloneDeep(controlData)
      return { controlData: mergedData }
    }
    return null
  }

  constructor(props) {
    super(props)
    this.state = {
      controlData: null,
      hasPermissions: false
    }
    this.getBreadcrumbs = this.getBreadcrumbs.bind(this)
  }

  getBreadcrumbs() {
    const { location } = this.props,
          urlSegments = location.pathname.split('/')
    return [
      {
        label: msgs.get('resource.applications', this.context.locale),
        url: urlSegments.slice(0, Math.min(3, urlSegments.length)).join('/')
      }
    ]
  }

  componentDidMount() {
    const {
      secondaryHeaderProps = {},
      editApplication = {},
      cleanReqStatus,
      match
    } = this.props
    const name = match && match.params && match.params.name
    const {
      selectedAppName = name,
      breadcrumbs = this.getBreadcrumbs()
    } = editApplication
    const { locale } = this.context
    if (cleanReqStatus) {
      this.props.cleanReqStatus()
    }
    const portals = [
      {
        id: 'edit-button-portal-id',
        kind: 'portal',
        title: true
      },
      {
        id: 'cancel-button-portal-id',
        kind: 'portal'
      },
      {
        id: 'create-button-portal-id',
        kind: 'portal'
      }
    ]
    const tooltip = '' //{ text: msgs.get('tooltip.text.createCluster', locale), link: TOOLTIP_LINKS.CREATE_CLUSTER }
    const title =
      selectedAppName || msgs.get(secondaryHeaderProps.title, locale)
    this.props.updateSecondaryHeader(
      title,
      secondaryHeaderProps.tabs,
      breadcrumbs,
      portals,
      null,
      tooltip
    )

    canCreateActionAllNamespaces('applications', 'create', 'app.k8s.io').then(
      response => {
        const hasPermissions = _.get(response, 'data.userAccessAnyNamespaces')
        this.setState({ hasPermissions })
      }
    )
  }

  componentDidUpdate() {
    const { mutateStatus, cleanReqStatus, history } = this.props
    if (mutateStatus && mutateStatus === 'DONE') {
      setTimeout(() => {
        if (cleanReqStatus) {
          this.props.cleanReqStatus()
        }
        // redirect to cluster details pages
        history.push(
          `/multicloud/applications/${this.applicationNamespace}/${
            this.applicationName
          }`
        )
      }, 3000)
    } else if (mutateStatus && mutateStatus === 'ERROR') {
      this.props.cleanReqStatus()
    }
  }

  render() {
    const { editApplication } = this.props
    if (editApplication) {
      // if editing an existing app, grab it first
      const { selectedAppName, selectedAppNamespace } = editApplication
      return (
        <Page>
          <Query
            query={getApplication}
            variables={{
              name: selectedAppName,
              namespace: selectedAppNamespace
            }}
          >
            {result => {
              const { loading } = result
              const { data = {} } = result
              const { application } = data
              const errored = application ? false : true
              const error = application ? null : result.error
              if (!loading && error) {
                const errorName = result.error.graphQLErrors[0].name
                  ? result.error.graphQLErrors[0].name
                  : error.name
                error.name = errorName
              }
              const fetchControl = {
                resources: getApplicationResources(application),
                isLoaded: !loading,
                isFailed: errored,
                error: error
              }
              return this.renderEditor(fetchControl)
            }}
          </Query>
        </Page>
      )
    }
    return <Page>{this.renderEditor()}</Page>
  }

  renderEditor(fetchControl) {
    const { locale } = this.context
    const { controlData: cd, hasPermissions } = this.state
    const {
      mutateStatus,
      mutateErrorMsgs,
      updateFormState,
      savedFormData,
      history
    } = this.props
    const createControl = {
      hasPermissions,
      createResource: this.handleCreate.bind(this),
      cancelCreate: this.handleCancel.bind(this),
      creationStatus: mutateStatus,
      creationMsg: mutateErrorMsgs
    }
    return (
      <TemplateEditor
        type={'application'}
        title={msgs.get('creation.app.yaml', locale)}
        template={createTemplate}
        controlData={cd}
        portals={Portals}
        fetchControl={fetchControl}
        createControl={createControl}
        locale={locale}
        updateFormState={updateFormState}
        savedFormData={savedFormData}
        history={history}
      />
    )
  }

  handleCreate = resourceJSON => {
    if (resourceJSON) {
      const {
        editApplication,
        handleCreateApplication,
        handleUpdateApplication
      } = this.props
      if (editApplication) {
        handleUpdateApplication(resourceJSON)
      } else {
        handleCreateApplication(resourceJSON)
      }
      const map = _.keyBy(resourceJSON, 'kind')
      this.applicationNamespace = _.get(map, 'Application.metadata.namespace')
      this.applicationName = _.get(map, 'Application.metadata.name')
    }
  };

  handleCancel = () => {
    this.props.history.push('/multicloud/applications')
  };
}

ApplicationCreationPage.contextTypes = {
  locale: PropTypes.string
}

const mapDispatchToProps = dispatch => {
  return {
    cleanReqStatus: () => dispatch(clearCreateStatus()),
    handleCreateApplication: json => dispatch(createApplication(json)),
    handleUpdateApplication: json => dispatch(updateApplication(json)),
    updateSecondaryHeader: (
      title,
      tabs,
      breadcrumbItems,
      ports,
      actions,
      tooltip
    ) =>
      dispatch(
        updateSecondaryHeader(
          title,
          tabs,
          breadcrumbItems,
          ports,
          actions,
          tooltip
        )
      )
  }
}

const mapStateToProps = state => {
  const { applicationPageResources } = state
  const { mutateStatus, mutateErrorMsgs } = applicationPageResources || {}
  return {
    mutateStatus,
    mutateErrorMsgs
  }
}

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(ApplicationCreationPage)
)
