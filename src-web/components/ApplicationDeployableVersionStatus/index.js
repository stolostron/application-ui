/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2017, 2019. All Rights Reserved.
 *
 * Note to U.S. Government Users Restricted Rights:
 * Use, duplication or disclosure restricted by GSA ADP Schedule
 * Contract with IBM Corp.
 *******************************************************************************/

import React from '../../../node_modules/react';
import msgs from '../../../nls/platform.properties';
import { withLocale } from '../../providers/LocaleProvider';
import { connect } from '../../../node_modules/react-redux';
import resources from '../../../lib/shared/resources';

resources(() => {
  require('./style.scss');
});

const mapStateToProps = (state) => {
  const { } = state;
  return {};
};


const ApplicationDeployableVersionStatus = withLocale(({ locale }) => {

  return (<div id="ApplicationDeployableVersionStatus">
    <div className="deployable-versionStatus-header">
      {msgs.get('description.title.deployableVersionStatus', locale)}
    </div>
  </div>);

});

export default withLocale(ApplicationDeployableVersionStatus);
