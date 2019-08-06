/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2018, 2019. All Rights Reserved.
 *
 * Note to U.S. Government Users Restricted Rights:
 * Use, duplication or disclosure restricted by GSA ADP Schedule
 * Contract with IBM Corp.
 *******************************************************************************/

import React from 'react'
import { withRouter } from 'react-router-dom'
import PropTypes from 'prop-types'
import { Loading } from 'carbon-components-react'
import { connect } from 'react-redux'
import CountsCardModule from '../../CountsCardModule'
import ChannelsCardCarousel from '../../ChannelsCardCarousel'
import ApplicationTopologyModule from '../../ApplicationTopologyModule'
import StructuredListModule from '../../../components/common/StructuredListModule'
import ResourceTable from '../ResourceTable'
import TableHelper from '../../../util/table-helper'
import msgs from '../../../../nls/platform.properties'
import {
  getSingleResourceItem,
  resourceItemByName
} from '../../../reducers/common'
import {
  getNumDeployables,
  getNumDeployments,
  getNumFailedDeployments
} from '../../../../lib/client/resource-helper'
import { withLocale } from '../../../providers/LocaleProvider'
import resources from '../../../../lib/shared/resources'
import { getChannelsList } from './utils'

resources(() => {
  require('./style.scss')
})

const ResourceOverview = withLocale(
  ({
    staticResourceData,
    item,
    channelList,
    params,
    modules,
    resourceType,
    actions,
    showAppDetails,
    showExpandedTopology,
    page,
    pageSize,
    itemIds,
    sortDirection,
    sortColumn,
    items,
    totalFilteredItems,
    changeTablePage,
    searchValue,
    clientSideFilters,
    sortTable,
    searchTable,
    incidentCount,
    locale
  }) => {
    if (!item) {
      return <Loading withOverlay={false} className="content-spinner" />
    }
    const modulesRight = []
    const modulesBottom = []
    React.Children.map(modules, module => {
      if (module.props.right) {
        modulesRight.push(
          React.cloneElement(module, {
            staticResourceData,
            resourceType,
            resourceData: item,
            params
          })
        )
      } else {
        modulesBottom.push(
          React.cloneElement(module, {
            staticResourceData,
            resourceType,
            resourceData: item,
            params
          })
        )
      }
    })

    const countsCardData = [
      {
        msgKey: 'table.header.deployables',
        count: getNumDeployables(item)
      },
      {
        msgKey: 'table.header.deployments',
        count: getNumDeployments(item)
      },
      {
        msgKey: 'table.header.failedDeployments',
        count: getNumFailedDeployments(item)
      },
      {
        msgKey: 'table.header.incidents',
        count: incidentCount
      }
    ]

    const tableTitle = msgs.get('table.title.allInstances', locale)

    return (
      <div id="resource-overview" className="overview-content">
        {showAppDetails ? (
          <React.Fragment>
            <StructuredListModule
              title={staticResourceData.detailKeys.title}
              headerRows={staticResourceData.detailKeys.headerRows}
              rows={staticResourceData.detailKeys.rows}
              data={item}
            />
            {modulesRight.length > 0 && (
              <div className="overview-content-right">{modulesRight}</div>
            )}
            <div className="overview-content-bottom">{modulesBottom}</div>
          </React.Fragment>
        ) : !showExpandedTopology ? (
          <React.Fragment>
            <div className="overview-content-bottom overview-content-with-padding">
              <CountsCardModule data={countsCardData} />
            </div>
            <div className="overview-content-bottom overview-content-with-padding">
              <ApplicationTopologyModule
                showExpandedTopology={showExpandedTopology}
                params={params}
                actions={actions}
              />
            </div>
            <div className="overview-content-bottom overview-content-with-padding-except-left">
              <ChannelsCardCarousel data={channelList} />
            </div>
            <div className="overview-content-bottom overview-content-with-padding">
              <ResourceTable
                actions=""
                staticResourceData={staticResourceData}
                page={page}
                pageSize={pageSize}
                itemIds={itemIds}
                sortDirection={sortDirection}
                sortColumn={sortColumn}
                status={status}
                items={items}
                totalFilteredItems={totalFilteredItems}
                resourceType={resourceType}
                changeTablePage={changeTablePage}
                handleSort={TableHelper.handleSort.bind(
                  this,
                  sortDirection,
                  sortColumn,
                  sortTable
                )}
                handleSearch={TableHelper.handleInputValue.bind(
                  this,
                  searchTable
                )}
                searchValue={searchValue}
                defaultSearchValue={clientSideFilters}
                tableActions={staticResourceData.tableActions}
                tableTitle={tableTitle}
                tableName="All instances"
              />
            </div>
          </React.Fragment>
        ) : (
          <div className="overview-content-bottom overview-content-with-padding">
            <ApplicationTopologyModule
              showExpandedTopology={showExpandedTopology}
              params={params}
              actions={actions}
            />
          </div>
        )}
      </div>
    )
  }
)

ResourceOverview.contextTypes = {
  locale: PropTypes.string
}

ResourceOverview.propTypes = {
  item: PropTypes.oneOfType([PropTypes.bool, PropTypes.object]),
  modules: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
  params: PropTypes.object,
  resourceType: PropTypes.object,
  staticResourceData: PropTypes.object
}

const mapStateToProps = (state, ownProps) => {
  const { resourceType, params } = ownProps
  const { HCMChannelList } = state
  const name = decodeURIComponent(params.name)
  const item = getSingleResourceItem(state, {
    storeRoot: resourceType.list,
    resourceType,
    name,
    predicate: resourceItemByName,
    namespace: params.namespace ? decodeURIComponent(params.namespace) : null
  })

  const { list: typeListName, name: resourceName } = ownProps.resourceType,
        visibleResources = ownProps.getVisibleResources(state, {
          storeRoot: typeListName
        })

  const pendingActions = state[typeListName].pendingActions
  const items = visibleResources.normalizedItems
  if (items && pendingActions) {
    Object.keys(items).map(key => {
      if (pendingActions.find(pending => pending.name === items[key].Name))
        items[key].hasPendingActions = true
    })
  }
  const userRole = state.role.role

  return {
    item,
    channelList: getChannelsList(HCMChannelList),
    userRole,
    items,
    itemIds: visibleResources.items,
    totalFilteredItems: visibleResources.totalResults,
    totalPages: visibleResources.totalPages,
    status: state[typeListName].status,
    page: state[typeListName].page,
    pageSize: state[typeListName].itemsPerPage,
    sortDirection: state[typeListName].sortDirection,
    sortColumn: state[typeListName].sortColumn,
    searchValue: state[typeListName].search,
    err: state[typeListName].err,
    mutateStatus: state[typeListName].mutateStatus,
    mutateErrorMsg: state[typeListName].mutateErrorMsg,
    resourceFilters: state['resourceFilters'].filters,
    selectedFilters:
      state['resourceFilters'].selectedFilters &&
      state['resourceFilters'].selectedFilters[resourceName]
  }
}

export default withRouter(
  connect(mapStateToProps)(withLocale(ResourceOverview))
)
