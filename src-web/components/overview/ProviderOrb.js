/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2018. All Rights Reserved.
 *
 * Note to U.S. Government Users Restricted Rights:
 * Use, duplication or disclosure restricted by GSA ADP Schedule
 * Contract with IBM Corp.
 *******************************************************************************/

import React from 'react'
import PropTypes from 'prop-types'
import msgs from '../../../nls/platform.properties'
import aws from '../../../graphics/providers/aws.png'
import azure from '../../../graphics/providers/azure.png'
import google from '../../../graphics/providers/google.png'
import ibm from '../../../graphics/providers/ibm.png'
import pc from '../../../graphics/providers/private.png'

const providerData = {
  aws: {image: aws},
  azure: {image: azure},
  google: {image: google},
  ibm: {image: ibm},
  pc: {image: pc, label: 'Private Cloud'},
}

export class ProviderOrb extends React.PureComponent {
  render() {
    const { locale } = this.context
    const { provider: {name, clusters} } = this.props
    const { image, label=name } = providerData[name.toLowerCase()]
    return (
      <div className='provider-orb'>
        <div className={'provider-image'}>
          <svg viewBox={`${image.viewBox}`}>
            <use xlinkHref={`#${image.id}`} />
          </svg>
        </div>
        <div className={'provider-name'}>{label}</div>
        <div className={'provider-cluster'}>{msgs.get('overview.cluster.count', [clusters.length], locale)}</div>
      </div>
    )
  }
}


ProviderOrb.propTypes = {
  provider: PropTypes.object,
}
