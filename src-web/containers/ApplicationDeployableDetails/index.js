/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2017, 2019. All Rights Reserved.
 *
 * Note to U.S. Government Users Restricted Rights:
 * Use, duplication or disclosure restricted by GSA ADP Schedule
 * Contract with IBM Corp.
 *******************************************************************************/

import React from 'react';
import msgs from '../../../nls/platform.properties';
import { connect } from 'react-redux';
import resources from '../../../lib/shared/resources';

resources(() => {
  require('./style.scss');
});

const mapDispatchToProps = (dispatch) => {
  return {};
};

const mapStateToProps = (state) => {
  const {} = state;

  return {};
};

class ApplicationDeploymentPipeline extends React.Component {
  componentWillMount() {}

  componentDidMount() {}

  componentWillUnmount() {}

  render() {
    const {} = this.props;
    const { locale } = this.context;

    return <div id="ApplicationDeployableDetails">Hello World</div>;
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ApplicationDeploymentPipeline);
