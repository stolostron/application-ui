/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2018. All Rights Reserved.
 *
 * Note to U.S. Government Users Restricted Rights:
 * Use, duplication or disclosure restricted by GSA ADP Schedule
 * Contract with IBM Corp.
 *******************************************************************************/

import React from 'react'
import { bindActionCreators } from 'redux'
import { Redirect } from 'react-router'
import { connect } from 'react-redux'
import { Loading } from 'carbon-components-react'
import { getContextRoot } from '../../lib/client/http-util'
import {
  CatalogFormWrapper,
  CatalogSearchFiltersWrapper,
  Resource,
  ResourceWrapper,
  SearchInput,
} from '../components/Catalog'

import ChartsModal from './ClustersChartsModal.js'
import { updateSecondaryHeader } from '../actions/common'
import Notification from '../components/common/Notification'
import msgs from '../../nls/platform.properties'
import headerMsgs from '../../nls/header.properties'
import * as Actions from '../actions/catalog'
import '../../scss/catalog.scss'
import { mapAndMultiFilterResoucesSelector } from '../shared/filters'
import { withForceCheck } from '../shared/utils'

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(Actions, dispatch),
  updateSecondaryHeader: (title, tabs) => dispatch(updateSecondaryHeader(title, tabs)),
})

// as much business logic as possible should take place here.
const mapStateToProps = ({
  catalog,
  catalog: {
    catalogFetchFailure,
    catalogFetchLoading,
    catalogInstallFailure,
    repos,
    filters: {
      selectedRepos,
    },
  },
}) => {
  return {
    items: mapAndMultiFilterResoucesSelector(catalog),
    repoNames: repos.map(({ name }) => name),
    catalogFetchFailure,
    catalogInstallFailure,
    selectedRepos,
    catalogFetchLoading,
  }
}

/* FIXME: Please fix disabled eslint rules when making changes to this file. */
/* eslint-disable react/prop-types */
const NotificationError = ({ description }) => (
  <Notification allowClose type="error" description={description} />
)

const ResourcesLoadingSpinner = () => (
  <Loading withOverlay className="content-spinner" />
)

class Catalog extends React.Component {
  /* FIXME: Please fix disabled eslint rules when making changes to this file. */
  /* eslint-disable react/prop-types, react/jsx-no-bind */
  constructor() {
    super()
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  state = { shouldRedirect: false }

  componentWillMount() {
    const { updateSecondaryHeader, secondaryHeaderProps } = this.props
    updateSecondaryHeader(headerMsgs.get(secondaryHeaderProps.title, this.context.locale))
  }

  componentDidMount() {
    this.props.actions.fetchResources()
  }

  handleSubmit() {
    this.setState({ shouldRedirect: true })
  }

  render() {
    if (this.state.shouldRedirect) {
      return <Redirect to={`${getContextRoot()}/clusters/releases`} />
    }

    const {
      catalogFetchFailure,
      catalogInstallFailure,
      items,
      actions,
      catalogFetchLoading,
    } = this.props

    return (
      <div>
        {catalogFetchFailure && (
          <NotificationError
            description={msgs.get('catalog.errorfetch', this.context.locale)}
          />
        )}
        {catalogInstallFailure &&
          <Notification allowClose type="error" description={msgs.get('catalog.installError')} />}
        <CatalogFormWrapper>
          <CatalogSearchFiltersWrapper
            aria-label={msgs.get('catalog.helmchartsearch', this.context.locale)}
          >
            <SearchInput
              placeHolderText={msgs.get('searchbar.searchofferings', this.context.locale)}
              onChange={actions.catalogResourceFilterSearch}
              labelText={msgs.get('catalog.filter', this.context.locale)}
            />
          </CatalogSearchFiltersWrapper>
          {catalogFetchLoading ? (
            <ResourcesLoadingSpinner />
          ) : (
            <ResourceWrapper description={msgs.get('catalog.notes', this.context.locale)}>
              <ChartsModal handleSubmit={this.handleSubmit} />
              {items.map(({
                name,
                repoName,
                url,
              }) => (
                <Resource
                  key={`${name}${repoName}`}
                  onSelectChart={() => actions.catalogResourceSelect({ name, url, repoName })}
                  name={name}
                  repoName={repoName}
                />
              ))}
            </ResourceWrapper>
          )}
        </CatalogFormWrapper>
      </div>
    )
  }
}

// force load images whenever filters change
const CatalogEnhanced = withForceCheck(Catalog)

export default connect(mapStateToProps, mapDispatchToProps)(CatalogEnhanced)
