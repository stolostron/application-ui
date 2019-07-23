/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2017, 2019. All Rights Reserved.
 *
 * Note to U.S. Government Users Restricted Rights:
 * Use, duplication or disclosure restricted by GSA ADP Schedule
 * Contract with IBM Corp.
 *******************************************************************************/

import msgs from '../../../nls/platform.properties'
import config from '../../../lib/shared/config'

// This method constructs the breadCrumbs for the application deployable details
export const getBreadCrumbs = (deployableParams, locale) => {
  if (deployableParams) {
    const breadCrumbs = [
      {
        label: msgs.get('dashboard.card.deployment.applications', locale),
        url: `${config.contextPath}`,
      },
      {
        label: `${deployableParams.application || ''}`,
        url: `${
          config.contextPath
        }/${deployableParams.namespace ||
          ''}/${deployableParams.application || ''}`,
      },
      {
        label: `${deployableParams.name || ''}`,
        url: `${
          config.contextPath
        }/${deployableParams.namespace ||
          ''}/${deployableParams.application ||
          ''}/deployable/${deployableParams.name || ''}`,
      },
    ]

    return breadCrumbs
  }
  return [
    {
      label: msgs.get('dashboard.card.deployment.applications', locale),
      url: `${config.contextPath}`,
    },
  ]
}
