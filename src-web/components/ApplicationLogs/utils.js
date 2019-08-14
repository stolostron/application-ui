/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2017, 2019. All Rights Reserved.
 *
 * Note to U.S. Government Users Restricted Rights:
 * Use, duplication or disclosure restricted by GSA ADP Schedule
 * Contract with IBM Corp.
 *******************************************************************************/

import R from 'ramda'

// Handle the actions needed to be taken when the user selects a POD
// Set the current POD data and also fetch the conntainers
export const handlePodChange = (
  event,
  fetchContainersForPod,
  podData,
  setCurrentPod
) => {
  // Get the selected POD from the event and reset container data
  setCurrentPod(event.selectedItem)
  const nameMatch = n => n.name == event.selectedItem
  const selectedPod = R.filter(nameMatch, podData[0].items)
  fetchContainersForPod(
    selectedPod[0].selfLink,
    selectedPod[0].namespace,
    selectedPod[0].name,
    selectedPod[0].cluster
  )
}

export const handleContainerChange = (
  event,
  fetchLogsForContainer,
  podData,
  containerData,
  setCurrentContainer,
  setLogData,
  currentSelectedPod
) => {
  setCurrentContainer(event.selectedItem)

  const nameMatch = n => n.name == event.selectedItem
  const selectedContainer = R.filter(
    nameMatch,
    containerData.data.getResource.spec.containers
  )

  // getting the pod based on the known pod name
  const podNameMatch = n => n.name == currentSelectedPod
  const selectedPod = R.filter(podNameMatch, podData[0].items)

  // containerName, podName, podNamespace, clusterName

  const containerName = selectedContainer[0].name
  const podName = selectedPod[0].name
  const podNamespace = selectedPod[0].namespace
  const clusterName = selectedPod[0].cluster

  fetchLogsForContainer(containerName, podName, podNamespace, clusterName)
}

export const getPodsFromApplicationRelated = HCMApplicationList => {
  if (
    HCMApplicationList &&
    HCMApplicationList.items &&
    HCMApplicationList.items[0] &&
    HCMApplicationList.items[0].related
  ) {
    const appsRelated = HCMApplicationList.items[0].related
    const isKind = n => n.kind == 'pod'
    const appDeployables = R.filter(isKind, appsRelated)
    return appDeployables
  }
  return []
}
