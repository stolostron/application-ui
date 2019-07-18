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
import { connect } from '../../../node_modules/react-redux';
import resources from '../../../lib/shared/resources';

resources(() => {
  require('./style.scss');
});

const mapStateToProps = (state) => {
  const { } = state;
  return {};
};

class ApplicationDeployableHighlights extends React.Component {
  componentDidMount() { }
  componentWillUnmount() { }

  render() {
    const { locale } = this.context;

    return (
      <div id="ApplicationDeployableHighlights">
        <div className="deployable-highlights-header">
          {msgs.get('description.title.deployableHighlights', locale)}
        </div>
      </div>
    );
  }
}

export default connect(mapStateToProps)(ApplicationDeployableHighlights);
