/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2017, 2019. All Rights Reserved.
 *
 * Note to U.S. Government Users Restricted Rights:
 * Use, duplication or disclosure restricted by GSA ADP Schedule
 * Contract with IBM Corp.
 *******************************************************************************/

import React from 'react'
import msgs from '../../../../../nls/platform.properties'
import { withLocale } from '../../../../providers/LocaleProvider'
import resources from '../../../../../lib/shared/resources'
import { Modal } from 'carbon-components-react'

resources(() => {
  require('./style.scss')
})

const DeployableModalContents = () => {
  return (
    <div className="channelGridContainer">{'TODO insert Information Here'}</div>
  )
}

const DeployableModal = withLocale(
  ({ displayModal, closeModal, header, label, locale }) => {
    return (
      <div id="DeployableModal">
        <Modal
          className="modalAddRepo"
          onRequestClose={() => closeModal()}
          open={displayModal}
          modalHeading={header}
          modalLabel={label}
          primaryButtonText={'TODO button'}
          secondaryButtonText={msgs.get('actions.close', locale)}
        >
          <DeployableModalContents />
        </Modal>
      </div>
    )
  }
)

export default withLocale(DeployableModal)
