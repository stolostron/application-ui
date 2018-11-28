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
import _ from 'lodash'
import { Modal } from 'carbon-components-react'
import resources from '../../../lib/shared/resources'
import YamlEditor from '../common/YamlEditor'


resources(() => {
  require('../../../scss/modal.scss')
  require('../../../scss/design-view.scss')
})


class DesignView extends React.PureComponent {


  componentDidUpdate(prevProps) {
    // scroll to object
    const {open, selectedDesignNode:node} = this.props
    if (open && !prevProps.open) {
      if (this.editor && node) {
        const line = node.$r||0
        this.editor.renderer.STEPS = 25
        this.editor.setAnimatedScroll(true)
        this.editor.scrollToLine(line, true, true, ()=>{})
        this.editor.selection.moveCursorToPosition({row: line, column: 0})
        this.editor.selection.selectLine()
      }
    }
  }

  handleClose = () => {
    this.props.onClose()
  }

  setEditor = (editor) => this.editor = editor

  render() {
    const { open, selectedDesignNode, yaml } = this.props
    let heading = ''
    if (open) {
      const kind = _.get(selectedDesignNode, 'member.kind.$v', 'Application')
      heading = `${kind}: ${selectedDesignNode.name}`
    }
    return (
      <div className='designView'>
        <Modal
          className='modal'
          open={open}
          modalHeading={heading}
          onRequestClose={this.handleClose}
          role='region'
          aria-label={heading}>
          <div className='yamlEditorContainerContainer'>
            <YamlEditor
              width={'100%'}
              height={'100%'}
              readOnly={true}
              onYamlChange={this.onChange}
              yaml={yaml}
              setEditor={this.setEditor}
            />
          </div>
        </Modal>
      </div>
    )
  }
}

DesignView.propTypes = {
  onClose: PropTypes.func,
  open: PropTypes.bool,
  selectedDesignNode: PropTypes.object,
  yaml:  PropTypes.string,
}

export default DesignView
