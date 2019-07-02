/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2017, 2019. All Rights Reserved.
 *
 * Note to U.S. Government Users Restricted Rights:
 * Use, duplication or disclosure restricted by GSA ADP Schedule
 * Contract with IBM Corp.
 *******************************************************************************/

import { createApplicationRows, createApplicationRowsLookUp } from './utils';

describe('createApplicationRows', () => {
  const data = [
    {
      deployables: [{ josh: 'hi' }, { dart: 'hi' }],
      metadata: { name: 'josh' },
    },
  ];
  const applicationDud = [{ itteemmss: [{ josh: 'hi' }, { dart: 'hi' }] }];
  it('should return a mapped object of application rows', () => {
    const result = [
      {
        id: 'josh',
        name: 'josh',
        deployables: [{ josh: 'hi' }, { dart: 'hi' }],
      },
    ];
    expect(createApplicationRows(data)).toEqual(result);
  });
  it('should return default data', () => {
    const result = [{ id: '', name: '', deployables: [] }];
    expect(createApplicationRows(applicationDud)).toEqual(result);
  });
  it('should handle undefined object', () => {
    expect(createApplicationRows(undefined)).toEqual({});
  });
});

describe('createApplicationRowsLookUp', () => {
  const data = [
    {
      deployables: [{ josh: 'hi' }, { dart: 'hi' }],
      metadata: { name: 'josh' },
    },
  ];
  const applicationDud = [{ itteemmss: [{ josh: 'hi' }, { dart: 'hi' }] }];
  it('should return a mapped object of application rows for reference', () => {
    const result = {
      josh: {
        deployables: [{ josh: 'hi' }, { dart: 'hi' }],
        id: 'josh',
        name: 'josh',
      },
    };
    expect(createApplicationRowsLookUp(data)).toEqual(result);
  });
  it('should return default data for reference', () => {
    const result = { default: { id: '', name: '', deployables: [] } };
    expect(createApplicationRowsLookUp(applicationDud)).toEqual(result);
  });
  it('should handle undefined object for reference', () => {
    expect(createApplicationRowsLookUp(undefined)).toEqual({});
  });
});
