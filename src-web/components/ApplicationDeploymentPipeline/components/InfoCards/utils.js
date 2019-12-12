/*******************************************************************************
 * Licensed Materials - Property of IBM
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
// import { CEMIncidentList } from '../../../../../lib/client/queries'

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
          if (
            subelem.channel &&
            !subelem._hostingSubscription &&
            (!subelem.status ||
              (subelem.status && subelem.status != 'Subscribed'))
          ) {
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
        // Get number of placement rules for the current application opened
        if (
          applications.items[appIndex].name === applicationName &&
          applications.items[appIndex].namespace === applicationNamespace
        ) {
          const appData = applications.items[appIndex]
          // Placement rule data found in "related" object
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
      // Get number of placement rules for all applications
      Object.keys(applications.items).map(appIndex => {
        const appData = applications.items[appIndex]
        // Placement rule data found in "related" object
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
      // Remove duplicate placement rules (that were found in more than one app)
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
  var allSubscriptions = []
  var failedSubscriptions = []
  var noStatusSubscriptions = []

  if (applications && applications.items) {
    // Single application view
    if (isSingleApplicationView) {
      Object.keys(applications.items).map(appIndex => {
        // Get number of subscriptions for the current application opened
        if (
          applications.items[appIndex].name === applicationName &&
          applications.items[appIndex].namespace === applicationNamespace
        ) {
          const appData = applications.items[appIndex]
          // Hub subscription data found in "related" object
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
                  // Add each item to "all subscriptions" list
                  allSubscriptions = allSubscriptions.concat(subObj)
                  // Populate "no status" and "failed" lists based on the subscription's status
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
      // Get number of subscriptions for all applications
      Object.keys(applications.items).map(appIndex => {
        const appData = applications.items[appIndex]
        // Hub subscription data found in "related" object
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
      // Remove duplicate subscriptions (that were found in more than one app)
      allSubscriptions = removeDuplicatesFromList(allSubscriptions)

      // Populate "no status" and "failed" lists using the new non-duplicate subscriptions list
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
  var allSubscriptions = []
  var failedSubscriptions = []
  var noStatusSubscriptions = []

  if (applications && applications.items) {
    // Single application view
    if (isSingleApplicationView) {
      Object.keys(applications.items).map(appIndex => {
        // Get number of managed cluster subs for the current application opened
        if (
          applications.items[appIndex].name === applicationName &&
          applications.items[appIndex].namespace === applicationNamespace
        ) {
          const appData = applications.items[appIndex]
          // Managed cluster subscription data found in "remoteSubs" object
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
                // Add each item to "all subscriptions" list
                allSubscriptions = allSubscriptions.concat(subObj)
                // Populate "no status" and "failed" lists based on the subscription's status
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
      // Get number of managed cluster subs for all applications
      Object.keys(applications.items).map(appIndex => {
        const appData = applications.items[appIndex]
        // Managed cluster subscription data found in "remoteSubs" object
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
      // Remove duplicate managed cluster subs (that were found in more than one app)
      allSubscriptions = removeDuplicatesFromList(allSubscriptions)

      // Populate "no status" and "failed" lists using the new non-duplicate subscriptions list
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
  var allPods = 0
  var runningPods = 0
  var failedPods = 0

  if (applications && applications.items) {
    Object.keys(applications.items).map(appIndex => {
      // Get pod data for the current application opened
      if (
        applications.items[appIndex].name === applicationName &&
        applications.items[appIndex].namespace === applicationNamespace
      ) {
        const appData = applications.items[appIndex]
        // Pod data found in "related" object
        if (appData.related) {
          Object.keys(appData.related).map(kindIndex => {
            if (appData.related[kindIndex].kind.toLowerCase() === 'pod') {
              const pods = appData.related[kindIndex].items
              Object.keys(pods).map(podIndex => {
                const podStatus = pods[podIndex].status
                allPods++
                if (
                  podStatus.toLowerCase() === 'deployed' ||
                  podStatus.toLowerCase() === 'pass' ||
                  podStatus.toLowerCase() === 'running'
                ) {
                  runningPods++
                } else if (
                  podStatus.toLowerCase() === 'fail' ||
                  podStatus.toLowerCase() === 'error' ||
                  podStatus.toLowerCase() === 'imagepullbackoff'
                ) {
                  failedPods++
                }
              })
            }
          })
        }
      }
    })
  }

  return {
    total: allPods,
    running: runningPods,
    failed: failedPods
  }
}

export const getPolicyViolationData = (
  applications,
  applicationName,
  applicationNamespace
) => {
  var VAViolations = 0
  var MAViolations = 0

  if (applications && applications.items) {
    Object.keys(applications.items).map(appIndex => {
      // Get policy violation data for the current application opened
      if (
        applications.items[appIndex].name === applicationName &&
        applications.items[appIndex].namespace === applicationNamespace
      ) {
        const appData = applications.items[appIndex]
        // Policy violation data found in "related" object
        if (appData.related) {
          Object.keys(appData.related).map(kindIndex => {
            if (
              appData.related[kindIndex].kind.toLowerCase() === 'mutationpolicy'
            ) {
              MAViolations = appData.related[kindIndex].items.length
            }
            if (
              appData.related[kindIndex].kind.toLowerCase() ===
              'vulnerabilitypolicy'
            ) {
              VAViolations = appData.related[kindIndex].items.length
            }
          })
        }
      }
    })
  }

  return {
    VAViolations: VAViolations,
    MAViolations: MAViolations
  }
}

export const getIncidentData = CEMIncidentList => {
  var priority1 = 0
  var priority2 = 0

  // Get incidents data for the current application opened
  if (CEMIncidentList && CEMIncidentList.items) {
    Object.keys(CEMIncidentList.items).map(listIndex => {
      const item = CEMIncidentList.items[listIndex]
      if (item.priority == 1) {
        priority1++
      } else if (item.priority == 2) {
        priority2++
      }
    })
  }

  return {
    priority1: priority1,
    priority2: priority2
  }
}
