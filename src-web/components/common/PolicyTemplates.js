/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2017, 2018. All Rights Reserved.
 *
 * Note to U.S. Government Users Restricted Rights:
 * Use, duplication or disclosure restricted by GSA ADP Schedule
 * Contract with IBM Corp.
 *******************************************************************************/
'use strict'

import React from 'react'
import { withRouter } from 'react-router-dom'
import PropTypes from 'prop-types'
import YamlEditor from '../common/YamlEditor'
import {dumpAndParse} from '../../../lib/client/resource-helper'
class PolicyTemplates extends React.Component {

  render() {
    const { resourceData } = this.props
    const {yaml} = dumpAndParse(resourceData)
    return (
      <YamlEditor
        width={'100%'}
        height={'100%'}
        readOnly={true}
        yaml={yaml} />
    )
  }
}

PolicyTemplates.contextTypes = {
  locale: PropTypes.string
}

PolicyTemplates.propTypes = {
  resourceData: PropTypes.object,
}

export default withRouter(PolicyTemplates)
