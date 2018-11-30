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
import PropTypes from 'prop-types'
import msgs from '../../../nls/platform.properties'
import jsYaml from 'js-yaml'
import YamlEditor from '../common/YamlEditor'
import lodash from 'lodash'
import { dumpAndParse } from '../../../lib/client/design-helper'
import { Button, InlineNotification, Loading } from 'carbon-components-react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { Module, ModuleHeader } from 'carbon-addons-cloud-react'
import { editResource } from '../../actions/common'
import {REQUEST_STATUS} from '../../actions'

class PolicyTemplates extends React.Component {

  constructor(props) {
    super(props)
    this.handleEditBtnClick = this.handleEditBtnClick.bind(this)
    this.handleSubmitClick = this.handleSubmitClick.bind(this)
    this.state = {
      readOnly: true,
      yamlParsingError: null,
    }
  }

  componentWillMount() {
    const { resourceData } = this.props
    const { yaml } = dumpAndParse(resourceData)
    if (yaml && !this.state.yaml) {
      this.setState({ yaml })
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.reqStatus && nextProps.reqStatus === REQUEST_STATUS.ERROR && (this.state.reqStatus !== nextProps.reqStatus)) {
      this.setState({
        reqStatus: nextProps.reqStatus,
        reqErrorMsg: nextProps.reqErrorMsg
      })
    }
    if (nextProps.reqStatus && nextProps.reqStatus === REQUEST_STATUS.DONE) {
      this.setState({
        readOnly: true,
        updated: true
      })
    }
  }

  handleEditBtnClick() {
    this.setState(preState => {
      return {readOnly: !preState.readOnly}
    })
  }

  handleSubmitClick() {
    const { editResource, resourceType, resourceData, resourcePath } = this.props
    const { yaml }  = this.state
    let resource
    try {
      resource = jsYaml.safeLoad(yaml)
    } catch (e) {
      this.setState({ yamlParsingError: e })
      return
    }
    if (resourceData.__typename === 'Compliance') {
      const namespace = lodash.get(resourceData, 'metadata.namespace')
      const name = lodash.get(resourceData, 'metadata.name')
      const selfLink = lodash.get(resourceData, 'metadata.selfLink')
      editResource(resourceType, namespace, name, resource, selfLink)
    } else if (resourceData.__typename === 'CompliancePolicyDetail') {
      const namespace = lodash.get(resourceData, 'complianceNamespace')
      const name = lodash.get(resourceData, 'complianceName')
      const selfLink = lodash.get(resourceData, 'complianceSelfLink')
      editResource(resourceType, namespace, name, resource, selfLink, resourcePath)
    }
  }

  handleNotificationClosed = () => this.setState({ yamlParsingError: null })

  handleRequestNotificationClosed = () => this.setState({ reqErrorMsg: null })

  handleEditorChange = (yaml) => this.setState({ yaml })

  render() {
    const { headerKey, editable, reqStatus } = this.props
    return (
      <Module className='structured-list-module'>
        <div>
          <ModuleHeader>{`${msgs.get(headerKey, this.context.locale)}${this.state.updated? ' -  updated' : ''}`}</ModuleHeader>
          {editable &&
          <div className='yaml-editor-button'>
            <Button icon="add--glyph" className={this.state.readOnly && 'read-only-button'} small id={'edit-button'} key='edit-resource' onClick={this.handleEditBtnClick}>
              {msgs.get('table.actions.edit', this.context.locale)}
            </Button>
            <Button icon="add--glyph" small id={'edit-button'} key='submit-resource-change' onClick={this.handleSubmitClick}>
              {msgs.get('modal.button.submit', this.context.locale)}
            </Button>
          </div>
          }
        </div>
        {this.state.yamlParsingError &&
        <InlineNotification
          kind='error'
          title={msgs.get('error.parse', this.context.locale)}
          iconDescription=''
          subtitle={this.state.yamlParsingError.reason}
          onCloseButtonClick={this.handleNotificationClosed}
        />
        }
        {this.state.reqErrorMsg &&
        <InlineNotification
          kind='error'
          title={msgs.get('error.parse', this.context.locale)}
          iconDescription=''
          subtitle={this.state.reqErrorMsg}
          onCloseButtonClick={this.handleRequestNotificationClosed}
        />
        }
        <YamlEditor
          width={'100%'}
          height={'100%'}
          readOnly={this.state.readOnly}
          onYamlChange={this.handleEditorChange}
          yaml={this.state.yaml} />
        {reqStatus === REQUEST_STATUS.IN_PROGRESS && <Loading />}
      </Module>
    )
  }
}

PolicyTemplates.contextTypes = {
  locale: PropTypes.string
}

PolicyTemplates.propTypes = {
  editResource: PropTypes.func,
  editable: PropTypes.bool,
  headerKey: PropTypes.string,
  reqErrorMsg: PropTypes.string,
  reqStatus: PropTypes.string,
  resourceData: PropTypes.object,
  resourcePath: PropTypes.string,
  resourceType: PropTypes.object,
}

const mapStateToProps = (state, ownProps) => {
  const { list: typeListName } = ownProps.resourceType
  return {
    reqStatus: state[typeListName].putStatus,
    reqErrorMsg: state[typeListName].putErrorMsg,
  }
}

const mapDispatchToProps = dispatch => {
  return {
    editResource: (resourceType, namespace, name, data, selfLink, resourcePath) => {
      dispatch(editResource(resourceType, namespace, name, data, selfLink, resourcePath))
    },
  }
}


export default withRouter(connect(mapStateToProps, mapDispatchToProps)(PolicyTemplates))
