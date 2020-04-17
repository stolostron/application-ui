/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2017, 2019. All Rights Reserved.
 *
 * US Government Users Restricted Rights - Use, duplication or disclosure
 * restricted by GSA ADP Schedule Contract with IBM Corp.
 *******************************************************************************/
import R from 'ramda'

export const getNumIncidents = list => {
  if (list && list.items && Array.isArray(list.items)) {
    return list.items.length
  }
  return 0
}

export const getSingleApplicationObject = list => {
  if (list && list.items instanceof Array && list.items.length > 0) {
    return list.items[0]
  }
  return ''
}

const getPlacementRuleObjs = (subData, allPlacementRules) => {
  Object.keys(subData).forEach(kindIndex => {
    if (subData[kindIndex].kind.toLowerCase() === 'placementrule') {
      const placementRules = subData[kindIndex].items
      Object.keys(placementRules).forEach(prIndex => {
        const prObj = {
          name: placementRules[prIndex].name,
          namespace: placementRules[prIndex].namespace
        }
        allPlacementRules = allPlacementRules.concat(prObj)
      })
    }
  })
  return allPlacementRules
}

export const getNumPlacementRules = (
  subscriptions,
  isSingleApplicationView,
  applicationName,
  applicationNamespace
) => {
  if (subscriptions && subscriptions.items) {
    var allPlacementRules = []

    // Single application view
    if (isSingleApplicationView) {
      Object.keys(subscriptions.items).forEach(subIndex => {
        // Get number of placement rules for the current application opened
        if (
          subscriptions.items[subIndex].namespace === applicationNamespace &&
          subscriptions.items[subIndex].related
        ) {
          // Placement rule data found in "related" object
          const subData = subscriptions.items[subIndex].related

          // Check that the data's app name matches with the selected app name
          const isCurrentApp = subData.find(data => {
            return data.items[0].name === applicationName
          })

          if (isCurrentApp) {
            allPlacementRules = getPlacementRuleObjs(
              subData,
              allPlacementRules
            )
          }
        }
      })
    } else {
      // Root application view
      // Get number of placement rules for all applications
      Object.keys(subscriptions.items).forEach(subIndex => {
        // Placement rule data found in "related" object
        if (subscriptions.items[subIndex].related) {
          allPlacementRules = getPlacementRuleObjs(
            subscriptions.items[subIndex].related,
            allPlacementRules
          )
        }
      })
    }

    // Remove duplicate placement rules (that were found in more than one app)
    allPlacementRules = R.uniq(allPlacementRules)

    return allPlacementRules.length
  }
  return 0
}

const getSubObjs = (subData, allSubscriptions, allChannels) => {
  Object.keys(subData).forEach(subIndex => {
    const subObj = {
      status: subData[subIndex].status,
      id: subData[subIndex]._uid
    }
    allSubscriptions = allSubscriptions.concat(subObj)
    allChannels = allChannels.concat(subData[subIndex].channel)
  })
  return [allSubscriptions, allChannels]
}

export const getSubscriptionDataOnHub = (
  applications,
  isSingleApplicationView,
  applicationName,
  applicationNamespace
) => {
  var allSubscriptions = []
  var failedSubsCount = 0
  var noStatusSubsCount = 0
  var allChannels = []

  if (applications && applications.items) {
    // Single application view
    if (isSingleApplicationView) {
      Object.keys(applications.items).forEach(appIndex => {
        // Get subscription data for the current application opened
        if (
          applications.items[appIndex].name === applicationName &&
          applications.items[appIndex].namespace === applicationNamespace &&
          applications.items[appIndex].hubSubscriptions
        ) {
          const subObjs = getSubObjs(
            applications.items[appIndex].hubSubscriptions,
            allSubscriptions,
            allChannels
          )
          allSubscriptions = subObjs[0]
          allChannels = subObjs[1]
        }
      })
    } else {
      // Root application view
      // Get subscription data for all applications
      Object.keys(applications.items).forEach(appIndex => {
        if (applications.items[appIndex].hubSubscriptions) {
          const subObjs = getSubObjs(
            applications.items[appIndex].hubSubscriptions,
            allSubscriptions,
            allChannels
          )
          allSubscriptions = subObjs[0]
          allChannels = subObjs[1]
        }
      })
    }

    if (allChannels.length > 0) {
      // Remove duplicate channels (that were found in more than one app)
      allChannels = R.uniq(allChannels)
    }

    if (allSubscriptions.length > 0) {
      // Remove duplicate subscriptions (that were found in more than one app)
      allSubscriptions = R.uniq(allSubscriptions)

      // Increment "no status" and "failed" counts using the new non-duplicated subscriptions list
      Object.keys(allSubscriptions).forEach(key => {
        if (
          allSubscriptions[key].status === undefined ||
          allSubscriptions[key].status === ''
        ) {
          noStatusSubsCount++
        } else if (
          allSubscriptions[key].status.toLowerCase() !== 'propagated'
        ) {
          failedSubsCount++
        }
      })
    }
  }

  return {
    total: allSubscriptions.length,
    failed: failedSubsCount,
    noStatus: noStatusSubsCount,
    channels: allChannels.length
  }
}

export const getSubscriptionDataOnManagedClustersSingle = (
  applications,
  applicationName,
  applicationNamespace
) => {
  var managedClusterCount = 0
  var allSubscriptions = 0
  var failedSubsCount = 0
  var noStatusSubsCount = 0

  if (applications && applications.items) {
    Object.keys(applications.items).forEach(appIndex => {
      // Get subscription data for the current application opened
      if (
        applications.items[appIndex].name === applicationName &&
        applications.items[appIndex].namespace === applicationNamespace
      ) {
        applications.items[appIndex].clusterCount !== undefined &&
          (managedClusterCount = applications.items[appIndex].clusterCount)
        // Increment counts if the data exists
        if (applications.items[appIndex].remoteSubscriptionStatusCount) {
          const subData =
            applications.items[appIndex].remoteSubscriptionStatusCount
          subData.Failed !== undefined && (failedSubsCount = subData.Failed)
          subData.null !== undefined && (noStatusSubsCount = subData.null)
          allSubscriptions = failedSubsCount + noStatusSubsCount
          subData.Subscribed !== undefined &&
            (allSubscriptions += subData.Subscribed)
        }
      }
    })
  }

  return {
    clusters: managedClusterCount,
    total: allSubscriptions,
    failed: failedSubsCount,
    noStatus: noStatusSubsCount
  }
}

export const getSubscriptionDataOnManagedClustersRoot = applications => {
  var managedClusterCount = 0
  var allSubscriptions = 0
  var failedSubsCount = 0
  var noStatusSubsCount = 0

  if (applications && applications.items) {
    applications.items.clusterCount !== undefined &&
      (managedClusterCount = applications.items.clusterCount)
    // Increment counts if the data exists
    if (applications.items.remoteSubscriptionStatusCount) {
      const subData = applications.items.remoteSubscriptionStatusCount
      subData.Failed !== undefined && (failedSubsCount = subData.Failed)
      subData.null !== undefined && (noStatusSubsCount = subData.null)
      allSubscriptions = failedSubsCount + noStatusSubsCount
      subData.Subscribed !== undefined &&
        (allSubscriptions += subData.Subscribed)
    }
  }

  return {
    clusters: managedClusterCount,
    total: allSubscriptions,
    failed: failedSubsCount,
    noStatus: noStatusSubsCount
  }
}

export const getPodData = (
  applications,
  applicationName,
  applicationNamespace
) => {
  var allPods = 0
  var runningPods = 0
  var failedPods = 0
  var inProgressPods = 0

  if (applications && applications.items) {
    Object.keys(applications.items).forEach(appIndex => {
      // Get pod data for the current application opened
      if (
        applications.items[appIndex].name === applicationName &&
        applications.items[appIndex].namespace === applicationNamespace &&
        applications.items[appIndex].podStatusCount
      ) {
        // Increment counts if the data exists
        const podData = applications.items[appIndex].podStatusCount
        const podStatuses = Object.keys(podData)
        podStatuses.forEach(status => {
          if (
            status.toLowerCase() === 'running' ||
            status.toLowerCase() === 'pass' ||
            status.toLowerCase() === 'deployed'
          ) {
            runningPods += podData[status]
          } else if (
            status.toLowerCase() === 'pending' ||
            status.toLowerCase().includes('progress')
          ) {
            inProgressPods += podData[status]
          } else if (
            status.toLowerCase().includes('fail') ||
            status.toLowerCase().includes('error') ||
            status.toLowerCase().includes('backoff')
          ) {
            failedPods += podData[status]
          } else {
            allPods += podData[status]
          }
        })
        allPods += runningPods + failedPods + inProgressPods
      }
    })
  }

  return {
    total: allPods,
    running: runningPods,
    failed: failedPods,
    inProgress: inProgressPods
  }
}

export const getIncidentsData = CEMIncidentList => {
  var priority1 = 0
  var priority2 = 0

  // Get incidents data for the current application opened
  if (CEMIncidentList && CEMIncidentList.items) {
    Object.keys(CEMIncidentList.items).forEach(listIndex => {
      const item = CEMIncidentList.items[listIndex]
      if (item.priority === 1) {
        priority1++
      } else if (item.priority === 2) {
        priority2++
      }
    })
  }

  return {
    priority1: priority1,
    priority2: priority2
  }
}
