/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2018. All Rights Reserved.
 *
 * Note to U.S. Government Users Restricted Rights:
 * Use, duplication or disclosure restricted by GSA ADP Schedule
 * Contract with IBM Corp.
 *******************************************************************************/

import React from 'react'
import PropTypes from 'prop-types'
import { reduce, get } from 'lodash'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import Notification from '../components/common/Notification'
import msgs from '../../nls/platform.properties'
import { RESOURCE_TYPES } from '../../lib/shared/constants'
import { fetchResources } from '../actions/common'

import * as Actions from '../actions/catalog'

import {
  ComposedModal,
  Dropdown,
  DropdownItem,
  FormLabel,
  Loading,
  ModalBody,
  ModalFooter,
  ModalHeader,
  MultiSelect,
  TextInput
} from 'carbon-components-react'

const identity = elem => elem

const Spacer = ({ children }) => <div style={{ width: '100%', marginTop: '2em' }}>{children}</div>
Spacer.propTypes = {
  children: PropTypes.node
}

class ChartsModal extends React.PureComponent {
  static propTypes = {
    actions: PropTypes.shape({
      catalogInstallFailure: PropTypes.func.isRequired,
      catalogInstallValidationFailure: PropTypes.func.isRequired,
      catalogReleaseInstall: PropTypes.func.isRequired,
      catalogResourceSelect: PropTypes.func.isRequired,
      fetchResources: PropTypes.func.isRequired,
    }),
    catalogInstallFailure: PropTypes.bool,
    catalogInstallLoading: PropTypes.bool,
    catalogInstallValidationFailure: PropTypes.bool,
    clusterToNamespaces: PropTypes.object,
    clusters: PropTypes.array,
    handleSubmit: PropTypes.func.isRequired,
    modalHeading: PropTypes.string,
    namespaces: PropTypes.array,
    selection: PropTypes.shape({
      name: PropTypes.string,
      repoName: PropTypes.string,
      url: PropTypes.string,
    }),
  }

  constructor() {
    super()

    this.handleClose = this.handleClose.bind(this)
    this.handleClusterSelect = this.handleClusterSelect.bind(this)
    this.handleInputChange = this.handleInputChange.bind(this)
    this.handleTargetNum = this.handleTargetNum.bind(this)
    this.handleNamespaceSelect = this.handleNamespaceSelect.bind(this)
    this.handleOpen = this.handleOpen.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  componentWillMount() {
    this.props.actions.fetchResources(RESOURCE_TYPES.HCM_NAMESPACES)
  }

  /* FIXME: Please fix disabled eslint rules when making changes to this file. */
  /* eslint-disable react/no-unused-state */
  state = {
    clusters: [],
    namespace: '',
    selected: [],
    targetNum: '',
    releaseName: '',
  }

  handleOpen() {
    this.setState({
      clusters: [],
      namespace: '',
      selected: [],
      targetNum:'',
      releaseName: '',
    })
  }

  handleClose() {
    this.setState({
      clusters: [],
      namespace: '',
      selected: [],
      targetNum: '',
      releaseName: '',
    })

    this.props.actions.catalogResourceSelect({})
    // Reset error status
    this.props.actions.catalogInstallValidationFailure(false)
    this.props.actions.catalogInstallFailure(false)
  }

  handleInputChange(e) {
    this.setState({ releaseName: e.target.value })
  }

  handleTargetNum(e) {
    this.setState({ targetNum: e.target.value })
  }

  handleClusterSelect(value) {
    // If we choose an optimal deselect everything else
    const optimal = value.selectedItems.find(item => item.includes('Optimal') && !this.state.selected.includes(item))
    if (optimal) {
      const selected = [this.props.clusters.find(cluster => optimal === cluster)]
      return this.setState({ selected, isOptimal: true, clusters: selected, key: Math.random() })
    }

    const clusters = value.selectedItems.filter(item => !item.includes('Optimal'))
    this.setState({ selected: clusters, isOptimal: false, clusters, key: Math.random() })
  }

  handleNamespaceSelect(value) {
    this.setState({ namespace: value.itemText })
  }

  handleSubmit() {
    const { selection, clusterToNamespaces } = this.props
    const { selected, clusters, targetNum, namespace } = this.state
    let DstClusters

    const optimal = selected.find(cluster => cluster.includes('Optimal'))
    if (optimal) {
      DstClusters = {
        Labels: null,
        Names: ['*'],
        SortBy: optimal.split(' ')[2],
        Status: ['healthy'],
        TargetNum: parseInt(targetNum),
      }
    } else {
      const isInvalid = clusters.some(cluster => !clusterToNamespaces[cluster].includes(namespace))

      if (isInvalid) {
        return this.props.actions.catalogInstallValidationFailure(true)
      }

      DstClusters = {
        Names: clusters,
        Labels: null,
        Status: ['healthy'],
      }
    }

    this.props.actions.catalogReleaseInstall({
      ChartName: selection.name,
      DstClusters,
      Namespace: this.state.namespace,
      ReleaseName: this.state.releaseName,
      RepoName: selection.repoName,
      URL: selection.url,
    })

    this.handleClose()
    this.props.handleSubmit()
  }

  render() {
    // eslint-disable-next-line
    console.log(this.state, this.props.clusters)
    return (
      <ComposedModal
        id='nav-modal'
        className='modal nav-modal'
        role='region'
        aria-label={this.props.modalHeading}
        open={this.props.selection.name || this.props.catalogInstallLoading}>
        <ModalHeader buttonOnClick={this.handleOpen}>
          <div>
            <p className='bx--modal-header__label'>{msgs.get('catalog.installChart', this.context.locale)}</p>
            <p className='bx--modal-header__heading'>{this.props.selection.name}</p>
          </div>
        </ModalHeader>
        <ModalBody className='chartmodal--body'>
          {this.props.catalogInstallLoading &&
            <Loading withOverlay className='content-spinner' />}
          {this.props.catalogInstallFailure &&
            <Notification allowClose type="error" description={msgs.get('catalog.installError')} />}
          {this.props.catalogInstallValidationFailure &&
            <Notification allowClose type="error" description={msgs.get('catalog.installValidationError')} />}
          <TextInput
            id='helm-release-name'
            value={this.state.releaseName}
            onChange={this.handleInputChange}
            labelText={msgs.get('catalog.installReleaseName', this.context.locale)} />

          <FormLabel className='chartmodal--body__label'>
            {msgs.get('catalog.installTargetClusters', this.context.locale)}
          </FormLabel>
          <MultiSelect.Filterable
            onChange={this.handleClusterSelect}
            placeholder=''
            initialSelectedItems={this.state.selected}
            key={this.state.key || 'select'}
            itemToString={identity}
            items={this.props.clusters} />

          {this.state.isOptimal &&
            <Spacer>
              <TextInput
                id='helm-release-target-num'
                value={this.state.targetNum}
                onChange={this.handleTargetNum}
                labelText={msgs.get('catalog.installTargetNum', this.context.locale)} />
            </Spacer>
          }

          <FormLabel className='chartmodal--body__label'>
            {msgs.get('catalog.installTargetNamespaces', this.context.locale)}
          </FormLabel>
          <Dropdown
            ariaLabel={msgs.get('catalog.installTargetNamespaces', this.context.locale)}
            onChange={this.handleNamespaceSelect}
            selectedText={this.state.namespace}>
            {this.props.namespaces.map(namespace => (
              <DropdownItem
                itemText={namespace}
                value={namespace}
                key={namespace} />
            ))}
          </Dropdown>
        </ModalBody>
        <ModalFooter
          primaryButtonDisabled={!this.state.releaseName || !this.state.namespace || !this.props.clusters.length}
          primaryButtonText={msgs.get('catalog.install', this.context.locale)}
          secondaryButtonText={msgs.get('catalog.cancel', this.context.locale)}
          onRequestClose={this.handleClose}
          onRequestSubmit={this.handleSubmit} />
      </ComposedModal>
    )
  }
}

const mapStateToProps = state => {
  const {
    catalogInstallValidationFailure,
    catalogInstallFailure,
    catalogInstallLoading,
    selection
  } = state.catalog

  const namespaceList = get(state, `${RESOURCE_TYPES.HCM_NAMESPACES.list}.items`, [])

  // TODO: Create a selector - 05/01/18 14:50:44 sidney.wijngaarde1@ibm.com
  const { clusters, namespaces, clusterToNamespaces } = reduce(namespaceList,
    (ret, { name: namespace, cluster }) => {
      // Dedupe namespaces and clusters
      ret.namespaces[namespace] = { label: namespace }
      ret.clusters[cluster] = { label: cluster }

      if (ret.clusterToNamespaces[cluster]) {
        ret.clusterToNamespaces[cluster].push(namespace)
      } else {
        ret.clusterToNamespaces[cluster] = [namespace]
      }

      return ret
    }, { clusters: {}, namespaces: {}, clusterToNamespaces: { testing: [] } })

  return {
    catalogInstallFailure,
    catalogInstallValidationFailure,
    catalogInstallLoading,
    clusterToNamespaces,
    clusters: ['Optimal for load', 'Optimal for cpu', 'Optimal for memory'].concat(Object.keys(clusters)),
    namespaces: Object.keys(namespaces),
    selection,
  }
}

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators({ ...Actions, fetchResources }, dispatch),
})

export default connect(mapStateToProps, mapDispatchToProps)(ChartsModal)
