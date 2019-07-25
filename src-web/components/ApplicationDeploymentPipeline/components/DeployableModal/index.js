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
// import { createApplicationRows } from './utils'
import { Modal } from 'carbon-components-react'
import config from '../../../../../lib/shared/config'
import { RESOURCE_TYPES } from '../../../../../lib/shared/constants'

resources(() => {
  require('./style.scss')
})

const DeployableModalContents = ({}) => {
  return <div className="channelGridContainer">{'hi'}</div>
}

const DeployableModal = withLocale(({ displayModal, closeModal, locale }) => {
  return (
    <div id="DeployableModal">
      <Modal
        className="modalAddRepo"
        onRequestClose={() => closeModal()}
        open={displayModal}
        modalHeading={msgs.get('description.title.deployables', locale)}
        primaryButtonText={msgs.get('description.title.deployables', locale)}
        secondaryButtonText={msgs.get('description.title.deployables', locale)}
        modalLabel=""
      >
        <DeployableModalContents />
      </Modal>
    </div>
  )
})

export default withLocale(DeployableModal)
