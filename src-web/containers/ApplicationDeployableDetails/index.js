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
import {
  updateSecondaryHeader, /* , fetchResource */
} from '../../actions/common';
import { getBreadCrumbs } from './utils';
import ApplicationDeployableHighlights from '../../components/ApplicationDeployableHighlights';
import ApplicationDeployableSubscription from '../../components/ApplicationDeployableSubscription';
import ApplicationDeployableVersionStatus from '../../components/ApplicationDeployableVersionStatus';

resources(() => {
  require('./style.scss');
});

const mapDispatchToProps = (dispatch) => {
  return {
    updateSecondaryHeaderInfo: (title, breadCrumbs) =>
      dispatch(updateSecondaryHeader(title, [], breadCrumbs, [])),
  };
};

const mapStateToProps = (state) => {
  const { } = state;
  return {};
};

class ApplicationDeployableDetails extends React.Component {
  componentWillMount() {
    const { updateSecondaryHeaderInfo, params } = this.props;
    const { locale } = this.context;
    const deployableParams =
      (params && params.match && params.match.params) || {};
    const breadCrumbs = getBreadCrumbs(deployableParams, locale);

    updateSecondaryHeaderInfo(deployableParams.name || '', breadCrumbs);
  }

  componentDidMount() { }

  componentWillUnmount() { }

  render() {
    const { params } = this.props;
    const { locale } = this.context;

    return (
      <div id="ApplicationDeployableDetails">

        <ApplicationDeployableHighlights />
        <ApplicationDeployableSubscription />
        <ApplicationDeployableVersionStatus />

      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ApplicationDeployableDetails);
