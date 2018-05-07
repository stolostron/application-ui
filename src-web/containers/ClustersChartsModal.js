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
import { connect } from 'react-redux'
import msgs from '../../nls/platform.properties'
import { RESOURCE_TYPES } from '../../lib/shared/constants'
import { fetchResources } from '../actions/common'
import { catalogResourceSelect, catalogReleaseInstall } from '../actions/catalog'
import {
  ComposedModal,
  Dropdown,
  DropdownItem,
  FormLabel,
  MultiSelect,
  ModalBody,
  ModalFooter,
  ModalHeader,
  TextInput
} from 'carbon-components-react'

const identity = elem => elem

class ChartsModal extends React.PureComponent {
  static propTypes = {
    catalogReleaseInstall: PropTypes.func.isRequired,
    catalogResourceSelect: PropTypes.func.isRequired,
    clusters: PropTypes.array,
    fetchResources: PropTypes.func.isRequired,
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
    this.handleNamespaceSelect = this.handleNamespaceSelect.bind(this)
    this.handleOpen = this.handleOpen.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  componentWillMount() {
    this.props.fetchResources()
  }

  /* FIXME: Please fix disabled eslint rules when making changes to this file. */
  /* eslint-disable react/no-unused-state */
  state = {
    clusters: [],
    namespace: '',
    releaseName: '',
  }

  handleOpen() {
    this.setState({
      clusters: [],
      namespace: '',
      releaseName: '',
    })
  }

  handleClose() {
    this.setState({
      clusters: [],
      namespace: '',
      releaseName: '',
    })

    this.props.catalogResourceSelect({})
  }

  handleInputChange(e) {
    this.setState({ releaseName: e.target.value })
  }

  handleClusterSelect(value) {
    this.setState({ clusters: value.selectedItems })
  }

  handleNamespaceSelect(value) {
    this.setState({ namespace: value.itemText })
  }

  handleSubmit() {
    // TODO: Validation - 05/02/18 14:07:09 sidney.wijngaarde1@ibm.com
    this.props.catalogReleaseInstall({
      ChartName: this.props.selection.name,
      Namespace: this.state.namespace,
      ReleaseName: this.state.releaseName,
      RepoName: this.props.selection.repoName,
      URL: this.props.selection.url,
    })

    this.handleClose()
    this.props.handleSubmit()
  }

  render() {
    return (
      <ComposedModal
        id='nav-modal'
        className='modal nav-modal'
        role='region'
        aria-label={this.props.modalHeading}
        open={this.props.selection.name}>
        <ModalHeader buttonOnClick={this.handleOpen}>
          <div>
            <p className='bx--modal-header__label'>{msgs.get('catalog.installChart', this.context.locale)}</p>
            <p className='bx--modal-header__heading'>{this.props.selection.name}</p>
          </div>
        </ModalHeader>
        <ModalBody className='chartmodal--body'>
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
            itemToString={identity}
            items={this.props.clusters} />

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
    }, { clusters: {}, namespaces: {}, clusterToNamespaces: {} })

  return {
    clusters: Object.keys(clusters),
    namespaces: Object.keys(namespaces),
    clusterToNamespaces,
    selection: state.catalog.selection
  }
}

const mapDispatchToProps = dispatch => ({
  fetchResources: () => fetchResources(RESOURCE_TYPES.HCM_NAMESPACES)(dispatch),
  catalogReleaseInstall: fields => catalogReleaseInstall(fields)(dispatch),
  catalogResourceSelect: (fields) => dispatch(catalogResourceSelect(fields))
})

export default connect(mapStateToProps, mapDispatchToProps)(ChartsModal)
