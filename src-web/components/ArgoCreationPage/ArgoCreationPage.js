/** *****************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2019. All Rights Reserved.
 *
 * Note to U.S. Government Users Restricted Rights:
 * Use, duplication or disclosure restricted by GSA ADP Schedule
 * Contract with IBM Corp.
 ****************************************************************************** */
// Copyright (c) 2020 Red Hat, Inc.
// Copyright Contributors to the Open Cluster Management project
import React from 'react'
import { PageSection } from '@patternfly/react-core'
import resources from '../../../lib/shared/resources'
import msgs from '../../../nls/platform.properties'
import { Query } from 'react-apollo'
import { getArgoApplication } from '../../../lib/client/queries'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import {
  createApplication,
  updateApplication,
  clearCreateStatus
} from '../../actions/application'
import { controlData } from './controlData/controlData'
import createTemplate from './templates/template.hbs'
import { updateSecondaryHeader } from '../../actions/common'
import { canCreateActionAllNamespaces } from '../../../lib/client/access-helper'
import config from '../../../lib/shared/config'
import _ from 'lodash'

// include monaco editor
import TemplateEditor from 'temptifly'
import 'temptifly/dist/styles.css'
import MonacoEditor from 'react-monaco-editor'
import 'monaco-editor/esm/vs/editor/editor.all.js'
import 'monaco-editor/esm/vs/editor/standalone/browser/quickOpen/quickCommand.js'
import 'monaco-editor/esm/vs/basic-languages/yaml/yaml.contribution.js'
import { global_BackgroundColor_dark_100 as editorBackground } from '@patternfly/react-tokens'
import { getApplicationResources } from './transformers/transform-data-to-resources'
import classNames from 'classnames'

if (window.monaco) {
  window.monaco.editor.defineTheme('console', {
    base: 'vs-dark',
    inherit: true,
    rules: [
      // avoid pf tokens for `rules` since tokens are opaque strings that might not be hex values
      { token: 'number', foreground: 'ace12e' },
      { token: 'type', foreground: '73bcf7' },
      { token: 'string', foreground: 'f0ab00' },
      { token: 'keyword', foreground: 'cbc0ff' }
    ],
    colors: {
      'editor.background': editorBackground.value,
      'editorGutter.background': '#292e34', // no pf token defined
      'editorLineNumber.activeForeground': '#fff',
      'editorLineNumber.foreground': '#f0f0f0'
    }
  })
}

window.MonacoEnvironment = {
  getWorkerUrl: function() {
    return `${config.contextPath}/editor.worker.js`
  }
}

const Portals = Object.freeze({
  editBtn: 'edit-button-portal-id',
  cancelBtn: 'cancel-button-portal-id',
  createBtn: 'create-button-portal-id'
})

resources(() => {
  require('./style.scss')
})

class ArgoCreationPage extends React.Component {
  static propTypes = {
    cleanReqStatus: PropTypes.func,
    handleCreateApplication: PropTypes.func,
    handleUpdateApplication: PropTypes.func,
    history: PropTypes.object,
    location: PropTypes.object,
    match: PropTypes.object,
    mutateErrorMsgs: PropTypes.array,
    mutateStatus: PropTypes.string,
    secondaryHeaderProps: PropTypes.object,
    updateSecondaryHeader: PropTypes.func
  };

  constructor(props) {
    super(props)
    this.state = {
      hasPermissions: false
    }
    this.getBreadcrumbs = this.getBreadcrumbs.bind(this)
  }

  getEditApplication() {
    const { match: { params } } = this.props
    if (params.name && params.namespace) {
      return {
        selectedAppName: params.name,
        selectedAppNamespace: params.namespace
      }
    }
    return null
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
    const { secondaryHeaderProps = {}, cleanReqStatus } = this.props
    const { selectedAppName } = this.getEditApplication() || {}
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
    const label = secondaryHeaderProps.label
      ? msgs.get(secondaryHeaderProps.label, locale)
      : undefined
    const labelColor = secondaryHeaderProps.labelColor
      ? msgs.get(secondaryHeaderProps.labelColor, locale)
      : undefined
    this.props.updateSecondaryHeader(
      title,
      secondaryHeaderProps.tabs,
      this.getBreadcrumbs(),
      portals,
      null,
      tooltip,
      label,
      labelColor
    )

    canCreateActionAllNamespaces(
      'applicationset',
      'create',
      'argoproj.io'
    ).then(response => {
      const hasPermissions = _.get(response, 'data.userAccessAnyNamespaces')
      this.setState({ hasPermissions })
    })
  }

  componentDidUpdate() {
    const { mutateStatus, cleanReqStatus, history } = this.props
    if (mutateStatus && mutateStatus === 'DONE') {
      setTimeout(() => {
        if (cleanReqStatus) {
          this.props.cleanReqStatus()
        }
        // redirect to table page
        // known limitation that the appset wouldn't be able to find the clusterName in create
        history.push(`${config.contextPath}`)
      }, 3000)
    }
  }

  render() {
    const editApplication = this.getEditApplication()
    if (editApplication) {
      // if editing an existing app, grab it first
      const { selectedAppName, selectedAppNamespace } = editApplication
      return (
        <Query
          query={getArgoApplication}
          variables={{
            name: selectedAppName,
            namespace: selectedAppNamespace,
            apiversion: 'argoproj.io/v1alpha1'
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
      )
    }
    return this.renderEditor()
  }

  renderEditor(fetchControl) {
    const editApplication = this.getEditApplication()
    const { locale } = this.context
    const { hasPermissions } = this.state
    const { mutateStatus, mutateErrorMsgs } = this.props
    const createControl = {
      hasPermissions,
      createResource: this.handleCreate.bind(this),
      cancelCreate: this.handleCancel.bind(this),
      creationStatus: mutateStatus,
      creationMsg: mutateErrorMsgs
    }
    const i18n = (key, arg2) => {
      return msgs.get(key, arg2, locale)
    }
    return (
      controlData && (
        <PageSection
          className={classNames({ editApplication, 'pf-c-content': true })}
          style={{ padding: 0 }}
          variant="light"
        >
          <TemplateEditor
            type={'argo'}
            title={msgs.get('creation.argo.yaml', locale)}
            template={createTemplate}
            controlData={controlData}
            monacoEditor={<MonacoEditor />}
            portals={Portals}
            fetchControl={fetchControl}
            createControl={createControl}
            i18n={i18n}
          />
        </PageSection>
      )
    )
  }

  handleCreate = resourceJSON => {
    if (resourceJSON) {
      const { handleCreateApplication, handleUpdateApplication } = this.props
      const editApplication = this.getEditApplication()
      if (editApplication) {
        resourceJSON.createResources.push({
          deleteLinks: [...resourceJSON.deleteResources]
        })
        handleUpdateApplication(resourceJSON.createResources)
      } else {
        handleCreateApplication(resourceJSON.createResources)
      }
      const map = _.keyBy(resourceJSON.createResources, 'kind')
      this.applicationNamespace = _.get(
        map,
        'ApplicationSet.metadata.namespace'
      )
      this.applicationName =
        _.get(map, 'ApplicationSet.metadata.name') + '-in-cluster'
      this.apiVersion = _.get(map, 'ApplicationSet.apiVersion')
    }
  };

  handleCancel = () => {
    const { location, history } = this.props
    const editApplication = this.getEditApplication()
    if (location.state && location.state.cancelBack) {
      // Came from the "Create application" button, or "Edit application" table action; go back
      history.goBack()
    } else if (editApplication && location.state && location.state.tabChange) {
      // Came from changing tabs from "Overview" to "Editor"; change tabs back
      history.replace(location.state.tabChange)
    } else {
      // Otherwise, navigate to applications
      history.push(config.contextPath)
    }
  };
}

ArgoCreationPage.contextTypes = {
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
      tooltip,
      label,
      labelColor
    ) =>
      dispatch(
        updateSecondaryHeader(
          title,
          tabs,
          breadcrumbItems,
          ports,
          actions,
          tooltip,
          label,
          labelColor
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
  connect(mapStateToProps, mapDispatchToProps)(ArgoCreationPage)
)
