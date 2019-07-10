/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2019. All Rights Reserved.
 *
 * Note to U.S. Government Users Restricted Rights:
 * Use, duplication or disclosure restricted by GSA ADP Schedule
 * Contract with IBM Corp.
 *******************************************************************************/

import React from "react";
import msgs from '../../../nls/platform.properties'
import resources from "../../../lib/shared/resources";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from "recharts";

resources(() => {
  require("../../../scss/counts-card-module.scss");
});


export default class StackedChartCardModule extends React.Component {

  getChartKeyColor = (value) => {
    switch (true) {
      case value === 'pr':
        return '#5A6872';
      case value === 'fl':
        return '#8c9ba5';
      case value === 'cm':
        return 'black';
    }
  }

  getChartKeyName = (value, locale) => {
    switch (true) {
      case value === 'pr':
        return msgs.get('channel.deploy.status.progress', locale);
      case value === 'fl':
        return msgs.get('channel.deploy.status.failed', locale);
      case value === 'cm':
        return msgs.get('channel.deploy.status.completed', locale);
    }
  }

  getModuleData = () => {
    const { data } = this.props
    const chartCardItems = []
    data.map(({ name, cm, pr, fl }, idx) => {
      chartCardItems.push({
        name,
        cm,
        pr,
        fl
      })
    })
    return {
      chartCardItems
    }
  }

  render() {
    const { locale } = this.props
    const moduleData = this.getModuleData();
    return (
      <BarChart
        width={300}
        height={250}
        data={moduleData.chartCardItems}
        margin={{
          top: 20,
          right: 30,
          left: 20,
          bottom: 5
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis
          dataKey='name'
          tick={{ fontSize: 10, transform: 'translate(0, 12)' }}
          interval={'preserveStartEnd'}
          tickSize={10}
          tickLine={{ stroke: '#DFE3E6', transform: 'translate(0, 6)' }}
          axisLine={false} />
        <YAxis
          tick={{ fontSize: 12, transform: 'translate(-5, 0)' }}
          tickLine={false}
          axisLine={false}
          tickCount={4}
          width={43} />
        <Tooltip />
        <Legend />
        <Bar dataKey="cm" stackId="a" fill={this.getChartKeyColor("cm")} name={this.getChartKeyName("cm", { locale })} />
        <Bar dataKey="pr" stackId="a" fill={this.getChartKeyColor("pr")} name={this.getChartKeyName("pr", { locale })} />
        <Bar dataKey="fl" stackId="a" fill={this.getChartKeyColor("fl")} name={this.getChartKeyName("fl", { locale })} />
      </BarChart>
    );
  }
}

StackedChartCardModule.propTypes = {
}
