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
import resources from '../../../lib/shared/resources';
import { Icon } from 'carbon-components-react';

resources(() => {
  require('./style.scss')
})

const ApplicationDeployableSubscription = withLocale(({ subscription, locale }) => {
  return (
    <div id="ApplicationDeployableSubscription">
      <div className="deployable-subscription-header">
        {msgs.get('description.title.deployableSubscription', locale)}
      </div>

      <div className="deployable-subscription-container">
        <div className="deployable-subscription-edit-container">
          <p className="yamlEditIconTitle">YAML</p>
          <Icon
            name="icon--edit"
            fill="#6089bf"
            description=""
            className="yamlEditIcon"
          />
        </div>
        <div className="deployable-subscription-tile-container">
          <div className="subscription-name">
            <p className="tile-title">{msgs.get('description.title.deployableSubscription.subscriptionName')}</p>
            <span className="tile-content">{subscription.name ? subscription.name : "--"}</span>
          </div>
          <div className="landing-channel">
            <p className="tile-title">{msgs.get('description.title.deployableSubscription.landingChannel')}</p>
            <span className="tile-content">{subscription.channel ? subscription.channel : "--"}</span>
          </div>
          <div className="certificates">
            <p className="tile-title">{msgs.get('description.title.deployableSubscription.certificates')}</p>
            <span className="tile-content">
              {subscription.certificates ? subscription.certificates + " (" : "--"}
              <a href="#">{subscription.certificates ? msgs.get('routes.viewDetails') : ""}</a>
              {subscription.certificates ? ")" : ""}
            </span>
          </div>
          <div className="annotations">
            <p className="tile-title">{msgs.get('description.title.deployableSubscription.annotations')}</p>
            <span className="tile-content">{subscription.annotations ? subscription.annotations : "--"}</span>
          </div>
          <div className="placement-rules">
            <p className="tile-title">{msgs.get('description.title.deployableSubscription.placementRules')}</p>
            <span className="tile-content">{subscription.rules ? subscription.rules : "--"}</span>
          </div>
          <div className="version">
            <p className="tile-title">{msgs.get('description.title.deployableSubscription.version')}</p>
            <span className="tile-content">{subscription.version ? subscription.version : "--"}</span>
          </div>
          <div className="labels">
            <p className="tile-title">{msgs.get('description.title.deployableSubscription.labels')}</p>
            <div className="tile-content">
              {subscription.labels ? subscription.labels.map(item => (
                <div className="label-item" key={item[0]}>{item[0]}={item[1]}</div>
              ))
                : "--"}
            </div>
          </div>
          <div className="rolling-updates">
            <p className="tile-title">{msgs.get('description.title.deployableSubscription.rollingUpdates')}</p>
            <span className="tile-content">{subscription.updates ? subscription.updates : "--"}</span>
          </div>
        </div>
      </div>
    </div>
  )
})

export default withLocale(ApplicationDeployableSubscription)
