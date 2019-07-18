/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2017, 2019. All Rights Reserved.
 *
 * Note to U.S. Government Users Restricted Rights:
 * Use, duplication or disclosure restricted by GSA ADP Schedule
 * Contract with IBM Corp.
 *******************************************************************************/

import React from 'react';
import { connect } from 'react-redux';
import resources from '../../../lib/shared/resources';
import { fetchResources, updateSecondaryHeader } from '../../actions/common';
import { RESOURCE_TYPES } from '../../../lib/shared/constants';
import { getBreadCrumbs } from './utils';

resources(() => {
  require('./style.scss');
});

const mapDispatchToProps = (dispatch) => {
  return {
    fetchDeployables: () =>
      dispatch(fetchResources(RESOURCE_TYPES.HCM_DEPLOYABLE)),
    updateSecondaryHeaderInfo: (title, breadCrumbs) =>
      dispatch(updateSecondaryHeader(title, [], breadCrumbs, [])),
  };
};

const mapStateToProps = (state) => {
  const {} = state;
  console.log('state', state);
  return {};
};

class ApplicationDeployableDetails extends React.Component {
  componentWillMount() {
    const { updateSecondaryHeaderInfo, params, fetchDeployables } = this.props;
    const { locale } = this.context;
    const deployableParams =
      (params && params.match && params.match.params) || {};
    const breadCrumbs = getBreadCrumbs(deployableParams, locale);

    fetchDeployables();
    updateSecondaryHeaderInfo(deployableParams.name || '', breadCrumbs);
  }

  componentDidMount() {}

  componentWillUnmount() {}

  render() {
    const { params } = this.props;
    const { locale } = this.context;
    console.log('props', this.props);
    return <div id="ApplicationDeployableDetails" />;
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ApplicationDeployableDetails);
