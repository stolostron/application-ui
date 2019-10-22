/*******************************************************************************
 * Licensed Materials - Property of IBM
 * 5737-E67
 * (c) Copyright IBM Corporation 2017, 2019. All Rights Reserved.
 *
 * US Government Users Restricted Rights - Use, duplication or disclosure
 * restricted by GSA ADP Schedule Contract with IBM Corp.
 *******************************************************************************/
import React from 'react'
import msgs from '../../../../../nls/platform.properties'
import { withLocale } from '../../../../providers/LocaleProvider'
import resources from '../../../../../lib/shared/resources'
import ProgressBar from '../ProgressBar/index'
import {
  onSubscriptionClick,
  editResourceClick,
  editPlacementRuleClick,
  getDataByKind,
  getResourcesStatusPerChannel,
  createSubscriptionPerChannel,
  subscriptionsUnderColumnsGrid,
  getLongestArray,
  getTotalSubscriptions
} from './utils'
import {
  pullOutKindPerApplication,
  getPlacementRuleFromBulkSubscription
} from '../../utils'
import { Tile, Icon } from 'carbon-components-react'
import config from '../../../../../lib/shared/config'

/* eslint-disable react/prop-types */
/* eslint-disable react/jsx-key*/
/* jsx-a11y/no-static-element-interactions*/
/* jsx-a11y/click-events-have-key-events*/

resources(() => {
  require('./style.scss')
})

// This component displays all the LEFT column applications in the table.
// It displays all the applications names and their number of deployables.
const LeftColumnForApplicationNames = (
  {
    applications,
    appSubscriptions, // Subscription total for all the given applictions
    updateAppDropDownList,
    appDropDownList,
    channelList,
    oneApplication
  },
  { locale }
) => {
  // If there is just one application we want to find the subscription
  // count for that one so that we can display it rather that that total
  // subscription count
  const subscriptionsForOneApp = pullOutKindPerApplication(
    applications[0],
    'subscription'
  )
  return (
    <div className="applicationColumnContainer">
      <div className="tileContainer">
        <Tile className="firstTotalTile">
          <div className="totalApplications">
            {`${applications.length} `}
            {oneApplication || applications.length === 1
              ? msgs.get('description.title.application', locale)
              : msgs.get('description.title.applications', locale)}
          </div>
          <div className="totalDeployables">
            {`${(oneApplication &&
              subscriptionsForOneApp &&
              subscriptionsForOneApp[0] &&
              subscriptionsForOneApp[0].items instanceof Array &&
              subscriptionsForOneApp[0].items.length > 0) ||
              appSubscriptions.length} `}
            {appSubscriptions.length === 1
              ? msgs.get('description.title.subscription', locale)
              : msgs.get('description.title.subscriptions', locale)}
          </div>
        </Tile>
      </div>
      {applications.map(application => {
        const appName = application.name
        // Get the subscriptions given the application object
        const subscriptionsFetched = pullOutKindPerApplication(
          application,
          'subscription'
        )
        // Pull the data up to the top
        const subscriptions =
          (subscriptionsFetched &&
            subscriptionsFetched[0] &&
            subscriptionsFetched[0].items) ||
          []
        // get the subscriptions that fall under each column
        // each index is a channel
        // [[{sub1}], [], [], [{sub2}, {sub3}]]
        const subscriptionsUnderColumns = createSubscriptionPerChannel(
          channelList,
          subscriptions
        )
        // We need to know the longest subscriptionArray because we want to extend
        // the drop down for the left most column to that length
        const longestSubscriptionArray = getLongestArray(
          subscriptionsUnderColumns
        )
        const getTotalSubs = getTotalSubscriptions(subscriptionsUnderColumns)
        const expandRow = appDropDownList.includes(appName)
        const applicationTileClass = !expandRow
          ? 'applicationTile'
          : 'applicationTile noBottomBorder'
        return (
          <div key={Math.random()} className="tileContainerApp">
            <Tile
              className={applicationTileClass}
              onClick={
                longestSubscriptionArray.length > 0
                  ? () => updateAppDropDownList(appName)
                  : () => {
                    /* onClick expects a function thus we have placeholder */
                  }
              }
            >
              {longestSubscriptionArray.length > 0 && (
                <Icon
                  id={`${appName}chevron`}
                  name="icon--chevron--right"
                  fill="#6089bf"
                  description=""
                  className={expandRow ? 'openRowChevron' : 'closeRowChevron'}
                />
              )}
              <div className="ApplicationContents">
                <div className="appName">{`${appName} `}</div>
                <div className="appDeployables">
                  {`${getTotalSubs} `}
                  {getTotalSubs === 1
                    ? msgs.get('description.title.subscription', locale)
                    : msgs.get('description.title.subscriptions', locale)}
                </div>
              </div>
            </Tile>
            <div
              id={appName}
              className="deployablesDisplay"
              style={expandRow ? { display: 'block' } : { display: 'none' }}
            >
              {longestSubscriptionArray.map(() => {
                return <Tile key={Math.random()} className="deployableTile" />
              })}
            </div>
          </div>
        )
      })}
    </div>
  )
}

const ChannelColumnGrid = (
  {
    channelList,
    applicationList,
    getChannelResource,
    appDropDownList,
    bulkSubscriptionList,
    oneApplication,
    openSubscriptionModal,
    setSubscriptionModalHeaderInfo,
    setCurrentDeployableSubscriptionData,
    setCurrentsubscriptionModalData,
    getSubscriptionResource,
    getPlacementRuleResource
  },
  locale
) => {
  const containerClass =
    (oneApplication && 'channelGridContainerSingleApp') ||
    'channelGridContainer'
  return (
    <div className={containerClass}>
      <div className="horizontalScrollRow">
        {/* This is the where the channel header information will go */}
        {channelList.map(channel => {
          const channelName = channel.name
          return (
            <div key={Math.random()} className="channelColumn">
              <Tile className="channelColumnHeader">
                <div className="channelNameHeader">
                  <span>
                    <div className="yamlTitle">
                      {msgs.get('actions.yaml', locale)}
                    </div>
                    <Icon
                      name="icon--edit"
                      fill="#6089bf"
                      description=""
                      className="channelEditIcon"
                      onClick={() =>
                        editResourceClick(channel, getChannelResource)
                      }
                    />
                  </span>
                  <div className="channelTitle">
                    {msgs.get('description.Pipeline.channel', locale)}
                  </div>
                  <div className="channelNameTitle">{`${channelName}`}</div>
                </div>
              </Tile>
            </div>
          )
        })}
      </div>
      {/* All the applicaion totals and the subscription information is found here */}
      {applicationList.map(application => {
        const applicationName = application.name || ''
        // Given the application pull out its object of kind subscription
        const subscriptionsFetched = pullOutKindPerApplication(
          application,
          'subscription'
        )
        // Pull up the subscription data from the nested object
        const subscriptionsForThisApplication =
          (subscriptionsFetched &&
            subscriptionsFetched[0] &&
            subscriptionsFetched[0].items) ||
          []
        // get the subscriptions that fall under each column
        // each index is a channel
        // [[{sub1}], [], [], [{sub2}, {sub3}]]
        const subscriptionsUnderColumns = createSubscriptionPerChannel(
          channelList,
          subscriptionsForThisApplication
        )
        const subscriptoinsRowFormat = subscriptionsUnderColumnsGrid(
          subscriptionsUnderColumns
        )

        const expandRow = appDropDownList.includes(applicationName)
        // I use this row counter for determining if I should show no subscription
        // tile or a blank tile
        let row = 0
        return (
          <React.Fragment key={Math.random()}>
            <div className="horizontalScrollRow">
              {subscriptionsUnderColumns.map(subscriptions => {
                return (
                  <div key={Math.random()} className="channelColumn">
                    <Tile className="channelColumnHeaderApplication">
                      <div className="subTotal">{subscriptions.length}</div>
                      <div className="subTotalDescription">
                        {msgs.get('description.subsInChannel', locale)}
                      </div>
                    </Tile>
                  </div>
                )
              })}
            </div>
            <div
              id={`${applicationName}deployableRows`}
              className="horizontalScrollRow spaceOutBelow"
              style={expandRow ? { display: 'block' } : { display: 'none' }}
            >
              {subscriptoinsRowFormat.map(subRow => {
                row = row + 1
                return (
                  <div key={Math.random()} className="deployableRow">
                    {subRow.map(subCol => {
                      // Gather the subscription data that contains the matching UID
                      const thisSubscriptionData = getDataByKind(
                        bulkSubscriptionList,
                        subCol._uid
                      )
                      const placementRule = getPlacementRuleFromBulkSubscription(
                        thisSubscriptionData
                      )

                      // Get status of resources within the subscription specific
                      // to the channel. We will match the resources that contain
                      // the same namespace as the channel
                      // status = [0, 0, 0, 0, 0] // pass, fail, inprogress, pending, unidentifed
                      const status = getResourcesStatusPerChannel(
                        thisSubscriptionData
                      )

                      // If the object isn't empty name will be defined
                      const displayStatus = subCol.name
                      // show no subscriptions Tile
                      const showNoSubsTile =
                        row == 1 && displayStatus == undefined
                      // if there is more than one subscription and subCol.name is undefined
                      const showBlankFiller =
                        row > 1 && displayStatus == undefined
                      const subName = subCol.name
                      const onClickEditResource = () => {
                        editResourceClick(subCol, getSubscriptionResource)
                      }
                      const onClickEditPlacementRule = () => {
                        editPlacementRuleClick(
                          placementRule,
                          getPlacementRuleResource
                        )
                      }

                      const onKeyPressEditPlacementRule = e => {
                        if (e.key === 'Enter') {
                          onClickEditPlacementRule()
                        }
                      }
                      const onKeyPressEditResource = e => {
                        if (e.key === 'Enter') {
                          onClickEditResource()
                        }
                      }

                      return (
                        <div key={Math.random()} className="channelColumnDep">
                          {displayStatus && (
                            <Tile
                              className="channelColumnDeployable addHover"
                              onClick={event => {
                                const eClass = event.target.className
                                const proceed =
                                  typeof eClass != 'object' &&
                                  eClass != 'yamlEditSubContainer' &&
                                  eClass != 'yamlTitleSub' &&
                                  eClass != 'placementRuleDesc'
                                if (proceed) {
                                  onSubscriptionClick(
                                    openSubscriptionModal,
                                    setSubscriptionModalHeaderInfo,
                                    setCurrentDeployableSubscriptionData,
                                    setCurrentsubscriptionModalData,
                                    subCol,
                                    applicationName,
                                    subName
                                  )
                                }
                              }}
                            >
                              <div className="subColHeader">
                                {msgs.get('description.subscription', locale)}
                              </div>
                              <div
                                className="yamlEditSubContainer"
                                onClick={onClickEditResource}
                                onKeyPress={onKeyPressEditResource}
                                tabIndex={0}
                                role="button"
                              >
                                <div className="yamlTitleSub">
                                  {msgs.get('actions.yaml', locale)}
                                </div>
                                <Icon
                                  name="icon--edit"
                                  fill="#6089bf"
                                  description=""
                                  className="subscriptionEditIcon"
                                  onClick={() =>
                                    editResourceClick(
                                      subCol,
                                      getSubscriptionResource
                                    )
                                  }
                                />
                              </div>
                              <div className="subColName">{subCol.name}</div>
                              <div className="namespaceDesc">{`${msgs.get(
                                'description.namespace',
                                locale
                              )}: ${subCol.namespace}`}</div>
                              {placementRule &&
                                placementRule.name && (
                                <div
                                  className="placementRuleDesc"
                                  onClick={onClickEditPlacementRule}
                                  onKeyPress={onKeyPressEditPlacementRule}
                                  tabIndex={placementRule._uid}
                                  role="button"
                                >
                                  {`${msgs.get(
                                    'description.placement.rule',
                                    locale
                                  )}: ${placementRule.name} `}
                                  <Icon
                                    name="icon--edit"
                                    fill="#6089bf"
                                    description=""
                                    className="placementEditIcon"
                                    onClick={() =>
                                      editResourceClick(
                                        placementRule,
                                        getPlacementRuleResource
                                      )
                                    }
                                  />
                                </div>
                              )}

                              <div className="progressBarContainer">
                                <ProgressBar status={status} />
                              </div>
                            </Tile>
                          )}
                          {showNoSubsTile && (
                            <Tile className="channelColumnDeployable">
                              <img
                                className="no-sub-icon"
                                src={`${
                                  config.contextPath
                                }/graphics/nothing-moon-copy.svg`}
                                alt={msgs.get(
                                  'description.tryAddingSub',
                                  locale
                                )}
                              />
                              <div className="subDescriptionText">
                                <div className="noSubTitle">
                                  {msgs.get('description.noSubs', locale)}
                                </div>
                                <div className="noSubDescription">
                                  {msgs.get('description.tryAddingSub', locale)}
                                </div>
                              </div>
                            </Tile>
                          )}
                          {showBlankFiller && (
                            <Tile className="channelColumnDeployableBlank" />
                          )}
                        </div>
                      )
                    })}
                  </div>
                )
              })}
            </div>
          </React.Fragment>
        )
      })}
    </div>
  )
}

const PipelineGrid = withLocale(
  ({
    applications,
    channels,
    appSubscriptions,
    getChannelResource,
    getSubscriptionResource,
    getPlacementRuleResource,
    openSubscriptionModal,
    setSubscriptionModalHeaderInfo,
    setCurrentDeployableSubscriptionData,
    setCurrentsubscriptionModalData,
    updateAppDropDownList,
    appDropDownList,
    bulkSubscriptionList,
    hasAdminRole,
    breadcrumbItems
  }) => {
    const oneApplication = breadcrumbItems.length == 2
    return (
      <div id="PipelineGrid">
        <div className="tableGridContainer">
          {!oneApplication && (
            <LeftColumnForApplicationNames
              appSubscriptions={appSubscriptions} // Subscription total for all the given applictions
              applications={applications}
              updateAppDropDownList={updateAppDropDownList}
              appDropDownList={appDropDownList}
              hasAdminRole={hasAdminRole}
              channelList={channels}
              oneApplication={oneApplication}
            />
          )}
          <ChannelColumnGrid
            channelList={channels}
            applicationList={applications}
            getChannelResource={getChannelResource}
            appDropDownList={appDropDownList}
            bulkSubscriptionList={bulkSubscriptionList} // the bulk subscriptions list that came back only ones found in applications
            hasAdminRole={hasAdminRole}
            oneApplication={oneApplication}
            openSubscriptionModal={openSubscriptionModal}
            setSubscriptionModalHeaderInfo={setSubscriptionModalHeaderInfo}
            setCurrentDeployableSubscriptionData={
              setCurrentDeployableSubscriptionData
            }
            setCurrentsubscriptionModalData={setCurrentsubscriptionModalData}
            getSubscriptionResource={getSubscriptionResource}
            getPlacementRuleResource={getPlacementRuleResource}
          />
        </div>
      </div>
    )
  }
)

export default withLocale(PipelineGrid)
