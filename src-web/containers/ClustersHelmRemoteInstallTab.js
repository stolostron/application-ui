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
  Loading,
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
const removeQuotes = (str = '') => str ? str.slice(1, -1) : ''

class ChartInstall extends React.Component {
  static propTypes = {
    actions: PropTypes.shape({
      catalogReleaseInstall: PropTypes.func.isRequired,
      fetchResources: PropTypes.func.isRequired,
      updateSecondaryHeader: PropTypes.func.isRequired,
    }),
    catalogInstallFailure: PropTypes.bool,
    catalogInstallLoading: PropTypes.bool,
    chartName: PropTypes.string,
    chartURL: PropTypes.string,
    chartValues: PropTypes.string,
    chartVersion: PropTypes.string,
    clusterToNamespace: PropTypes.obj,
    clusters: PropTypes.arrayOf(PropTypes.string),
    history: PropTypes.shape({
      push: PropTypes.func.isRequired
    }),
    repoName: PropTypes.string,
  }

  constructor() {
    super()
    this.handleClusterSelect = this.handleClusterSelect.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  state = { targetClusters: [] }

  componentWillMount() {
    const { actions, chartName, chartURL, chartVersion, repoName } = this.props

    // User came to the page directly
    // Send them to the catalog to select a chart
    if (!chartURL) {
      return window.location.replace(`${window.location.origin}/catalog/`)
    }

    this.overviewUrl = `${window.location.origin}/catalog/catalogdetails/${repoName}/${chartName}/${chartVersion}?redirecttoconfigure=true`

    const secondaryHeaderText = `${chartName} V ${chartVersion}`
    const secondaryHeaderBreadcrumbs = [{ label: msgs.get('breadcrumb.viewall', this.context.locale), url: '/catalog/' }]

    actions.updateSecondaryHeader(secondaryHeaderText, null, secondaryHeaderBreadcrumbs)
    actions.fetchResources(RESOURCE_TYPES.HCM_CLUSTERS)
  }

  handleClusterSelect(value) {
    // Key forces multiselect to rerender
    this.setState({ targetClusters: value.selectedItems })
  }

  handleSubmit() {
    const { chartURL, chartValues, clusterToNamespace, history } = this.props
    const { targetClusters } = this.state

    this.props.actions.catalogReleaseInstall({
      chartURL,
      destinationClusters: targetClusters.map(cluster => ({
        name: cluster,
        namespace: clusterToNamespace[cluster]
      })),
      namespace: chartValues.selectedNamespace,
      releaseName: chartValues.selectedReleaseName,
      values: sessionStorage.getItem('values'),
    }, history)
  }

  render() {
    const { catalogInstallFailure, catalogInstallLoading } = this.props

    return (
      <Page>
        {catalogInstallFailure &&
          <Notification allowClose type="error" description={msgs.get('catalog.installError', this.context.locale)} />}

        {catalogInstallLoading &&
          <Loading withOverlay={false} className='content-spinner' />}

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
  const { catalogInstallFailure, catalogInstallLoading } = state.catalog
  const clusterList = get(state, `${RESOURCE_TYPES.HCM_CLUSTERS.list}.items`, [])

  const { clusters, clusterToNamespace } = reduce(clusterList,
    (accum, { name, namespace }) => {
      accum.clusters[name] = { label: name }
      accum.clusterToNamespace[name] = namespace

      return accum
    }, { clusters: {}, clusterToNamespace: {} })


  // Remove Surrounding Quotes
  const chartName = removeQuotes(sessionStorage.getItem('chartName'))
  const chartVersion = removeQuotes(sessionStorage.getItem('version'))
  const repoName = removeQuotes(sessionStorage.getItem('repoName'))

  // Parse JSON Strings
  const chartURLs = JSON.parse(sessionStorage.getItem('tarFiles')) || []
  const chartValues = JSON.parse(sessionStorage.getItem('values')) || ''

  return {
    catalogInstallFailure,
    catalogInstallLoading,
    chartName,
    chartURL: chartURLs[0],
    chartValues,
    chartVersion,
    clusters: Object.keys(clusters),
    clusterToNamespace,
    repoName,
  }
}

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators({ ...Actions, fetchResources, updateSecondaryHeader }, dispatch),
})

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(ChartInstall))
