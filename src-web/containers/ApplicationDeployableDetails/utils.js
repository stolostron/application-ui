/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2017, 2019. All Rights Reserved.
 *
 * Note to U.S. Government Users Restricted Rights:
 * Use, duplication or disclosure restricted by GSA ADP Schedule
 * Contract with IBM Corp.
 *******************************************************************************/

import msgs from '../../../nls/platform.properties';

// This method constructs the breadCrumbs for the application deployable details
export const getBreadCrumbs = (deployableParams, locale) => {
  if (deployableParams) {
    const breadCrumbs = [
      {
        label: msgs.get('dashboard.card.deployment.applications', locale),
        url: '/multicloud/mcmapplications',
      },
      {
        label: `${deployableParams.application || ''}`,
        url: `/multicloud/mcmapplications/${deployableParams.namespace ||
          ''}/${deployableParams.application || ''}`,
      },
      {
        label: `${deployableParams.name || ''}`,
        url: `/multicloud/mcmapplications/${deployableParams.namespace ||
          ''}/${deployableParams.application ||
          ''}/deployable/${deployableParams.name || ''}`,
      },
    ];

    return breadCrumbs;
  }
  return [
    {
      label: msgs.get('dashboard.card.deployment.applications', locale),
      url: '/multicloud/mcmapplications',
    },
  ];
};
