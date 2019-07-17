/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2017, 2019. All Rights Reserved.
 *
 * Note to U.S. Government Users Restricted Rights:
 * Use, duplication or disclosure restricted by GSA ADP Schedule
 * Contract with IBM Corp.
 *******************************************************************************/

import { getBreadCrumbs } from './utils';

describe('getBreadCrumbs', () => {
  const deployableParams = {
    application: 'dragoon',
    namespace: 'hellena',
    name: 'dart',
  };
  const locale = 'en';
  const deployableParamsDud = [{ itteemmss: [{ josh: 'hi' }, { dart: 'hi' }] }];
  it('should return an object of breadCrumbs used for the deployable details page', () => {
    const result = [
      { label: 'Applications', url: '/multicloud/mcmapplications' },
      { label: 'dragoon', url: '/multicloud/mcmapplications/hellena/dragoon' },
      {
        label: 'dart',
        url: '/multicloud/mcmapplications/hellena/dragoon/deployable/dart',
      },
    ];
    expect(getBreadCrumbs(deployableParams, locale)).toEqual(result);
  });
  it('should return an object of breadCrumbs used for the deployable details page with empty data', () => {
    const result = [
      { label: 'Applications', url: '/multicloud/mcmapplications' },
      { label: '', url: '/multicloud/mcmapplications//' },
      { label: '', url: '/multicloud/mcmapplications///deployable/' },
    ];
    expect(getBreadCrumbs(deployableParamsDud)).toEqual(result);
  });
  it('should handle undefined object', () => {
    const result = [
      { label: 'Applications', url: '/multicloud/mcmapplications' },
    ];
    expect(getBreadCrumbs(undefined)).toEqual(result);
  });
});
