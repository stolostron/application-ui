/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2017, 2019. All Rights Reserved.
 *
 * US Government Users Restricted Rights - Use, duplication or disclosure
 * restricted by GSA ADP Schedule Contract with IBM Corp.
 *******************************************************************************/

import R from 'ramda'

//input ['a', 'b', 'c', 'd'] , output {"data": ["a", "b", "+2"], "hover": "cd"}
//input ['a', 'b', 'c', 'd', 'e'] , output {"data": ["a", "b", "+3"], "hover": "cde"}
export const getLabelsListClass = list => {
  if (list.length > 2) {
    const placeholder = R.concat('+', list.length - 2)
    let result = R.insert(2, placeholder, list) //insert the placeholder label at position 3
    result = R.remove(3, list.length - 2, result) // remove everything after placeholder
    const lastElements = R.slice(2, list.length, list) //get all elements after first 2

    return {
      data: result,
      hover: R.join('', lastElements)
    }
  }
  return { data: list, hover: '' }
}

//input related from an HCMSubscription
export const getCsvListClass = related => {
  let list = []

  if (related) {
    const deployables = R.find(R.propEq('kind', 'deployable'))(related)
    if (deployables && deployables.items) {
      list = deployables.items.map(deployable => {
        return ` ${deployable.name}`
      })
    }
  }

  if (list.length > 6) {
    const placeholder = R.concat(list[5], '...')
    let result = R.insert(5, placeholder, list)
    result = R.remove(6, list.length - 5, result)
    const lastElements = R.slice(6, list.length, list)

    return {
      data: result,
      hover: R.join('', lastElements)
    }
  }
  return {
    data: list,
    hover: ''
  }
}

export const getSearchUrlDeployable = subName => {
  return (
    '/multicloud/search?filters={"textsearch":"kind%3Asubscription%20name%3A' +
    subName +
    '"}&showrelated=deployable'
  )
}

export const getSearchUrlCluster = subName => {
  return (
    '/multicloud/search?filters={"textsearch":"kind%3Asubscription%20name%3A' +
    subName +
    '"}&showrelated=cluster'
  )
}

export const getClusterCountForSub = (uid, applications) => {
  var numClusters = 0

  if (applications && applications.items) {
    Object.keys(applications.items).map(appIndex => {
      if (applications.items[appIndex].hubSubscriptions != undefined) {
        const subData = applications.items[appIndex].hubSubscriptions
        Object.keys(subData).map(subIndex => {
          if (
            subData[subIndex]._uid != undefined &&
            subData[subIndex]._uid === uid &&
            applications.items[appIndex].clusterCount != undefined
          ) {
            numClusters += applications.items[appIndex].clusterCount
          }
        })
      }
    })
  }

  return numClusters
}
