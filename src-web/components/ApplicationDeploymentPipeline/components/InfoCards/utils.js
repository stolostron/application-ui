/*******************************************************************************
 * Licensed Materials - Property of IBM
 * 5737-E67
 * (c) Copyright IBM Corporation 2017, 2019. All Rights Reserved.
 *
 * US Government Users Restricted Rights - Use, duplication or disclosure
 * restricted by GSA ADP Schedule Contract with IBM Corp.
 *******************************************************************************/
import R from 'ramda'
import {
  getResourcesStatusPerChannel,
  getAllRelatedForList,
  removeDuplicatesFromList
} from '../PipelineGrid/utils'

// Method will take in an object and return back the status of related objects
// returns [completed + unidentified, fail, inprogress + pending]
// Given the tall count of completed + unidentified, fail, inprogress + pending
export const getAllDeployablesStatus = list => {
  const statusPassFailInProgress = [0, 0, 0]
  if (list && list.items instanceof Array && list.items.length > 0) {
    list.items.map(item => {
      // Will return back status as:
      // [0, 0, 0, 0, 0]
      // Pass, Fail, InProgress, Pending, Unidentified
      const status = getResourcesStatusPerChannel(item, false)
      statusPassFailInProgress[0] =
        statusPassFailInProgress[0] + status[0] + status[4]
      statusPassFailInProgress[1] = statusPassFailInProgress[1] + status[1]
      statusPassFailInProgress[2] =
        statusPassFailInProgress[2] + status[2] + status[3]
    })
  }
  return statusPassFailInProgress
}

export const getNumClusters = (applications, allsubscriptions) => {
  if (allsubscriptions && allsubscriptions.items) {
    const subscriptionsInApp = getAllRelatedForList(
      applications,
      'subscription'
    )

    if (subscriptionsInApp && subscriptionsInApp.length > 0) {
      const subscriptionForSearch = allsubscriptions.items.map(item => {
        if (item && item.name && item.namespace) {
          for (var i = 0; i < subscriptionsInApp.length; i++) {
            const sappitem = subscriptionsInApp[i]

            if (
              sappitem &&
              sappitem.name &&
              sappitem.namespace &&
              sappitem.name === item.name &&
              sappitem.namespace === item.namespace
            )
              return item
          }
        }
      })

      const removeUndefined = x => x !== undefined
      const emptyArray = []
      const removedUndefinedSubscriptions = R.filter(
        removeUndefined,
        subscriptionForSearch
      )
      const resultList = emptyArray.concat.apply(
        [],
        removedUndefinedSubscriptions
      )
      const allRelatedForList =
        getAllRelatedForList({ items: resultList }, 'cluster').length - 1 // Don't count hub cluster, only managed clusters
      if (allRelatedForList <= 0) {
        return 0
      } else {
        return allRelatedForList
      }
    }
  }

  return 0
}

export const getNumIncidents = list => {
  if (list && list.items && Array.isArray(list.items)) {
    return list.items.length
  }
  return 0
}

export const getApplicationName = list => {
  if (
    list &&
    list.items instanceof Array &&
    list.items.length > 0 &&
    list.items[0].name
  ) {
    return list.items[0].name
  }
  return ''
}

export const getApplicationNamespace = list => {
  if (
    list &&
    list.items instanceof Array &&
    list.items.length > 0 &&
    list.items[0].namespace
  ) {
    return list.items[0].namespace
  }
  return ''
}

export const getSingleApplicationObject = list => {
  if (list && list.items instanceof Array && list.items.length > 0) {
    return list.items[0]
  }
  return ''
}

export const getChannelsCountFromSubscriptions = arr => {
  const channelSet = new Set()
  if (arr instanceof Array && arr.length > 0) {
    arr.map(elem => {
      if (elem && elem.items instanceof Array && elem.items.length > 0) {
        elem.items.map(subelem => {
          if (subelem.channel && !subelem._hostingSubscription) {
            // count only hub subscriptions
            channelSet.add(subelem.channel)
          }
        })
      }
    })
  }
  return channelSet.size
}

export const getNumPlacementRules = (
  applications,
  isSingleApplicationView,
  applicationName,
  applicationNamespace
) => {
  if (applications && applications.items) {
    var allPlacementRules = []

    // Single application view
    if (isSingleApplicationView) {
      Object.keys(applications.items).map(appIndex => {
        if (
          applications.items[appIndex].name === applicationName &&
          applications.items[appIndex].namespace === applicationNamespace
        ) {
          const appData = applications.items[appIndex]
          if (appData.related) {
            Object.keys(appData.related).map(kindIndex => {
              if (
                appData.related[kindIndex].kind.toLowerCase() ===
                'placementrule'
              ) {
                const placementRules = appData.related[kindIndex].items
                Object.keys(placementRules).map(prIndex => {
                  const prObj = {
                    name: placementRules[prIndex].name,
                    namespace: placementRules[prIndex].namespace
                  }
                  allPlacementRules = allPlacementRules.concat(prObj)
                })
              }
            })
          }
        }
      })
    } else {
      // Root application view
      Object.keys(applications.items).map(appIndex => {
        const appData = applications.items[appIndex]
        if (appData.related) {
          Object.keys(appData.related).map(kindIndex => {
            if (
              appData.related[kindIndex].kind.toLowerCase() === 'placementrule'
            ) {
              const placementRules = appData.related[kindIndex].items
              Object.keys(placementRules).map(prIndex => {
                const prObj = {
                  name: placementRules[prIndex].name,
                  namespace: placementRules[prIndex].namespace
                }
                allPlacementRules = allPlacementRules.concat(prObj)
              })
            }
          })
        }
      })
      allPlacementRules = removeDuplicatesFromList(allPlacementRules)
    }
    return allPlacementRules.length
  }
  return 0
}

export const getSubscriptionDataOnHub = (
  applications,
  isSingleApplicationView,
  applicationName,
  applicationNamespace
) => {
  if (applications && applications.items) {
    var allSubscriptions = []
    var failedSubscriptions = []
    var noStatusSubscriptions = []

    // Single application view
    if (isSingleApplicationView) {
      Object.keys(applications.items).map(appIndex => {
        if (
          applications.items[appIndex].name === applicationName &&
          applications.items[appIndex].namespace === applicationNamespace
        ) {
          const appData = applications.items[appIndex]
          if (appData.related) {
            Object.keys(appData.related).map(kindIndex => {
              if (
                appData.related[kindIndex].kind.toLowerCase() === 'subscription'
              ) {
                const subscriptions = appData.related[kindIndex].items
                Object.keys(subscriptions).map(subIndex => {
                  const subObj = {
                    name: subscriptions[subIndex].name,
                    namespace: subscriptions[subIndex].namespace,
                    status: subscriptions[subIndex].status
                  }
                  allSubscriptions = allSubscriptions.concat(subObj)
                  if (subObj.status === '') {
                    noStatusSubscriptions = noStatusSubscriptions.concat(
                      subObj
                    )
                  } else if (subObj.status.toLowerCase() !== 'propagated') {
                    failedSubscriptions = failedSubscriptions.concat(subObj)
                  }
                })
              }
            })
          }
        }
      })
    } else {
      // Root application view
      Object.keys(applications.items).map(appIndex => {
        const appData = applications.items[appIndex]
        if (appData.related) {
          Object.keys(appData.related).map(kindIndex => {
            if (
              appData.related[kindIndex].kind.toLowerCase() === 'subscription'
            ) {
              const subscriptions = appData.related[kindIndex].items
              Object.keys(subscriptions).map(subIndex => {
                const subObj = {
                  name: subscriptions[subIndex].name,
                  namespace: subscriptions[subIndex].namespace,
                  status: subscriptions[subIndex].status
                }
                allSubscriptions = allSubscriptions.concat(subObj)
              })
            }
          })
        }
      })
      allSubscriptions = removeDuplicatesFromList(allSubscriptions)

      Object.keys(allSubscriptions).map(key => {
        if (allSubscriptions[key].status === '') {
          noStatusSubscriptions = noStatusSubscriptions.concat(
            allSubscriptions[key]
          )
        } else if (
          allSubscriptions[key].status.toLowerCase() !== 'propagated'
        ) {
          failedSubscriptions = failedSubscriptions.concat(
            allSubscriptions[key]
          )
        }
      })
    }
  }

  return {
    total: allSubscriptions.length,
    failed: failedSubscriptions.length,
    noStatus: noStatusSubscriptions.length
  }
}

export const getSubscriptionDataOnManagedClusters = (
  applications,
  isSingleApplicationView,
  applicationName,
  applicationNamespace
) => {
  if (applications && applications.items) {
    var allSubscriptions = []
    var failedSubscriptions = []
    var noStatusSubscriptions = []

    // Single application view
    if (isSingleApplicationView) {
      Object.keys(applications.items).map(appIndex => {
        if (
          applications.items[appIndex].name === applicationName &&
          applications.items[appIndex].namespace === applicationNamespace
        ) {
          const appData = applications.items[appIndex]
          if (appData.remoteSubs) {
            Object.keys(appData.remoteSubs).map(kindIndex => {
              if (
                appData.remoteSubs[kindIndex].kind.toLowerCase() ===
                'subscription'
              ) {
                const subscriptions = appData.remoteSubs[kindIndex]
                const subObj = {
                  name: subscriptions.name,
                  namespace: subscriptions.namespace,
                  status: subscriptions.status
                }
                allSubscriptions = allSubscriptions.concat(subObj)
                if (subObj.status === '') {
                  noStatusSubscriptions = noStatusSubscriptions.concat(subObj)
                } else if (subObj.status.toLowerCase() !== 'subscribed') {
                  failedSubscriptions = failedSubscriptions.concat(subObj)
                }
              }
            })
          }
        }
      })
    } else {
      // Root application view
      Object.keys(applications.items).map(appIndex => {
        const appData = applications.items[appIndex]
        if (appData.remoteSubs) {
          Object.keys(appData.remoteSubs).map(kindIndex => {
            if (
              appData.remoteSubs[kindIndex].kind.toLowerCase() ===
              'subscription'
            ) {
              const subscriptions = appData.remoteSubs[kindIndex]
              const subObj = {
                name: subscriptions.name,
                namespace: subscriptions.namespace,
                status: subscriptions.status
              }
              allSubscriptions = allSubscriptions.concat(subObj)
            }
          })
        }
      })
      allSubscriptions = removeDuplicatesFromList(allSubscriptions)

      Object.keys(allSubscriptions).map(key => {
        if (allSubscriptions[key].status === '') {
          noStatusSubscriptions = noStatusSubscriptions.concat(
            allSubscriptions[key]
          )
        } else if (
          allSubscriptions[key].status.toLowerCase() !== 'subscribed'
        ) {
          failedSubscriptions = failedSubscriptions.concat(
            allSubscriptions[key]
          )
        }
      })
    }
  }

  return {
    total: allSubscriptions.length,
    failed: failedSubscriptions.length,
    noStatus: noStatusSubscriptions.length
  }
}

export const getPodData = (
  applications,
  applicationName,
  applicationNamespace
) => {
  if (applications && applications.items) {
    var allPods = []
    var runningPods = []
    var failedPods = []

    Object.keys(applications.items).map(appIndex => {
      if (
        applications.items[appIndex].name === applicationName &&
        applications.items[appIndex].namespace === applicationNamespace
      ) {
        const appData = applications.items[appIndex]
        if (appData.related) {
          Object.keys(appData.related).map(kindIndex => {
            if (appData.related[kindIndex].kind.toLowerCase() === 'pod') {
              const pods = appData.related[kindIndex].items
              Object.keys(pods).map(podIndex => {
                const podObj = {
                  name: pods[podIndex].name,
                  namespace: pods[podIndex].namespace,
                  status: pods[podIndex].status
                }
                allPods = allPods.concat(podObj)
                if (
                  podObj.status.toLowerCase() === 'deployed' ||
                  podObj.status.toLowerCase() === 'pass' ||
                  podObj.status.toLowerCase() === 'running'
                ) {
                  runningPods = runningPods.concat(podObj)
                } else if (
                  podObj.status.toLowerCase() === 'fail' ||
                  podObj.status.toLowerCase() === 'error' ||
                  podObj.status.toLowerCase() === 'imagepullbackoff'
                ) {
                  failedPods = failedPods.concat(podObj)
                }
              })
            }
          })
        }
      }
    })
  }

  return {
    total: allPods.length,
    running: runningPods.length,
    failed: failedPods.length
  }
}
