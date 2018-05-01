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
import { connect } from 'react-redux'
import { Loading } from 'carbon-components-react'
import {
  CatalogFormWrapper,
  CatalogSearchFiltersWrapper,
  Resource,
  ResourceWrapper,
  SearchInput,
} from '../components/Catalog'
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
    repos,
    dropdownFiltersVisibility,
    filters: {
      selectedArchitectures,
      selectedRepos,
      selectedCategory,
      selectedClassifications,
    },
  },
}) => {
  return {
    items: mapAndMultiFilterResoucesSelector(catalog),
    repoNames: repos.map(({ name }) => name),
    catalogFetchFailure,
    dropdownFiltersVisibility,
    selectedRepos,
    selectedArchitectures,
    selectedCategory,
    catalogFetchLoading,
    selectedClassifications,
  }
}

const NotificationError = ({ description }) => (
  <Notification allowClose type="error" description={description} />
)

const ResourcesLoadingSpinner = () => (
  <Loading withOverlay className="content-spinner" />
)
class Catalog extends React.Component {
  componentWillMount() {
    const { updateSecondaryHeader, secondaryHeaderProps } = this.props
    updateSecondaryHeader(headerMsgs.get(secondaryHeaderProps.title, this.context.locale))
  }

  componentDidMount() {
    this.props.actions.fetchResources()
    // this.props.actions.fetchRepos()
  }
  render() {
    const { locale } = this.context
    const {
      catalogFetchFailure,
      items,
      actions,
      catalogFetchLoading,
    } = this.props

    return (
      <div>
        {catalogFetchFailure && (
          <NotificationError
            description={msgs.get('catalog.errorfetch', locale)}
          />
        )}
        <CatalogFormWrapper>
          <CatalogSearchFiltersWrapper
            aria-label={msgs.get('catalog.helmchartsearch', locale)}
          >
            <SearchInput
              placeHolderText={msgs.get('searchbar.searchofferings', locale)}
              onChange={actions.catalogResourceFilterSearch}
              labelText={msgs.get('catalog.filter', locale)}
            />
          </CatalogSearchFiltersWrapper>
          {catalogFetchLoading ? (
            <ResourcesLoadingSpinner />
          ) : (
            <ResourceWrapper description={msgs.get('catalog.notes', locale)}>
              {items.map(({
                name,
                repoName,
              }) => (
                <Resource
                  key={`${name}${repoName}`}
                  onSelectChart={() => actions.catalogResourceSelect(name)}
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
