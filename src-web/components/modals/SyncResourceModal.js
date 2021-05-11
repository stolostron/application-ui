// Copyright (c) 2021 Red Hat, Inc.
// Copyright Contributors to the Open Cluster Management project
'use strict'

import _ from 'lodash'
import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import msgs from '../../../nls/platform.properties'
import apolloClient from '../../../lib/client/apollo-client'
import { UPDATE_ACTION_MODAL } from '../../apollo-client/queries/StateQueries'
import { canCreateActionAllNamespaces } from '../../../lib/client/access-helper'
import { clearSuccessFinished } from '../../actions/common'
import resources from '../../../lib/shared/resources'
import { withLocale } from '../../providers/LocaleProvider'
import {
  AcmModal,
  AcmLoadingPage,
  AcmAlert
} from '@open-cluster-management/ui-components'
import { Button, ModalVariant } from '@patternfly/react-core'

resources(() => {
  require('../../../scss/modal.scss')
})

// remove the kube stuff
const kube = [
  'managedFields',
  'creationTimestamp',
  'status',
  'uid',
  'deployables',
  'livenessProbe',
  'resourceVersion',
  'generation'
]

class SyncResourceModal extends React.Component {
  constructor(props) {
    super(props)
    this.client = apolloClient.getClient()
    this.state = {
      canSync: false,
      name: '',
      errors: undefined,
      loading: true,
      applicationResources: []
    }
  }

  UNSAFE_componentWillMount() {
    if (this.props.data) {
      const { data } = this.props
      canCreateActionAllNamespaces('applications', 'create', 'app.k8s.io').then(
        response => {
          const allowed = _.get(response, 'data.userAccessAnyNamespaces')
          this.setState({
            canSync: allowed,
            errors: allowed
              ? undefined
              : msgs.get('table.actions.sync.unauthorized', this.props.locale)
          })
          this.getApplication(data.name, data.namespace)
        }
      )
      this.setState({
        name: data.name
      })
    }
  }

  getApplication = (name, namespace) => {
    try {
      const { resourceType, locale } = this.props
      const { canSync } = this.state
      if (resourceType.name === 'HCMApplication' && canSync) {
        // Get application resources
        apolloClient.getApplication({ name, namespace }).then(result => {
          const { data = {} } = result
          const { application } = data
          const error = application ? null : result.error
          if (error) {
            this.setState({
              loading: false,
              errors: msgs.get('modal.errors.querying.resource', locale)
            })
          } else {
            const appResources =
              this.getApplicationResources(application) || []
            this.setState({
              applicationResources: appResources,
              loading: false
            })
          }
        })
      } else {
        this.setState({
          loading: false
        })
      }
    } catch (err) {
      this.setState({
        loading: false
      })
    }
  };

  getApplicationResources = application => {
    if (application) {
      const { app, subscriptions } = _.cloneDeep(application)
      const appResources = []
      // add application
      appResources.push(this.filterKube(app))
      // add subscriptions
      if (Array.isArray(subscriptions)) {
        subscriptions.forEach(subscription => {
          delete subscription.channels
          delete subscription.rules
          // delete the kube stuff
          delete subscription.status
          appResources.push(this.filterKube(subscription))
        })
      }
      return appResources
    }
    return null
  };

  filterKube = resource => {
    const metadata = _.get(resource, 'metadata', {})
    kube.forEach(key => {
      if (_.has(metadata, key)) {
        delete metadata[key]
      }
    })
    return resource
  };

  handleClose() {
    const { type } = this.props
    if (this.client) {
      this.client.mutate({
        mutation: UPDATE_ACTION_MODAL,
        variables: {
          __typename: 'actionModal',
          open: false,
          type: type,
          resourceType: {
            __typename: 'resourceType',
            name: '',
            list: ''
          },
          data: {
            __typename: 'ModalData',
            name: '',
            namespace: '',
            clusterName: '',
            selfLink: '',
            _uid: '',
            kind: '',
            apiVersion: ''
          }
        }
      })
    }
  }

  handleSubmit() {
    const { locale, data } = this.props
    const { applicationResources } = this.state
    this.setState({
      loading: true
    })
    this.props.clearSuccessFinished()
    if (!data.name || !applicationResources) {
      this.setState({
        errors: msgs.get('modal.errors.querying.resource', locale)
      })
    } else {
      applicationResources.push({ deleteLinks: [] })
      _.filter(
        applicationResources,
        res => _.get(res, 'kind', '') === 'Subscription'
      ).forEach(sub => {
        const annotations = _.get(sub, 'metadata.annotations', {})
        annotations[
          'apps.open-cluster-management.io/manual-refresh-time'
        ] = new Date().toString()
      })
      apolloClient.updateApplication(applicationResources).then(result => {
        const errors =
          _.get(result, 'data.updateApplication.errors') ||
          _.get(result, 'errors')
        if (errors && errors.length > 0) {
          this.setState({
            loading: false,
            errors: errors[0].message
          })
        } else {
          this.handleClose()
        }
      })
    }
  }

  modalLoading = () => {
    return (
      <div>
        <AcmLoadingPage />
      </div>
    )
  };

  modalBody = (name, label, locale) => {
    return msgs.get('modal.sync.confirm', [name], locale)
  };

  render() {
    const { label, locale, open } = this.props
    const { canSync, name, loading, errors } = this.state
    const heading = msgs.get(label.heading, locale)
    return (
      <div>
        <AcmModal
          id="sync-resource-modal"
          isOpen={open}
          title={heading}
          aria-label={heading}
          showClose={true}
          onClose={this.handleClose.bind(this)}
          variant={ModalVariant.medium}
          position="top"
          positionOffset="225px"
          actions={[
            <Button
              key="confirm"
              variant="primary"
              isDisabled={!canSync || loading}
              onClick={this.handleSubmit.bind(this)}
            >
              {msgs.get(label.primaryBtn, locale)}
            </Button>,
            <Button
              key="cancel"
              variant="secondary"
              onClick={this.handleClose.bind(this)}
            >
              {msgs.get('modal.button.cancel', locale)}
            </Button>
          ]}
        >
          <div className="remove-app-modal-alert">
            {errors !== undefined ? (
              <AcmAlert
                variant="danger"
                variantLabel=""
                title={errors}
                isInline
                noClose
              />
            ) : null}
          </div>
          {loading ? this.modalLoading() : this.modalBody(name, label, locale)}
        </AcmModal>
      </div>
    )
  }
}

SyncResourceModal.propTypes = {
  clearSuccessFinished: PropTypes.func,
  data: PropTypes.object,
  label: PropTypes.shape({
    heading: PropTypes.string,
    label: PropTypes.string,
    primaryBtn: PropTypes.string
  }),
  locale: PropTypes.string,
  open: PropTypes.bool,
  resourceType: PropTypes.object,
  type: PropTypes.string
}

const mapStateToProps = () => ({})

const mapDispatchToProps = dispatch => {
  return {
    clearSuccessFinished: () => clearSuccessFinished(dispatch)
  }
}

export default withLocale(
  connect(mapStateToProps, mapDispatchToProps)(SyncResourceModal)
)
