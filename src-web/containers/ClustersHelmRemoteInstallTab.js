/** *****************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2018. All Rights Reserved.
 *
 * Note to U.S. Government Users Restricted Rights:
 * Use, duplication or disclosure restricted by GSA ADP Schedule
 * Contract with IBM Corp.
 ****************************************************************************** */

import React from 'react'
import PropTypes from 'prop-types'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { reduce, get } from 'lodash'
import {
  Button,
  Footer,
  FormLabel,
  MultiSelect,
} from 'carbon-components-react'

import { withRouter } from 'react-router-dom'
import msgs from '../../nls/platform.properties'
import Notification from '../components/common/Notification'
import { RESOURCE_TYPES } from '../../lib/shared/constants'
import { fetchResources, updateSecondaryHeader } from '../actions/common'
import Page from '../components/common/Page'
import '../../scss/remoteinstall.scss'
import * as Actions from '../actions/catalog'

const identity = elem => elem

class ChartInstall extends React.Component {
  static propTypes = {
    actions: PropTypes.shape({
      catalogReleaseInstall: PropTypes.func.isRequired,
      fetchResources: PropTypes.func.isRequired,
      updateSecondaryHeader: PropTypes.func.isRequired,
    }),
    catalogInstallFailure: PropTypes.bool,
    catalogInstallValidationFailure: PropTypes.bool,
    chartName: PropTypes.string,
    chartValues: PropTypes.string,
    chartVersion: PropTypes.string,
    clusters: PropTypes.arrayOf(PropTypes.string),
    history: PropTypes.shape({
      push: PropTypes.func.isRequired
    }),
  }

  constructor() {
    super()
    this.handleClusterSelect = this.handleClusterSelect.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  state = { targetClusters: [] }

  componentWillMount() {
    const { actions, chartName, chartVersion } = this.props
    if (!chartName || !chartVersion) {
      return window.location.replace(`${window.location.origin}/catalog/`)
    }

    // FIXME: https://github.ibm.com/IBMPrivateCloud/roadmap/issues/13181
    this.overviewUrl = `${window.location.origin}/catalog/catalogdetails/google/${chartName}/${chartVersion}`

    const secondaryHeaderText = `${chartName} V ${chartVersion}`
    const secondaryHeaderBreadcrumbs = [{ label: msgs.get('breadcrumb.viewall', this.context.locale), url: '/catalog/' }]

    actions.updateSecondaryHeader(secondaryHeaderText, null, secondaryHeaderBreadcrumbs)
    actions.fetchResources(RESOURCE_TYPES.HCM_NAMESPACES)
  }

  handleClusterSelect(value) {
    // Key forces multiselect to rerender
    this.setState({ targetClusters: value.selectedItems })
  }

  handleSubmit() {
    const { chartName, chartVersion, chartValues, history } = this.props
    const { targetClusters } = this.state

    this.props.actions.catalogReleaseInstall({
      chartName,
      chartVersion,
      chartValues,
      targetClusters
    }, history)
  }

  render() {
    const { catalogInstallFailure, catalogInstallValidationFailure } = this.props

    return (
      <Page>
        {catalogInstallValidationFailure &&
          <Notification allowClose type="error" description={msgs.get('catalog.installValidationError')} />}
        {catalogInstallFailure &&
          <Notification allowClose type="error" description={msgs.get('catalog.installError', this.context.locale)} />}
        <FormLabel>
          {msgs.get('catalog.installTargetClusters', this.context.locale)}
        </FormLabel>
        <MultiSelect.Filterable
          onChange={this.handleClusterSelect}
          placeholder=''
          initialSelectedItems={this.state.targetClusters}
          key={this.state.key || 'select'}
          itemToString={identity}
          items={this.props.clusters} />
        <Footer className='remoteinstall--footer'>
          <Button href={this.overviewUrl} kind='secondary'>{msgs.get('catalog.cancel')}</Button>
          <Button disabled={!this.state.targetClusters.length} onClick={this.handleSubmit}>{msgs.get('catalog.installChart')}</Button>
        </Footer>
      </Page>
    )
  }

}

const mapStateToProps = state => {
  const {
    catalogInstallFailure,
    catalogInstallLoading,
    catalogInstallValidationFailure,
  } = state.catalog

  const namespaceList = get(state, `${RESOURCE_TYPES.HCM_NAMESPACES.list}.items`, [])

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


  // Remove Surrounding Quotes
  const chartName = sessionStorage.getItem('chartName') ? sessionStorage.getItem('chartName').slice(1, -1) : ''
  const chartValues = JSON.parse(sessionStorage.getItem('values'))
  const chartVersion = sessionStorage.getItem('version') ? sessionStorage.getItem('version').slice(1, -1) : ''

  return {
    catalogInstallFailure,
    catalogInstallLoading,
    catalogInstallValidationFailure,
    chartName,
    chartValues,
    chartVersion,
    clusterToNamespaces,
    clusters: Object.keys(clusters),
    namespaces: Object.keys(namespaces),
  }
}

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators({ ...Actions, fetchResources, updateSecondaryHeader }, dispatch),
})

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(ChartInstall))
