/** *****************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2017, 2019. All Rights Reserved.
 *
 * US Government Users Restricted Rights - Use, duplication or disclosure
 * restricted by GSA ADP Schedule Contract with IBM Corp.
 *******************************************************************************/
// Copyright (c) 2020 Red Hat, Inc.
// Copyright Contributors to the Open Cluster Management project
'use strict'

import _ from 'lodash'
import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import msgs from '../../../nls/platform.properties'
import apolloClient from '../../../lib/client/apollo-client'
import { UPDATE_ACTION_MODAL } from '../../apollo-client/queries/StateQueries'
import { SEARCH_QUERY_RELATED } from '../../apollo-client/queries/SearchQueries'
import { canCallAction } from '../../../lib/client/access-helper'
import {
  forceResourceReload,
  receiveDelResource,
  clearSuccessFinished,
  getQueryStringForResource
} from '../../actions/common'
import { RESOURCE_TYPES } from '../../../lib/shared/constants'
import resources from '../../../lib/shared/resources'
import { withLocale } from '../../providers/LocaleProvider'
import { AcmModal, AcmLoadingPage, AcmAlert } from '@stolostron/ui-components'
import { Checkbox, Button, ModalVariant } from '@patternfly/react-core'
import { ExclamationTriangleIcon } from '@patternfly/react-icons'

resources(() => {
  require('../../../scss/modal.scss')
})

class RemoveResourceModal extends React.Component {
  constructor(props) {
    super(props)
    this.client = apolloClient.getClient()
    this.state = {
      canRemove: false,
      name: '',
      errors: undefined,
      warnings: undefined,
      loading: true,
      selected: [],
      shared: [],
      removeAppResources: false,
      removeAppSetResources: false,
      appSetPlacement: '',
      appSetsSharingPlacement: []
    }
  }

  UNSAFE_componentWillMount() {
    if (this.props.data) {
      const { data, label } = this.props
      const { name, namespace } = data
      const kind = data.kind
      const apiVersion = _.get(data, 'apiVersion', '')
      const [group, version] = apiVersion.split('/')
      canCallAction(kind, 'delete', namespace, group, version).then(
        response => {
          const allowed = _.get(response, 'data.userAccess.allowed')
          this.setState({
            canRemove: allowed,
            errors: allowed
              ? undefined
              : msgs.get('table.actions.remove.unauthorized', this.props.locale)
          })

          if (
            (label.label === 'modal.remove-queryapplications.label' ||
              label.label === 'modal.remove-querysubscriptions.label' ||
              label.label === 'modal.remove-queryplacementrules.label' ||
              label.label === 'modal.remove-querychannels.label') &&
            allowed
          ) {
            this.getChildResources(name, namespace)
          }

          if (
            label.label === 'modal.remove-queryapplicationset.label' &&
            allowed
          ) {
            // get appset data from console-api
            this.getApplicationSetData(name, namespace)
          }
        }
      )

      this.setState({
        name: data.name
      })
    }
  }

  getApplicationSetData = (name, namespace) => {
    apolloClient
      .getApplicationSetRelatedResources({ name, namespace })
      .then(response => {
        const placement = _.get(
          response,
          'data.applicationSetRelatedResources.appSetPlacement'
        )
        const placementSharingResources = _.get(
          response,
          'data.applicationSetRelatedResources.appSetsSharingPlacement'
        )
        this.setState({
          appSetPlacement: placement,
          appSetsSharingPlacement: placementSharingResources,
          loading: false,
          selected: [
            {
              name: placement,
              kind: 'Placement',
              namespace,
              apiVersion: 'cluster.open-cluster-management.io/v1alpha1'
            }
          ]
        })
      })
  };

  getChildResources = (name, namespace) => {
    try {
      const { resourceType, locale } = this.props
      const { canRemove } = this.state
      if (resourceType.name === 'QueryApplications' && canRemove) {
        // Get application resources
        apolloClient.getApplication({ name, namespace }).then(response => {
          // Warning for application deployed by another application
          const hostingSubAnnotation =
            _.get(response, 'data.application.metadata.annotations') !==
            undefined
              ? _.get(response, 'data.application.metadata.annotations')[
                'apps.open-cluster-management.io/hosting-subscription'
              ]
              : undefined
          if (hostingSubAnnotation) {
            const subName = hostingSubAnnotation.split('/')[1]
            this.setState({
              warnings: msgs.get(
                'table.actions.remove.child.application',
                [subName],
                locale
              ),
              loading: false
            })
            return
          }
          const children = []
          const sharedChildren = []
          const removableSubs = []
          const removableSubNames = []
          const placementrules = []
          const subscriptions =
            _.get(response, 'data.application.subscriptions', []) || []
          Promise.all(
            subscriptions.map(async subscription => {
              const subName = _.get(subscription, 'metadata.name', '')
              const subNamespace = _.get(
                subscription,
                'metadata.namespace',
                ''
              )
              // For each subscription, get related applications
              const related = await fetchRelated(
                RESOURCE_TYPES.HCM_SUBSCRIPTIONS,
                subName,
                subNamespace
              )
              // If subscription is used only by this application, it is removable
              const siblingApps = usedByOtherApps(related, name, namespace)
              if (siblingApps.length === 0) {
                removableSubs.push(subscription)
                removableSubNames.push(subName)
                const subChildResources = getSubChildResources(
                  subName,
                  subNamespace,
                  related
                )
                children.push({
                  id: `subscriptions-${subNamespace}-${subName}`,
                  name: subscription.metadata.name,
                  namespace: subscription.metadata.namespace,
                  kind: subscription.kind,
                  apiVersion: subscription.apiVersion,
                  label: `${subName} [Subscription]`,
                  subChildResources: subChildResources
                })
              } else {
                sharedChildren.push({
                  id: `subscriptions-${subNamespace}-${subName}`,
                  label: `${subName} [Subscription]`,
                  siblingApps: siblingApps
                })
              }
            })
          ).then(() => {
            // For each removable subscription, go through its rules
            removableSubs.forEach(subscription => {
              _.map(_.get(subscription, 'rules', []), curr => {
                const currName = curr.metadata.name
                const currNamespace = curr.metadata.namespace
                placementrules.push({
                  id: `rules-${currNamespace}-${currName}`,
                  name: currName,
                  namespace: currNamespace,
                  kind: curr.kind,
                  apiVersion: curr.apiVersion,
                  label: `${currName} [PlacementRule]`,
                  type: RESOURCE_TYPES.HCM_PLACEMENT_RULES
                })
              })
            })
            Promise.all(
              _.uniqBy(placementrules, 'id').map(async rule => {
                // For each rule, get related subscriptions
                const related = await fetchRelated(
                  rule.type,
                  rule.name,
                  rule.namespace
                )
                // Rule is removable if it's used only by removable subscriptions
                const siblingSubs = usedByOtherSubs(
                  related,
                  removableSubNames,
                  namespace
                )
                if (siblingSubs.length === 0) {
                  children.push(rule)
                } else {
                  sharedChildren.push({
                    id: rule.id,
                    label: rule.label,
                    siblingSubs: siblingSubs
                  })
                }
              })
            ).then(() => {
              this.setState({
                selected: children,
                shared: sharedChildren,
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
    } catch (err) {
      this.setState({
        loading: false
      })
    }
  };

  toggleRemoveAppResources = () => {
    const checked = this.state.removeAppResources
    this.setState({ removeAppResources: !checked })
  };

  toggleRemoveAppSetResources = () => {
    const checked = this.state.removeAppSetResources
    this.setState({ removeAppSetResources: !checked })
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
            apiVersion: '',
            itemGroup: []
          }
        }
      })
    }
  }

  handleSubmit() {
    const { locale, data } = this.props
    const { selected, removeAppResources, removeAppSetResources } = this.state
    const removeResource =
      data.kind.toLowerCase() === 'application'
        ? removeAppResources
        : removeAppSetResources

    this.setState({
      loading: true
    })
    // Remove previous success message if any
    this.props.clearSuccessFinished()
    if (!data.name) {
      this.setState({
        errors: msgs.get('modal.errors.querying.resource', locale)
      })
    } else {
      apolloClient
        .remove({
          apiVersion: data.apiVersion,
          kind: data.kind,
          name: data.name,
          namespace: data.namespace,
          childResources: removeResource ? selected : []
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

  modalLoading = () => {
    return (
      <div>
        <AcmLoadingPage />
      </div>
    )
  };

  getItalicSpan = text => {
    return `<span class="italic-font">${text}</span>`
  };

  renderSharedResources = () => {
    const { shared } = this.state
    const { locale } = this.props
    return shared.length > 0 ? (
      <div className="shared-resource-content">
        <div>
          <ExclamationTriangleIcon />
        </div>
        <div>
          <p>{msgs.get('modal.remove.application.shared.resources', locale)}</p>
          <div>
            <ul>
              {shared.map(child => {
                const siblingResources =
                  child.siblingApps || child.siblingSubs || []
                return (
                  <div className="sibling-resource-content" key={child.id}>
                    <li>
                      {child.label}
                      {siblingResources.length > 0 && (
                        <span>
                          <span className="italic-font">
                            &nbsp;{msgs.get(
                            'modal.remove.application.sibling.resources',
                            locale
                          )}&nbsp;
                          </span>
                          {siblingResources.join(', ')}
                        </span>
                      )}
                    </li>
                  </div>
                )
              })}
            </ul>
          </div>
        </div>
      </div>
    ) : null
  };

  renderConfirmCheckbox(
    name,
    appTypeMsg,
    checkEventHandler,
    isChecked,
    locale
  ) {
    return (
      <React.Fragment>
        <div className="remove-app-modal-content-text">
          <p
            dangerouslySetInnerHTML={{
              __html: `
            ${msgs.get(
                'modal.remove.application.confirm',
                [name, this.getItalicSpan(msgs.get(appTypeMsg, locale))],
                locale
              )}
            `
            }}
          />
        </div>
        <div className="remove-app-modal-content-data">
          <Checkbox
            id={'remove-app-resources'}
            isChecked={isChecked}
            onChange={checkEventHandler}
            label={msgs.get(appTypeMsg, locale)}
          />
        </div>
      </React.Fragment>
    )
  }

  modalBody = (name, label, locale) => {
    const { selected } = this.state
    if (label.label === 'modal.remove-queryapplications.label') {
      return selected.length > 0 ? (
        <div className="remove-app-modal-content">
          {this.renderConfirmCheckbox(
            name,
            'modal.remove.application.resources',
            this.toggleRemoveAppResources,
            this.state.removeAppResources,
            locale
          )}
          <div>
            <ul>
              {selected.map(child => {
                return (
                  <div className="remove-app-modal-content-data" key={child.id}>
                    <li>
                      {child.label}
                      {child.subChildResources &&
                        child.subChildResources.length > 0 && (
                          <div className="sub-child-resource-content">
                            <div>
                              <ExclamationTriangleIcon />
                            </div>
                            <div>
                              <p>
                                {msgs.get(
                                  'modal.remove.application.child.resources',
                                  locale
                                )}
                              </p>
                              <p>{child.subChildResources.join(', ')}</p>
                            </div>
                          </div>
                      )}
                    </li>
                  </div>
                )
              })}
            </ul>
          </div>
          {this.renderSharedResources()}
        </div>
      ) : (
        <div className="remove-app-modal-content">
          {msgs.get('modal.remove.confirm', locale)}
          {this.renderSharedResources()}
        </div>
      )
    } else if (label.label === 'modal.remove-queryapplicationset.label') {
      const { data = {} } = this.props
      const { itemGroup = [] } = data
      const { appSetPlacement, appSetsSharingPlacement = [] } = this.state

      return (
        itemGroup.length > 0 && (
          <div className="remove-app-modal-content">
            <div className="remove-app-modal-content-text">
              <p
                dangerouslySetInnerHTML={{
                  __html: `${msgs.get(
                    'modal.remove.applicationset.confirm',
                    locale
                  )}`
                }}
              />
            </div>
            <div>
              <ul>
                {itemGroup.map(app => {
                  return (
                    <div
                      className="remove-app-modal-content-data"
                      key={app._uid}
                    >
                      <li>{app.name}</li>
                    </div>
                  )
                })}
              </ul>
            </div>
            <br />
            {this.renderAppSetSharedResources(
              name,
              appSetPlacement,
              appSetsSharingPlacement,
              locale
            )}
          </div>
        )
      )
    } else {
      return msgs.get('modal.remove.confirm', locale)
    }
  };

  renderAppSetSharedResources(
    name,
    appSetPlacement,
    appSetsSharingPlacement,
    locale
  ) {
    return appSetsSharingPlacement.length > 0 ? (
      <div className="shared-resource-content">
        <div>
          <ExclamationTriangleIcon />
        </div>
        <div>
          <p>
            {msgs.get(
              'modal.remove.applicationset.shared.resources',
              [appSetPlacement],
              locale
            )}
          </p>
          <div>
            <ul>
              {appSetsSharingPlacement.map(appSet => {
                return (
                  <div className="sibling-resource-content" key={appSet}>
                    <li>{appSet}</li>
                  </div>
                )
              })}
            </ul>
          </div>
        </div>
      </div>
    ) : (
      appSetPlacement && (
        <React.Fragment>
          {this.renderConfirmCheckbox(
            name,
            'modal.remove.applicationset.resources',
            this.toggleRemoveAppSetResources,
            this.state.removeAppSetResources,
            locale
          )}
          <div className="remove-app-modal-content-data">
            {appSetPlacement} [Placement]
          </div>
        </React.Fragment>
      )
    )
  }

  render() {
    const { label, locale, open } = this.props
    const { canRemove, name, loading, errors, warnings } = this.state
    const heading = msgs.get(label.heading, [name], locale)
    return (
      <div>
        <AcmModal
          id="remove-resource-modal"
          isOpen={open}
          title={heading}
          aria-label={heading}
          showClose={true}
          onClose={this.handleClose.bind(this)}
          variant={ModalVariant.large}
          titleIconVariant="warning"
          position="top"
          positionOffset="225px"
          actions={[
            <Button
              key="confirm"
              variant="danger"
              isDisabled={!canRemove || loading}
              onClick={this.handleSubmit.bind(this)}
            >
              {msgs.get(label.primaryBtn, locale)}
            </Button>,
            <Button
              key="cancel"
              variant="link"
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
            {warnings !== undefined ? (
              <AcmAlert
                variant="warning"
                variantLabel=""
                title={warnings}
                isInline
              />
            ) : null}
          </div>
          {loading ? this.modalLoading() : this.modalBody(name, label, locale)}
        </AcmModal>
      </div>
    )
  }
}

export const fetchRelated = async (resourceType, name, namespace) => {
  try {
    const query = getQueryStringForResource(resourceType.name, name, namespace)
    const response = await apolloClient.search(SEARCH_QUERY_RELATED, {
      input: [query]
    })
    return _.get(response, 'data.searchResult[0].related') || []
  } catch (err) {
    return []
  }
}

export const usedByOtherApps = (relatedItems, appName, appNamespace) => {
  const relatedApps = _.get(
    relatedItems.find(r => r.kind === 'application'),
    'items',
    []
  )
  return _.uniqBy(relatedApps, '_uid')
    .filter(
      r =>
        !r._hostingSubscription && // Filter out applications deployed by a subscription
        (r.name !== appName || r.namespace !== appNamespace)
    )
    .map(r => `${r.name} [Application]`)
    .sort()
}

export const getSubChildResources = (
  resourceName,
  resourceNamespace,
  relatedItems
) => {
  const CHILD_RESOURCE_TYPES = [
    'Application',
    'Subscription',
    'PlacementRule',
    'Channel'
  ]
  const localSuffix = '-local'
  const children = []
  CHILD_RESOURCE_TYPES.forEach(type => {
    const related = _.get(
      relatedItems.find(r => r.kind === type.toLowerCase()),
      'items',
      []
    )
    const childItems = _.uniqBy(related, '_uid')
      .filter(
        i =>
          (i._hostingSubscription === `${resourceNamespace}/${resourceName}` ||
            i._hostingSubscription ===
              `${resourceNamespace}/${resourceName}${localSuffix}`) &&
          // Only include resources on the local cluster
          i.cluster === 'local-cluster' &&
          // Do not include the -local subscription
          (type !== 'Subscription' ||
            i.namespace !== resourceNamespace ||
            i.name !== `${resourceName}${localSuffix}`)
      )
      .map(i => i.name)
      .sort()
      .map(n => `${n} [${type}]`)
    children.push(...childItems)
  })
  return children
}

export const usedByOtherSubs = (
  relatedItems,
  removableSubNames,
  appNamespace
) => {
  const relatedSubs = _.get(
    relatedItems.find(r => r.kind === 'subscription'),
    'items',
    []
  )
  return _.uniqBy(relatedSubs, '_uid')
    .filter(
      r =>
        r._hubClusterResource &&
        (r.namespace !== appNamespace || !removableSubNames.includes(r.name))
    )
    .map(r => `${r.name} [Subscription]`)
    .sort()
}

RemoveResourceModal.propTypes = {
  clearSuccessFinished: PropTypes.func,
  data: PropTypes.object,
  forceRefresh: PropTypes.func,
  label: PropTypes.shape({
    heading: PropTypes.string,
    label: PropTypes.string,
    primaryBtn: PropTypes.string
  }),
  locale: PropTypes.string,
  open: PropTypes.bool,
  resourceType: PropTypes.object,
  submitDeleteSuccess: PropTypes.func,
  type: PropTypes.string
}

const mapStateToProps = () => ({})

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    forceRefresh: () => dispatch(forceResourceReload(ownProps.resourceType)),
    clearSuccessFinished: () => clearSuccessFinished(dispatch),
    submitDeleteSuccess: () => {
      // need to handle appsets as apps since there's no actual appset entries on the apps table
      const resourceType =
        ownProps.resourceType.name === 'QueryApplicationset'
          ? RESOURCE_TYPES.QUERY_APPLICATIONS
          : ownProps.resourceType
      dispatch(receiveDelResource(ownProps.data, resourceType, {}))
    }
  }
}

export default withLocale(
  connect(mapStateToProps, mapDispatchToProps)(RemoveResourceModal)
)
