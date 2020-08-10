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
import { RESOURCE_TYPES } from '../../../lib/shared/constants'
import {
  createApplication,
  clearCreateStatus
} from '../../actions/application'
import {
  updateSecondaryHeader,
  delResourceSuccessFinished
} from '../../actions/common'
import { TemplateEditor } from '../TemplateEditor'
import { controlData } from './controlData/ControlData'
import createTemplate from './templates/template.hbs'

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
    deleteSuccessFinished: PropTypes.func,
    editApplication: PropTypes.object,
    handleCreateApplication: PropTypes.func,
    history: PropTypes.object,
    location: PropTypes.object,
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
      controlData: null
    }
    this.getBreadcrumbs = this.getBreadcrumbs.bind(this)
  }

  getBreadcrumbs() {
    const { location } = this.props,
          urlSegments = location.pathname.split('/')
    return [
      {
        label: msgs.get('resource.applications', this.context.locale),
        url: urlSegments.slice(0, urlSegments.length - 1).join('/')
      }
    ]
  }

  componentDidMount() {
    const {
      secondaryHeaderProps = {},
      editApplication = {},
      cleanReqStatus
    } = this.props
    const {
      selectedAppName,
      breadcrumbs = this.getBreadcrumbs()
    } = editApplication
    const { locale } = this.context
    if (cleanReqStatus) {
      this.props.cleanReqStatus()
    }
    this.props.deleteSuccessFinished(RESOURCE_TYPES.QUERY_APPLICATIONS)
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
      tooltip
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
              //const errored = application ? false : true
              const error = application ? null : result.error
              if (!loading && error) {
                const errorName = result.error.graphQLErrors[0].name
                  ? result.error.graphQLErrors[0].name
                  : error.name
                error.name = errorName
              }

              return this.renderEditor()
            }}
          </Query>
        </Page>
      )
    }
    return <Page>{this.renderEditor()}</Page>
  }

  renderEditor() {
    const { locale } = this.context
    const {
      mutateStatus,
      mutateErrorMsgs,
      updateFormState,
      savedFormData,
      history
    } = this.props
    const createControl = {
      createResource: this.handleCreate.bind(this),
      cancelCreate: this.handleCancel.bind(this),
      creationStatus: mutateStatus,
      creationMsg: mutateErrorMsgs
    }
    const { controlData: cd, fetchControl } = this.state
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
      const { handleCreateApplication } = this.props
      handleCreateApplication(resourceJSON)
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
    deleteSuccessFinished: resourceType =>
      dispatch(delResourceSuccessFinished(resourceType)),
    handleCreateApplication: json => dispatch(createApplication(json)),
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
