/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2017, 2018. All Rights Reserved.
 *
 * Note to U.S. Government Users Restricted Rights:
 * Use, duplication or disclosure restricted by GSA ADP Schedule
 * Contract with IBM Corp.
 *******************************************************************************/
'use strict'
/* eslint-disable react/prop-types, react/jsx-no-bind */


import React from 'react'
import lodash from 'lodash'
import { Modal, Loading, InlineNotification } from 'carbon-components-react'
import resources from '../../../lib/shared/resources'
import { clearRequestStatus, editResource, updateModal } from '../../actions/common'
import { connect } from 'react-redux'
import { REQUEST_STATUS } from '../../actions/index'
import msgs from '../../../nls/platform.properties'
import { dumpAndParse, saveLoad } from '../../../lib/client/design-helper'
import YamlEditor from '../common/YamlEditor'


resources(() => {
  require('../../../scss/modal.scss')
})


class ResourceModal extends React.PureComponent {

  state = {
    reqErrorMsg: []
  }

  constructor(props) {
    super(props)
    this.state = {
      data: dumpAndParse(props.data).yaml,
    }
  }

  handleSubmit = () => {
    this.props.clearRequestStatus()
    this.setState({ reqErrorMsg: [] }, () => {
      const resourceType = this.props.resourceType
      let namespace = this.props.namespace
      let name = this.props.name
      let selfLink = this.props.data.metadata.selfLink
      let resources
      try {
        resources = lodash.compact(saveLoad(this.state.data))
        resources.forEach(resource => {
          if (resource.metadata && resource.metadata.namespace) {
            namespace = resource.metadata.namespace
          }
          if (resource.metadata && resource.metadata.name) {
            name = resource.metadata.name
          }
          if (resource.metadata && resource.metadata.selfLink) {
            selfLink = resource.metadata.selfLink
          }
          this.props.putResource(resourceType, namespace, name, resource, selfLink)
        })
      } catch(e) {
        this.setState(preState => {
          return {reqErrorMsg: [...preState.reqErrorMsg, e.message]}
        })
      }
    })
  }

  handleClose = () => {
    this.setState({reqErrorMsg: []})
    this.props.handleClose()
  }

  escapeEditor = e => {
    e.persist()
    const button = document.querySelector('.bx--btn--secondary')
    e.shiftKey && e.ctrlKey && e.which === 81 && button.focus()
  }

  onChange = value => {
    this.setState({data: value})
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.data && this.props.data !== nextProps.data) {
      // this.setState({data: JSON.stringify(this.props.data, null, 2)})
      this.setState({data: dumpAndParse(this.props.data).yaml})
    }
    if (nextProps.reqStatus && nextProps.reqStatus === REQUEST_STATUS.ERROR) {
      this.setState(preState => {
        return {reqErrorMsg: [...preState.reqErrorMsg, nextProps.reqErrorMsg]}
      })
    }
    if (nextProps.reqCount === 0 && !nextProps.reqErrCount) {
      this.handleClose()
    }
  }

  componentDidMount() {
    this.resourceModal.focus()
  }

  render() {
    const { reqCount, open, label, locale, resourceType } = this.props
    return (
      <div id='resource-modal-container' ref={div => this.resourceModal = div} tabIndex='-1' role='region' onKeyDown={this.escapeEditor} aria-label={msgs.get('a11y.editor.escape', locale)}> {/* eslint-disable-line jsx-a11y/no-noninteractive-element-interactions */}
        {reqCount && reqCount > 0 && <Loading />}
        <Modal
          id={`resource-modal-${resourceType}`}
          className='modal'
          open={open}
          primaryButtonText={msgs.get(label.primaryBtn, locale)}
          secondaryButtonText={msgs.get('modal.button.cancel', locale)}
          modalLabel={msgs.get(label.label, locale)}
          modalHeading={msgs.get(label.heading, locale)}
          onRequestClose={this.handleClose}
          onRequestSubmit={this.handleSubmit}
          role='region'
          aria-label={msgs.get(label.heading, locale)}>
          <div>
            {this.state.reqErrorMsg && this.state.reqErrorMsg.length > 0 &&
              this.state.reqErrorMsg.map((err) => <InlineNotification key={`inline-notification-${err}`} kind='error' title='' subtitle={err} iconDescription={msgs.get('svg.description.error', locale)} />)
            }
            {/*{reqErrorMsg && reqErrorMsg.length > 0 && <InlineNotification key={`inline-notification-${reqErrorMsg}`} kind='error' title='' subtitle={reqErrorMsg} iconDescription={msgs.get('svg.description.error', locale)} />}*/}
            <YamlEditor
              width={'50vw'}
              height={'40vh'}
              readOnly={false}
              onYamlChange={this.onChange}
              yaml={this.state && this.state.data}
            />
          </div>
        </Modal>
      </div>
    )
  }
}

const mapStateToProps = state => {
  return {
    ...state.modal,
  }
}

const mapDispatchToProps = dispatch => {
  return {
    putResource: (resourceType, namespace, name, data, selfLink) => {
      dispatch(editResource(resourceType, namespace, name, data, selfLink))
    },
    handleClose: () => {
      dispatch(clearRequestStatus())
      dispatch(updateModal({open: false, type: 'resource'}))
    },
    clearRequestStatus: () => dispatch(clearRequestStatus())
  }
}


export default connect(mapStateToProps, mapDispatchToProps)(ResourceModal)
