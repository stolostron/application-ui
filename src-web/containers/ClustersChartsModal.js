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

class ChartsModal extends React.PureComponent {
  static propTypes = {
    actions: PropTypes.shape({
      catalogInstallFailure: PropTypes.func.isRequired,
      catalogInstallValidationFailure: PropTypes.func.isRequired,
      catalogReleaseInstall: PropTypes.func.isRequired,
      catalogResourceSelect: PropTypes.func.isRequired,
      fetchResources: PropTypes.func.isRequired,
    }),
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

  state = {
    clusters: [],
    namespace: '',
    targetNum: '',
    targetClusters: [],
    releaseName: '',
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps && nextProps.clusters !== this.props.clusters) {
      this.setState({
        clusters: [
          msgs.get('catalog.optimalLoad', this.context.locale),
          msgs.get('catalog.optimalCPU', this.context.locale),
          msgs.get('catalog.optimalMemory', this.context.locale),
        ].concat(nextProps.clusters)
      })
    }
  }

  handleOpen() {
    this.setState({
      clusters: [],
      namespace: '',
      targetNum:'',
      targetClusters: [],
      releaseName: '',
    })
  }

  handleClose() {
    this.setState({
      clusters: [],
      namespace: '',
      targetNum: '',
      targetClusters: [],
      releaseName: '',
    })

    this.props.actions.catalogResourceSelect({})
    // Reset error status
    this.props.actions.catalogInstallValidationFailure(false)
  }

  handleInputChange(e) {
    this.setState({ releaseName: e.target.value })
  }

  handleTargetNum(e) {
    this.setState({ targetNum: e.target.value })
  }

  handleClusterSelect(value) {
    const { clusters, targetClusters } = this.state

    const isOptimal = value.selectedItems.find(item => this.optimalMap(item) && !targetClusters.includes(item))

    const selection = isOptimal
      // If we choose an optimal deselect everything else
      ? [clusters.find(cluster => isOptimal === cluster)]
      // Else remove optimal selections
      : value.selectedItems.filter(item => !this.optimalMap(item))

    this.setState({ targetClusters: selection, isOptimal, key: Math.random() })
  }

  handleNamespaceSelect(value) {
    this.setState({ namespace: value.itemText })
  }

  optimalMap(nls) {
    const { locale } = this.context
    switch (nls) {
    case msgs.get('catalog.optimalLoad', locale):
      return 'load'

    case msgs.get('catalog.optimalMemory', locale):
      return 'memory'

    case msgs.get('catalog.optimalCPU', locale):
      return 'cpu'
    }
  }

  async handleSubmit() {
    const { selection, clusterToNamespaces } = this.props
    const { targetClusters, isOptimal, targetNum, namespace } = this.state
    let DstClusters

    if (isOptimal) {
      const [optimal] = targetClusters

      DstClusters = {
        Labels: null,
        Names: ['*'],
        SortBy: this.optimalMap(optimal),
        Status: ['healthy'],
        TargetNum: parseInt(targetNum),
      }
    } else {
      const isInvalid = targetClusters.some(target => !clusterToNamespaces[target].includes(namespace))

      if (isInvalid) {
        return this.props.actions.catalogInstallValidationFailure(true)
      }

      DstClusters = {
        Names: targetClusters,
        Labels: null,
        Status: ['healthy'],
      }
    }

    try {
      await this.props.actions.catalogReleaseInstall({
        ChartName: selection.name,
        DstClusters,
        Namespace: this.state.namespace,
        ReleaseName: this.state.releaseName,
        RepoName: selection.repoName,
        URL: selection.url,
      })

      this.handleClose()
      this.props.handleSubmit()
    } catch (err) {
      this.handleClose()
    }
  }

  render() {
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
            initialSelectedItems={this.state.targetClusters}
            key={this.state.key || 'select'}
            itemToString={identity}
            items={this.state.clusters} />

          {this.state.isOptimal &&
          <div className='chartmodal--body__spacer'>
            <TextInput
              id='helm-release-target-num'
              value={this.state.targetNum}
              onChange={this.handleTargetNum}
              labelText={msgs.get('catalog.installTargetNum', this.context.locale)} />
          </div>
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
    catalogInstallValidationFailure,
    catalogInstallLoading,
    clusterToNamespaces,
    clusters: Object.keys(clusters),
    namespaces: Object.keys(namespaces),
    selection,
  }
}

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators({ ...Actions, fetchResources }, dispatch),
})

export default connect(mapStateToProps, mapDispatchToProps)(ChartsModal)
