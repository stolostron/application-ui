/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2017, 2019. All Rights Reserved.
 * Copyright (c) 2020 Red Hat, Inc
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
  getDataByKind,
  createSubscriptionPerChannel,
  subscriptionsUnderColumnsGrid,
  getLongestArray,
  sortChannelsBySubscriptionLength,
  getStandaloneSubscriptions,
  createStandaloneSubscriptionPerChannel
} from './utils'
import {
  pullOutKindPerApplication,
  getPlacementRuleFromBulkSubscription
} from '../../utils'
import { getPodData } from '../../../ApplicationDeploymentPipeline/components/InfoCards/utils'
import { Tile, Icon, Tooltip } from 'carbon-components-react'
import config from '../../../../../lib/shared/config'
import R from 'ramda'

/* eslint-disable react/prop-types */
/* eslint-disable react/jsx-key*/
/* jsx-a11y/no-static-element-interactions*/
/* jsx-a11y/click-events-have-key-events*/

resources(() => {
  require('./style.scss')
})

// This component displays all the LEFT column applications in the table.
// It displays all the applications names and their number of deployables.

// *** left column only needs subscription count per app (logic can be simplified significantly)
const LeftColumnForApplicationNames = (
  {
    applications,
    appSubscriptions, // Subscription total for all the given applictions
    updateAppDropDownList,
    appDropDownList,
    channelList,
    oneApplication,
    bulkSubscriptionList
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
  // get subscriptions that have no apps
  const standaloneSubscriptions = getStandaloneSubscriptions(
    bulkSubscriptionList
  )

  const standaloneSubCount = standaloneSubscriptions.length
  const subCountLabelSingle = msgs.get(
    'description.title.subscription',
    locale
  )
  const subCountLabelMulti = msgs.get(
    'description.title.subscriptions',
    locale
  )

  let standaloneTile

  // special logic for the standalone subscription case
  if (standaloneSubCount > 0) {
    const subscriptionsUnderColumns = createStandaloneSubscriptionPerChannel(
      channelList,
      standaloneSubscriptions
    )
    // We need to know the longest subscriptionArray because we want to extend
    // the drop down for the left most column to that length
    const longestStandaloneSubscriptionArray = getLongestArray(
      subscriptionsUnderColumns
    )

    const expandRow = appDropDownList.includes('standalone')
    const applicationTileClass = !expandRow
      ? 'applicationTile'
      : 'applicationTile noBottomBorder'

    // compute standalone Tile for Left Column
    standaloneTile = (
      <div key={Math.random()} className="tileContainerApp">
        <Tile
          className={applicationTileClass}
          onClick={
            standaloneSubCount > 0
              ? () => {
                updateAppDropDownList('standalone')
              }
              : () => {
                /* onClick expects a function thus we have placeholder */
              }
          }
        >
          {standaloneSubCount > 0 && (
            <Icon
              id={'standalonechevron'}
              name="icon--chevron--right"
              fill="#6089bf"
              description=""
              className={expandRow ? 'openRowChevron' : 'closeRowChevron'}
            />
          )}

          <div className="ApplicationContents">
            <div className="appName">
              {msgs.get('description.title.standaloneSubscriptions', locale)}

              <Tooltip triggerText="" iconName="info">
                <span>
                  {msgs.get(
                    'description.title.standaloneSubscriptionsTooltip',
                    locale
                  )}
                </span>
              </Tooltip>
            </div>
            <div className="appDeployables">
              {`${standaloneSubCount} `}
              {standaloneSubCount === 1
                ? subCountLabelSingle
                : subCountLabelMulti}
            </div>
          </div>
        </Tile>
        <div
          id="standalone"
          className="deployablesDisplay"
          style={expandRow ? { display: 'block' } : { display: 'none' }}
        >
          {longestStandaloneSubscriptionArray.map(() => {
            return <Tile key={Math.random()} className="deployableTile" />
          })}
        </div>
      </div>
    )
  }

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
              appSubscriptions.length + standaloneSubCount} `}
            {appSubscriptions.length === 1
              ? subCountLabelSingle
              : subCountLabelMulti}
          </div>
        </Tile>
      </div>

      {standaloneSubCount > 0 && standaloneTile}

      {applications.map(application => {
        const appName = application.name
        // Get the subscriptions given the application object

        const subscriptionsFetched = application.hubSubscriptions

        // Pull the data up to the top
        const subscriptions = subscriptionsFetched || []

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

        // revert when charts-v1 tag exists
        // const getTotalSubs = application.hubSubscriptions.length //getTotalSubscriptions(subscriptionsUnderColumns)

        var getTotalSubs = 0
        Object.keys(application.hubSubscriptions).map(i => {
          const splitChannel = application.hubSubscriptions[i].channel.split('/')
          if (splitChannel[1] !== 'predev-ch') {
            getTotalSubs++
          }
        })

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
                    ? subCountLabelSingle
                    : subCountLabelMulti}
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

//show channel header columns
const ChannelColumnsHeader = ({ channelList, getChannelResource }, locale) => {
  return (
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
  )
}

//show how many subscriptions under a channel, for a specific application
const NbOfSubscriptionsTile = ({ subscriptionsUnderColumns }, locale) => {
  return (
    <div className="horizontalScrollRow">
      {subscriptionsUnderColumns.map(subscriptions => {

        // revert when charts-v1 tag exists
        // var numSubs = subscriptions.length
        var numSubs = 0
        Object.keys(subscriptions).map(i => {
          const splitChannel = subscriptions[i].channel.split('/')
          if (splitChannel[1] !== 'predev-ch') {
            numSubs++
          }
        })

        return (
          <div key={Math.random()} className="channelColumn">
            <Tile className="channelColumnHeaderApplication">
              <div className="subTotal">{numSubs}</div>
              <div className="subTotalDescription">
                {msgs.get('description.subsInChannel', locale)}
              </div>
            </Tile>
          </div>
        )
      })}
    </div>
  )
}

const EmptySubscriptionTile = locale => {
  return (
    <Tile className="channelColumnDeployable">
      <img
        className="no-sub-icon"
        src={`${config.contextPath}/graphics/nothing-moon-copy.svg`}
        alt={msgs.get('description.tryAddingSub', locale)}
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
  )
}

const SubscriptionTile = (
  {
    openSubscriptionModal,
    setSubscriptionModalHeaderInfo,
    setCurrentDeployableSubscriptionData,
    setCurrentsubscriptionModalData,
    thisSubscriptionData,
    applicationName,
    subName,
    status,
    placementRule,
    onClickEditResource,
    onKeyPressEditResource,
    onClickEditPlacementRule,
    onKeyPressEditPlacementRule,
    getSubscriptionResource,
    getPlacementRuleResource
  },
  locale
) => {
  return (
    <Tile
      className="channelColumnDeployable addHover"
      onClick={event => {
        const eClass = event.target.className
        const proceed =
          typeof eClass != 'object' &&
          eClass !== 'yamlEditSubContainer' &&
          eClass !== 'yamlTitleSub' &&
          eClass !== 'placementRuleDesc'
        if (proceed) {
          onSubscriptionClick(
            openSubscriptionModal,
            setSubscriptionModalHeaderInfo,
            setCurrentDeployableSubscriptionData,
            setCurrentsubscriptionModalData,
            thisSubscriptionData,
            applicationName,
            subName,
            status
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
        <div className="yamlTitleSub">{msgs.get('actions.yaml', locale)}</div>
        <Icon
          name="icon--edit"
          fill="#6089bf"
          description=""
          className="subscriptionEditIcon"
          onClick={() =>
            editResourceClick(thisSubscriptionData, getSubscriptionResource)
          }
        />
      </div>
      <div className="subColName">{thisSubscriptionData.name}</div>
      <div className="namespaceDesc">{`${msgs.get(
        'description.namespace',
        locale
      )}: ${thisSubscriptionData.namespace}`}</div>
      {placementRule &&
        placementRule.name && (
          <div
            className="placementRuleDesc"
            onClick={onClickEditPlacementRule}
            onKeyPress={onKeyPressEditPlacementRule}
            tabIndex={placementRule._uid}
            role="button"
          >
            {`${msgs.get('description.placement.rule', locale)}: ${
              placementRule.name
              } `}
            <Icon
              name="icon--edit"
              fill="#6089bf"
              description=""
              className="placementEditIcon"
              onClick={() =>
                editResourceClick(placementRule, getPlacementRuleResource)
              }
            />
          </div>
        )}

      <div className="progressBarContainer">
        <ProgressBar status={status} />
      </div>
    </Tile>
  )
}

const ChannelColumnGrid = ({
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
}) => {
  const containerClass =
    (oneApplication && 'channelGridContainerSingleApp') ||
    'channelGridContainer'

  let standaloneSubscriptions
  if (!oneApplication) {
    // add dummy "standalone" application

    standaloneSubscriptions = getStandaloneSubscriptions(bulkSubscriptionList)

    // add standalone ONLY if it exists
    if (standaloneSubscriptions && standaloneSubscriptions.length > 0) {
      applicationList = R.prepend({ name: 'standalone' }, applicationList)
    }
  }

  return (
    <div className={containerClass}>
      <ChannelColumnsHeader
        channelList={channelList}
        getChannelResource={getChannelResource}
      />

      {/* All the application totals and the subscription information is found here */}
      {applicationList.map(application => {
        const applicationName = application.name || ''

        let subscriptionsUnderColumns
        let subscriptionsRowFormat

        if (applicationName === 'standalone') {
          subscriptionsUnderColumns = createStandaloneSubscriptionPerChannel(
            channelList,
            standaloneSubscriptions
          )

          subscriptionsRowFormat = subscriptionsUnderColumnsGrid(
            subscriptionsUnderColumns
          )
        } else {
          // Given the application pull out its object of kind subscription
          const subscriptionsFetched = application.hubSubscriptions

          // Pull up the subscription data from the nested object
          const subscriptionsForThisApplication = subscriptionsFetched || []

          // get the subscriptions that fall under each column
          // each index is a channel
          // [[{sub1}], [], [], [{sub2}, {sub3}]]
          subscriptionsUnderColumns = createSubscriptionPerChannel(
            channelList,
            subscriptionsForThisApplication
          )

          subscriptionsRowFormat = subscriptionsUnderColumnsGrid(
            subscriptionsUnderColumns
          )
        }
        const expandRow = appDropDownList.includes(applicationName)
        // I use this row counter for determining if I should show no subscription
        // tile or a blank tile
        let row = 0

        return (
          <React.Fragment key={Math.random()}>
            <NbOfSubscriptionsTile
              subscriptionsUnderColumns={subscriptionsUnderColumns}
            />

            <div
              id={`${applicationName}deployableRows`}
              className="horizontalScrollRow spaceOutBelow"
              style={expandRow ? { display: 'block' } : { display: 'none' }}
            >
              {subscriptionsRowFormat.map(subRow => {
                row = row + 1

                return (
                  <div key={Math.random()} className="deployableRow">
                    {subRow.map(subCol => {
                      // Gather the subscription data that contains the matching UID
                      const thisSubscriptionData = getDataByKind(
                        bulkSubscriptionList,
                        subCol._uid
                      )
                      // assigning channel value to the object displayed in modal
                      thisSubscriptionData.channel = subCol.channel

                      const placementRule = getPlacementRuleFromBulkSubscription(
                        thisSubscriptionData
                      )

                      // Get status of resources within the subscription specific
                      // to the channel. We will match the resources that contain
                      // the same namespace as the channel
                      // status = [0, 0, 0, 0, 0] // pass, fail, inprogress, pending, unidentifed

                      // wrap with "items" so that it can be used in getPodData
                      const podData = getPodData(
                        { items: applicationList },
                        application.name,
                        application.namespace
                      )

                      const status = [
                        podData.running,
                        podData.failed,
                        podData.inProgress,
                        0,
                        0
                      ]

                      // revert when charts-v1 tag exists
                      // If the object isn't empty name will be defined
                      var displayStatus = undefined
                      if (subCol && subCol.channel && ((subCol.channel).split('/'))[1] !== 'predev-ch') {
                        displayStatus = subCol._uid
                      }

                      // show no subscriptions Tile
                      const showNoSubsTile =
                        row === 1 && displayStatus === undefined
                      // if there is more than one subscription and subCol.name is undefined
                      const showBlankFiller =
                        row > 1 && displayStatus === undefined
                      const subName = thisSubscriptionData.name
                      const onClickEditResource = () => {
                        editResourceClick(subCol, getSubscriptionResource)
                      }
                      const onClickEditPlacementRule = () => {
                        editResourceClick(
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
                            <SubscriptionTile
                              openSubscriptionModal={openSubscriptionModal}
                              setSubscriptionModalHeaderInfo={
                                setSubscriptionModalHeaderInfo
                              }
                              setCurrentDeployableSubscriptionData={
                                setCurrentDeployableSubscriptionData
                              }
                              setCurrentsubscriptionModalData={
                                setCurrentsubscriptionModalData
                              }
                              thisSubscriptionData={thisSubscriptionData}
                              applicationName={applicationName}
                              subName={subName}
                              status={status}
                              placementRule={placementRule}
                              onClickEditResource={onClickEditResource}
                              onKeyPressEditResource={onKeyPressEditResource}
                              onClickEditPlacementRule={
                                onClickEditPlacementRule
                              }
                              onKeyPressEditPlacementRule={
                                onKeyPressEditPlacementRule
                              }
                              getSubscriptionResource={getSubscriptionResource}
                              getPlacementRuleResource={
                                getPlacementRuleResource
                              }
                            />
                          )}
                          {showNoSubsTile && <EmptySubscriptionTile />}
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
  (
    {
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
    },
    locale
  ) => {
    const oneApplication = breadcrumbItems.length === 2

    const sortedChannels = sortChannelsBySubscriptionLength(
      channels,
      applications
    )

    // do the logic to calculate the "standalone" subscriptions

    return (
      <div id="PipelineGrid">
        {sortedChannels.length === 0 && (
          <div className="grid-item grid-item-deployable">
            <img
              className="no-res-icon"
              src={`${config.contextPath}/graphics/nothing-moon-copy.svg`}
              alt={msgs.get('description.noDeplResDescr', locale)}
            />
            <div className="noResDescriptionText">
              <div className="noResTitle">
                {msgs.get('description.noChannels', locale)}
              </div>
              <div className="noResDescription">
                {msgs.get('description.noChannelsDescr', locale)}
              </div>
              <div className="deployment-highlights-terminology-docs">
                <a
                  href="https://www.ibm.com/support/knowledgecenter/SSFC4F_1.1.0/mcm/applications/overview.html"
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  <span className="deployment-highlights-terminology-docs-text">
                    View documentation
                  </span>
                  <svg
                    alt=""
                    aria-label=""
                    className="deployment-highlights-terminology-docs-icon"
                    fill="#6089bf"
                    fillRule="evenodd"
                    height="16"
                    name="icon--launch"
                    role="img"
                    style={undefined}
                    viewBox="0 0 16 16"
                    width="16"
                  >
                    <title />
                    <path d="M14.3 1h-3.8V0H16v5.5h-1V1.7L9.7 7 9 6.3 14.3 1z" />
                    <path d="M14.3 1h-3.8V0H16v5.5h-1V1.7L9.7 7 9 6.3 14.3 1z" />
                    <path d="M13 9h1v6c0 .6-.4 1-1 1H1c-.6 0-1-.4-1-1V3c0-.6.4-1 1-1h7v1H1v12h12V9z" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        )}
        <div className="tableGridContainer">
          {!oneApplication &&
            sortedChannels.length > 0 && (
              <LeftColumnForApplicationNames
                appSubscriptions={appSubscriptions} // Subscription total for all the given applictions
                applications={applications}
                updateAppDropDownList={updateAppDropDownList}
                appDropDownList={appDropDownList}
                hasAdminRole={hasAdminRole}
                channelList={sortedChannels}
                oneApplication={oneApplication}
                bulkSubscriptionList={bulkSubscriptionList}
              />
            )}
          {sortedChannels.length > 0 && (
            <ChannelColumnGrid
              channelList={sortedChannels}
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
          )}
        </div>
      </div>
    )
  }
)

export default withLocale(PipelineGrid)
