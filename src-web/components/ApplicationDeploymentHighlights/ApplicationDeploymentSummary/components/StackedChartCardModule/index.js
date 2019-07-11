/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2019. All Rights Reserved.
 *
 * Note to U.S. Government Users Restricted Rights:
 * Use, duplication or disclosure restricted by GSA ADP Schedule
 * Contract with IBM Corp.
 *******************************************************************************/

import React from 'react';
import { withLocale } from '../../../../../providers/LocaleProvider';
import resources from '../../../../../../lib/shared/resources';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { getChartKeyColor, getChartKeyName, getModuleData } from './utils';


const StackedChartCardModule = withLocale(({ data, locale }) => {

    const moduleData = getModuleData(data);
    return (
      <BarChart
        width={300}
        height={250}
        data={moduleData.chartCardItems}
        margin={{
          top: 20,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
       <CartesianGrid strokeDasharray="3 3" vertical={false} />
        <XAxis
          dataKey="name"
          tick={{ fontSize: 10, transform: 'translate(0, 12)' }}
          interval="preserveStartEnd"
          tickSize={10}
          tickLine={{ stroke: '#DFE3E6', transform: 'translate(0, 6)' }}
          axisLine={false}
        />
        <YAxis
          tick={{ fontSize: 12, transform: 'translate(-5, 0)' }}
          tickLine={false}
          axisLine={false}
          tickCount={4}
          width={43}
        />
        <Tooltip />
        <Bar
          barSize={30}
          legendType="circle"
          dataKey="cm"
          stackId="a"
          fill={getChartKeyColor('cm')}
          name={getChartKeyName('cm', locale)}
        />
        <Bar
          dataKey="pr"
          stackId="a"
          fill={getChartKeyColor('pr')}
          name={getChartKeyName('pr', locale)}
        />
        <Bar
          dataKey="fl"
          stackId="a"
          fill={getChartKeyColor('fl')}
          name={getChartKeyName('fl', locale)}
        />
      </BarChart>
  );
});

StackedChartCardModule.propTypes = {};

export default withLocale(StackedChartCardModule);