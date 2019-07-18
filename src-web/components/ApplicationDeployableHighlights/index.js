/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2017, 2019. All Rights Reserved.
 *
 * Note to U.S. Government Users Restricted Rights:
 * Use, duplication or disclosure restricted by GSA ADP Schedule
 * Contract with IBM Corp.
 *******************************************************************************/

import React from '../../../node_modules/react';
import CountsCardModule from '../CountsCardModule';
import msgs from '../../../nls/platform.properties';
import { connect } from '../../../node_modules/react-redux';
import resources from '../../../lib/shared/resources';

resources(() => {
  require('./style.scss');
});

const mapStateToProps = (state) => {
  const { } = state;

  const countsCardDataGeneralInfo = [
    {
      msgKey: 'dashboard.card.deployable.versions',
      count: 5,
    },
    {
      msgKey: 'dashboard.card.deployable.completed',
      count: 3,
    },
    {
      msgKey: 'dashboard.card.deployable.failed',
      count: 1,
    },
    {
      msgKey: 'dashboard.card.deployable.inProgress',
      count: 1,
    },
    {
      msgKey: 'dashboard.card.deployable.pending',
      count: 0,
    },
  ];
  const countsCardDataIncidents = [
    {
      msgKey: 'dashboard.card.deployable.incidents',
      count: 1,
    },
  ];

  return {
    countsCardDataGeneralInfo,
    countsCardDataIncidents,
  };
};

class ApplicationDeployableHighlights extends React.Component {
  componentDidMount() { }
  componentWillUnmount() { }

  render() {
    const { locale } = this.context;
    const { countsCardDataGeneralInfo, countsCardDataIncidents } = this.props;

    return (
      <React.Fragment>
        <div id="ApplicationDeployableHighlights">
          <div className="deployable-highlights-header">
            {msgs.get('description.title.deployableHighlights', locale)}
          </div>

          <div className="deployable-highlights-container">
            <div className="deployable-highlights-info">
              <CountsCardModule
                data={countsCardDataGeneralInfo}
              />
            </div>
            <div className="deployable-highlights-incidents">
              <CountsCardModule
                data={countsCardDataIncidents}
              />
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default connect(mapStateToProps)(ApplicationDeployableHighlights);
