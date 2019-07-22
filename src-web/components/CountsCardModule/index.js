/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2019. All Rights Reserved.
 *
 * Note to U.S. Government Users Restricted Rights:
 * Use, duplication or disclosure restricted by GSA ADP Schedule
 * Contract with IBM Corp.
 *******************************************************************************/

import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import resources from '../../../lib/shared/resources';
import msgs from '../../../nls/platform.properties';

resources(() => {
  require('./style.scss');
});

export default class CountsCardModule extends React.Component {
  getModuleData = () => {
    const { locale } = this.context
    const { data } = this.props
    const countCardItems = []
    data.map(({ msgKey, count }, idx) => {
      countCardItems.push({
        count,
        type: msgs.get(msgKey, locale),
      });
    });
    return {
      countCardItems,
    };
  };

  render() {
    const { locale } = this.context
    const { title } = this.props
    const moduleData = this.getModuleData()
    const moduleStyle = {}
    if (this.props.height && this.props.height > 0) {
      moduleStyle.height = this.props.height;
    }
    return (
      <div id="CountsCardModule" style={moduleStyle}>
        <div className="card-container">
          {title &&
            <span className="card-container-title">{msgs.get(title, locale)}</span>
          }

          <div className="card-container-content">
            <CountCards moduleData={moduleData} locale={locale} />
          </div>
        </div>
      </div>
    );
  }
}

const CountCards = ({ moduleData: { countCardItems }, locale }) => {
  return (
    <React.Fragment>
      {countCardItems.map(({ count, type }, idx) => {
        const onClick = () => {};
        const onKeyPress = (e) => {
          if (e.key === 'Enter') {
            onClick();
          }
        };
        const cardClasses = classNames({
          'card-count-type': true,
          // hasBorder: idx === 0,
        })
        const countClasses = classNames({
          'card-count': true,
          // 'alert': count>0,
        });
        return (
          <div
            key={type}
            className={cardClasses}
            role="button"
            tabIndex="0"
            onClick={onClick}
            onKeyPress={onKeyPress}
          >
            <div className={countClasses}>{count}</div>
            <div className="card-type">
              <div>{type}</div>
            </div>
          </div>
        );
      })}
    </React.Fragment>
  );
};

CountCards.propTypes = {
  locale: PropTypes.string,
  moduleData: PropTypes.object,
};

CountsCardModule.propTypes = {};
