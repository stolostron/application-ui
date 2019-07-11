// /*******************************************************************************
//  * Licensed Materials - Property of IBM
//  * (c) Copyright IBM Corporation 2017, 2019. All Rights Reserved.
//  *
//  * Note to U.S. Government Users Restricted Rights:
//  * Use, duplication or disclosure restricted by GSA ADP Schedule
//  * Contract with IBM Corp.
//  *******************************************************************************/

import React from 'react';
import CountsCardModule from '../../CountsCardModule';
import { getNumItems } from '../../../../lib/client/resource-helper';
import { connect } from 'react-redux';
import resources from '../../../../lib/shared/resources';

resources(() => {
    require('./style.scss');
});

const mapStateToProps = (state) => {
    const { HCMApplicationList, HCMChannelList, HCMClusterList, HCMPodList, role } = state;

    return {
        userRole: role.role,
        HCMApplicationList,
        HCMChannelList,
        HCMClusterList,
        HCMPodList,
    };
};

class ApplicationDeploymentHighlightsSummary extends React.Component {
    componentDidMount() { }
    componentWillUnmount() { }

    render() {
        const {
            HCMApplicationList,
            HCMChannelList,
            HCMClusterList,
            HCMPodList,
        } = this.props;

        const countsCardDataSummary = [
            {
                msgKey: 'dashboard.card.deployment.applications',
                count: getNumItems(HCMApplicationList)
            },
            {
                msgKey: 'dashboard.card.deployment.channels',
                count: getNumItems(HCMChannelList)
            },
            {
                msgKey: 'dashboard.card.deployment.placementRules',
                count: 0
            },
            {
                msgKey: 'dashboard.card.deployment.availabilityZones',
                count: 0
            },
            {
                msgKey: 'dashboard.card.deployment.clusters',
                count: getNumItems(HCMClusterList)
            }
        ]
        const countsCardDataStatus = [
            {
                msgKey: 'dashboard.card.deployment.pending',
                count: 1
            },
            {
                msgKey: 'dashboard.card.deployment.inProgress',
                count: 2
            },
            {
                msgKey: 'dashboard.card.deployment.completed',
                count: 3
            }
        ]

        return (
            // <div id="ApplicationDeploymentHighlightsSummary">
            //     <div className="content-container">
            //         <div className="deployment-summary-container">
            //             {msgs.get(
            //                 'description.title.deploymentHighlightsSummary.summary',
            //                 locale,
            //             )}
            //             <div className="deployment-summary-content">

            //             </div>
            //         </div>
            //         <div className="deployment-status-container">
            //             {msgs.get(
            //                 'description.title.deploymentHighlightsSummary.status',
            //                 locale,
            //             )}
            //             <div className="deployment-status-content" />
            //         </div>
            //     </div>
            // </div>
            <React.Fragment>
                <CountsCardModule id="deployment-summary" data={countsCardDataSummary}></CountsCardModule>
                <CountsCardModule id="deployment-status" data={countsCardDataStatus}></CountsCardModule>
            </React.Fragment>
        );
    }
}

export default connect(mapStateToProps)(ApplicationDeploymentHighlightsSummary);