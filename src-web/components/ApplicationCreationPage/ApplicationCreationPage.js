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
import PropTypes from 'prop-types'
import Page from '../common/Page'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import {
  createApplication,
  clearCreateStatus
} from '../../actions/application'
import { updateSecondaryHeader } from '../../actions/common'
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
    const breadcrumbs = this.getBreadcrumbs()
    const { secondaryHeaderProps, cleanReqStatus } = this.props
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
    this.props.updateSecondaryHeader(
      msgs.get(secondaryHeaderProps.title, locale),
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
    }
  }

  render() {
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
      <Page>
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
      </Page>
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
