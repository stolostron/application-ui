/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2017, 2019. All Rights Reserved.
 * Copyright (c) 2020 Red Hat, Inc.
 *
 * US Government Users Restricted Rights - Use, duplication or disclosure
 * restricted by GSA ADP Schedule Contract with IBM Corp.
 *******************************************************************************/
'use strict'

import _ from 'lodash'
import R from 'ramda'
import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import msgs from '../../../nls/platform.properties'
import apolloClient from '../../../lib/client/apollo-client'
import { UPDATE_ACTION_MODAL } from '../../apollo-client/queries/StateQueries'
import { SEARCH_QUERY_RELATED } from '../../apollo-client/queries/SearchQueries'
import {
  Checkbox,
  Modal,
  Loading,
  Notification
} from 'carbon-components-react'
import { canCallAction } from '../../../lib/client/access-helper'
import {
  forceResourceReload,
  receiveDelResource,
  delResourceSuccessFinished,
  mutateResourceSuccessFinished,
  getQueryStringForResource
} from '../../actions/common'
import { RESOURCE_TYPES } from '../../../lib/shared/constants'

class RemoveResourceModal extends React.Component {
  constructor(props) {
    super(props)
    this.client = apolloClient.getClient()
    this.state = {
      canRemove: false,
      name: '',
      cluster: '',
      selfLink: '',
      errors: undefined,
      loading: true,
      selected: [],
      removeAppResources: false
    }
  }

  componentWillMount() {
    if (this.props.data) {
      const { data } = this.props
      this.getChildResources(data.name, data.namespace, data.clusterName)
      const kind = data.selfLink.split('/')
      const apiGroup = kind[1] === 'apis' ? kind[2] : ''
      canCallAction(
        kind[kind.length - 2],
        'delete',
        data.namespace,
        apiGroup
      ).then(response => {
        const allowed = _.get(response, 'data.userAccess.allowed')
        this.setState({
          canRemove: allowed,
          errors: allowed
            ? undefined
            : msgs.get('table.actions.remove.unauthorized', this.context.locale)
        })
      })
      this.setState({
        name: data.name,
        cluster: data.clusterName,
        selfLink: data.selfLink
      })
    }
  }

  getChildResources = (name, namespace) => {
    const { resourceType } = this.props
    if (resourceType.name === 'HCMApplication') {
      // Get application resources
      apolloClient.getApplication({ name, namespace }).then(response => {
        const children = []
        const removableSubs = []
        const removableSubNames = []
        const subResources = []
        const subscriptions =
          _.get(response, 'data.application.subscriptions', []) || []
        Promise.all(
          subscriptions.map(async subscription => {
            const subName = subscription.metadata.name
            const subNamespace = subscription.metadata.namespace
            // For each subscription, get related applications
            const related = await this.fetchRelated(
              RESOURCE_TYPES.HCM_SUBSCRIPTIONS,
              subName,
              subNamespace
            )
            // If subscription is used only by this application, it is removable
            if (!this.usedByOtherApps(related)) {
              removableSubs.push(subscription)
              removableSubNames.push(subName)
              children.push({
                id: `subscriptions-${subNamespace}-${subName}`,
                selfLink: subscription.metadata.selfLink,
                label: `${subName} [Subscription]`
              })
            }
          })
        ).then(() => {
          const resourceKinds = [
            { kind: 'channels', label: '[Channel]' },
            { kind: 'rules', label: '[Rule]' }
          ]
          // For each removable subscription, go through its channels and rules
          removableSubs.forEach(subscription => {
            resourceKinds.forEach(res => {
              _.map(_.get(subscription, res.kind, []), curr => {
                const currName = curr.metadata.name
                const currNamespace = curr.metadata.namespace
                subResources.push({
                  id: `${res.kind}-${currNamespace}-${currName}`,
                  name: currName,
                  namespace: currNamespace,
                  selfLink: curr.metadata.selfLink,
                  label: `${currName} ${res.label}`,
                  type:
                    res.kind === 'rules'
                      ? RESOURCE_TYPES.HCM_PLACEMENT_RULES
                      : RESOURCE_TYPES.HCM_CHANNELS
                })
              })
            })
          })
          Promise.all(
            _.uniqBy(subResources, 'id').map(async resource => {
              // For each channel or rule, get related subscriptions
              const related = await this.fetchRelated(
                resource.type,
                resource.name,
                resource.namespace
              )
              // Channel or rule is removable if it's used only by removable subscriptions
              if (
                !this.usedByOtherSubs(related, removableSubNames, namespace)
              ) {
                children.push(resource)
              }
            })
          ).then(() => {
            this.setState({
              selected: children,
              loading: false
            })
          })
        })
      })
    } else {
      this.setState({
        loading: false
      })
    }
  };

  fetchRelated = async (resourceType, name, namespace) => {
    const query = getQueryStringForResource(resourceType.name, name, namespace)
    const response = await apolloClient.search(SEARCH_QUERY_RELATED, {
      input: [query]
    })
    const resource = response.errors
      ? []
      : _.get(response, 'data.searchResult[0]', [])

    return resource && resource.related ? resource.related : []
  };

  usedByOtherApps = related => {
    const isApp = n => n.kind.toLowerCase() === 'application'
    const apps = R.filter(isApp, related)
    const items = apps && apps.length === 1 ? apps[0].items : []
    return items && items.length === 1 ? false : true
  };

  usedByOtherSubs = (related, removableSubNames, appNamespace) => {
    const isSub = n => n.kind.toLowerCase() === 'subscription'
    const subs = R.filter(isSub, related)
    const items = subs && subs.length === 1 ? subs[0].items : []
    return items.filter(item => item._hubClusterResource).some(sub => {
      return (
        sub.namespace !== appNamespace || !removableSubNames.includes(sub.name)
      )
    })
  };

  toggleSelected = (i, target) => {
    this.setState(prevState => {
      const currState = prevState.selected
      const index = currState.findIndex(item => item.id === target)
      currState[index].selected = !currState[index].selected
      return currState
    })
  };

  toggleRemoveAppResources = () => {
    const checked = this.state.removeAppResources
    this.setState({ removeAppResources: !checked })
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
            kind: ''
          }
        }
      })
    }
  }

  handleSubmit() {
    const { selfLink, cluster, selected, removeAppResources } = this.state
    this.setState({
      loading: true
    })
    // Remove previous success message if any
    this.props.mutateSuccessFinished(RESOURCE_TYPES.HCM_CHANNELS)
    this.props.mutateSuccessFinished(RESOURCE_TYPES.HCM_SUBSCRIPTIONS)
    this.props.mutateSuccessFinished(RESOURCE_TYPES.HCM_PLACEMENT_RULES)
    this.props.mutateSuccessFinished(RESOURCE_TYPES.QUERY_APPLICATIONS)
    this.props.deleteSuccessFinished(RESOURCE_TYPES.HCM_CHANNELS)
    this.props.deleteSuccessFinished(RESOURCE_TYPES.HCM_SUBSCRIPTIONS)
    this.props.deleteSuccessFinished(RESOURCE_TYPES.HCM_PLACEMENT_RULES)
    this.props.deleteSuccessFinished(RESOURCE_TYPES.QUERY_APPLICATIONS)
    if (!selfLink) {
      this.setState({
        errors: msgs.get('modal.errors.querying.resource', this.context.locale)
      })
    } else {
      apolloClient
        .remove({
          cluster,
          selfLink,
          childResources: removeAppResources ? selected : []
        })
        .then(res => {
          if (res.errors) {
            this.setState({
              loading: false,
              errors: res.errors[0].message
            })
          } else {
            this.handleClose()
            this.props.submitDeleteSuccess()
            this.props.forceRefresh()
          }
        })
    }
  }

  modalBody = (name, label, locale) => {
    switch (label.label) {
    case 'modal.remove-hcmapplication.label':
      return this.state.selected.length > 0 ? (
        <div className="remove-app-modal-content">
          <div className="remove-app-modal-content-text">
            {msgs.get('modal.remove.application.confirm', [name], locale)}
          </div>
          <div className="remove-app-modal-content-data">
            <Checkbox
              id={'remove-app-resources'}
              checked={this.state.removeAppResources}
              onChange={this.toggleRemoveAppResources}
              labelText={msgs.get(
                'modal.remove.application.resources',
                [name],
                locale
              )}
              />
          </div>
          <div>
            {this.state.selected.map(child => {
              return (
                <div className="remove-app-modal-content-data" key={child.id}>
                  <Checkbox
                    id={child.id}
                    checked={this.state.removeAppResources}
                    disabled={true}
                    labelText={child.label}
                    aria-label={child.id}
                    />
                </div>
              )
            })}
          </div>
        </div>
      ) : (
        <p>{msgs.get('modal.remove.confirm', [name], locale)}</p>
      )
    default:
      return <p>{msgs.get('modal.remove.confirm', [name], locale)}</p>
    }
  };

  render() {
    const { label, locale, open } = this.props
    const { canRemove, name, loading, errors } = this.state
    const bodyLabel =
      msgs.get(label.label, locale) ||
      msgs.get('modal.remove.resource', locale)
    const heading = msgs.get(label.heading, locale)
    return (
      <div>
        {loading && <Loading />}
        <Modal
          danger
          id="remove-resource-modal"
          open={open}
          primaryButtonText={msgs.get(label.primaryBtn, locale)}
          secondaryButtonText={msgs.get('modal.button.cancel', locale)}
          modalLabel={bodyLabel}
          modalHeading={heading}
          onRequestClose={this.handleClose.bind(this)}
          onRequestSubmit={this.handleSubmit.bind(this)}
          role="region"
          aria-label={heading}
          primaryButtonDisabled={!canRemove}
        >
          <div>
            {errors !== undefined ? (
              <Notification kind="error" title="" subtitle={errors} />
            ) : null}
          </div>
          {this.modalBody(name, label, locale)}
        </Modal>
      </div>
    )
  }
}

RemoveResourceModal.propTypes = {
  data: PropTypes.object,
  deleteSuccessFinished: PropTypes.func,
  forceRefresh: PropTypes.func,
  label: PropTypes.shape({
    heading: PropTypes.string,
    label: PropTypes.string
  }),
  locale: PropTypes.string,
  mutateSuccessFinished: PropTypes.func,
  open: PropTypes.bool,
  resourceType: PropTypes.object,
  submitDeleteSuccess: PropTypes.func,
  type: PropTypes.string
}

const mapStateToProps = () => ({})

const mapDispatchToProps = (dispatch, ownProps) => {
  let resourceType = ownProps.resourceType
  if (
    resourceType &&
    resourceType.name === RESOURCE_TYPES.HCM_APPLICATIONS.name
  ) {
    resourceType = RESOURCE_TYPES.QUERY_APPLICATIONS
  }

  return {
    forceRefresh: () => dispatch(forceResourceReload(resourceType)),
    deleteSuccessFinished: resType =>
      dispatch(delResourceSuccessFinished(resType)),
    mutateSuccessFinished: resType =>
      dispatch(mutateResourceSuccessFinished(resType)),
    submitDeleteSuccess: () =>
      dispatch(receiveDelResource(ownProps.data, resourceType, {}))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(
  RemoveResourceModal
)
