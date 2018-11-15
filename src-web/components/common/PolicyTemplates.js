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
import {dumpAndParse} from '../../../lib/client/design-helper'
import msgs from '../../../nls/platform.properties'
import { Module, ModuleHeader } from 'carbon-addons-cloud-react'

class PolicyTemplates extends React.Component {

  constructor(props) {
    super(props)
    this.handleBtnClick = this.handleBtnClick.bind(this)
    this.state = {
      readOnly: true
    }
  }

  componentWillMount() {
    const { resourceData } = this.props
    const { yaml } = dumpAndParse(resourceData)
    if (yaml && !this.state.yaml) {
      this.setState({ yaml })
    }
  }

  handleBtnClick(){
    this.setState(preState => {
      return {readOnly: !preState.readOnly}
    })
  }

  handleEditorChange = (yaml) => this.setState({ yaml })

  render() {
    const { headerKey } = this.props
    return (
      <Module className='structured-list-module'>
        <ModuleHeader>{msgs.get(headerKey, this.context.locale)}</ModuleHeader>
        <YamlEditor
          width={'100%'}
          height={'100%'}
          readOnly={this.state.readOnly}
          onYamlChange={this.handleEditorChange}
          yaml={this.state.yaml} />
      </Module>
    )
  }
}

PolicyTemplates.contextTypes = {
  locale: PropTypes.string
}

PolicyTemplates.propTypes = {
  headerKey: PropTypes.string,
  resourceData: PropTypes.object,
}

export default withRouter(PolicyTemplates)
