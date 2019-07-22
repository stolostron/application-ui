/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2018, 2019. All Rights Reserved.
 *
 * Note to U.S. Government Users Restricted Rights:
 * Use, duplication or disclosure restricted by GSA ADP Schedule
 * Contract with IBM Corp.
 *******************************************************************************/

import React from 'react';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import { Loading } from 'carbon-components-react';
import { connect } from 'react-redux';
import CountsCardModule from '../CountsCardModule';
import ChannelsCardModule from '../ChannelsCardModule';
import StructuredListModule from '../../components/common/StructuredListModule';
import {
  getSingleResourceItem,
  resourceItemByName,
} from '../../reducers/common';
import {
  getNumDeployables,
  getNumDeployments,
  getNumFailedDeployments,
} from '../../../lib/client/resource-helper';
import { withLocale } from '../../providers/LocaleProvider';
import resources from '../../../lib/shared/resources';
import msgs from '../../../nls/platform.properties';

resources(() => {
  require('../../../scss/resource-overview.scss');
});

const ResourceOverview = withLocale(({ staticResourceData, item, params, modules, resourceType, showAppDetails, locale }) => {
  if (!item) { return <Loading withOverlay={false} className="content-spinner" />; }
  const modulesRight = [];
  const modulesBottom = [];
  React.Children.map(modules, (module) => {
    if (module.props.right) {
      modulesRight.push(React.cloneElement(module, {
        staticResourceData,
        resourceType,
        resourceData: item,
        params,
      }));
    } else {
      modulesBottom.push(React.cloneElement(module, {
        staticResourceData,
        resourceType,
        resourceData: item,
        params,
      }));
    }
  });

  const countsCardData = [
    {
      msgKey: 'table.header.deployables',
      count: getNumDeployables(item),
    },
    {
      msgKey: 'table.header.deployments',
      count: getNumDeployments(item),
    },
    {
      msgKey: 'table.header.failedDeployments',
      count: getNumFailedDeployments(item),
    },
  ];

  const channelsCardData = [
    {
      name: 'Development',
      counts: {
        pending: {
          total: 3,
        },
        'in progress': {
          total: 2,
        },
        failed: {
          total: 1,
        },
      },
    },
    {
      name: 'QA',
      counts: {
        pending: {
          total: 3,
        },
        'in progress': {
          total: 2,
        },
        failed: {
          total: 1,
        },
      },
    },
    {
      name: 'Dev',
      counts: {
        pending: {
          total: 3,
        },
        'in progress': {
          total: 2,
        },
        failed: {
          total: 1,
        },
      },
    },
  ];

  return (
    <div className="overview-content">
      {!showAppDetails &&
        <React.Fragment>
          <div className="overview-content-bottom overview-content-with-padding">
            <CountsCardModule data={countsCardData} />
          </div>
          <div className="deployment-channels-title">
            {msgs.get('application.deployments.channels', locale)}
            {Array.isArray(channelsCardData) &&
              <span>&nbsp;({channelsCardData.length})</span>
            }
          </div>
          <div className="overview-content-bottom">
            <ChannelsCardModule data={channelsCardData} />
          </div>
        </React.Fragment>
      }
      {showAppDetails &&
        <StructuredListModule
          title={staticResourceData.detailKeys.title}
          headerRows={staticResourceData.detailKeys.headerRows}
          rows={staticResourceData.detailKeys.rows}
          data={item}
        />
      }
      {showAppDetails && modulesRight.length > 0 && (
        <div className="overview-content-right">{modulesRight}</div>
      )}
      {showAppDetails &&
        <div className="overview-content-bottom">{modulesBottom}</div>
      }
    </div>
  );
});

ResourceOverview.contextTypes = {
  locale: PropTypes.string,
};

ResourceOverview.propTypes = {
  item: PropTypes.oneOfType([PropTypes.bool, PropTypes.object]),
  modules: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
  params: PropTypes.object,
  resourceType: PropTypes.object,
  staticResourceData: PropTypes.object,
};

const mapStateToProps = (state, ownProps) => {
  const { resourceType, params } = ownProps;
  const name = decodeURIComponent(params.name);
  const item = getSingleResourceItem(state, {
    storeRoot: resourceType.list,
    resourceType,
    name,
    predicate: resourceItemByName,
    namespace: params.namespace ? decodeURIComponent(params.namespace) : null,
  });
  return { item };
};

export default withRouter(connect(mapStateToProps)(withLocale(ResourceOverview)));
