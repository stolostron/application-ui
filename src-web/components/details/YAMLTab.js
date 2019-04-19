/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2019. All Rights Reserved.
 *
 * Note to U.S. Government Users Restricted Rights:
 * Use, duplication or disclosure restricted by GSA ADP Schedule
 * Contract with IBM Corp.
 *******************************************************************************/
'use strict'

import React from 'react'
import PropTypes from 'prop-types'
import _ from 'lodash'
import YamlEditor from '../common/YamlEditor'
import { toString } from '../../../lib/client/design-helper'
import { Loading, Notification } from 'carbon-components-react'

class YAMLTab extends React.Component {

  static propTypes = {
    resourceJson: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
    resourceLoading: PropTypes.bool
  }

  constructor(props) {
    super(props)
    this.state = {
      readOnly: true,
      // yamlParsingError: null,
    }
  }

  render() {
    const { resourceJson, resourceLoading } = this.props

    if (resourceLoading)
      return <Loading className='content-spinner' />

    if (resourceJson && _.get(resourceJson, '[0].message'))
      return <Notification kind='error' title='' subtitle={resourceJson[0].message} />

    if (resourceJson && resourceJson) {
      return (
        <div className='details-yaml'>
          <YamlEditor
            width='100%'
            height='500px'
            readOnly={this.state.readOnly}
            onYamlChange={this.handleEditorChange}
            yaml={toString({raw: resourceJson})} />
        </div>
      )
    }

    return null
  }
}

YAMLTab.contextTypes = {
  locale: PropTypes.string
}

export default YAMLTab
