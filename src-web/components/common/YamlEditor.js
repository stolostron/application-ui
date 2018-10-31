/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2018. All Rights Reserved.
 *
 * Note to U.S. Government Users Restricted Rights:
 * Use, duplication or disclosure restricted by GSA ADP Schedule
 * Contract with IBM Corp.
 *******************************************************************************/
'use strict'

import React from 'react'
import PropTypes from 'prop-types'
import AceEditor from 'react-ace'

import 'brace/mode/yaml'
import 'brace/theme/monokai'

class IsomorphicEditor extends React.Component {

  static propTypes = {
    setEditor: PropTypes.func,
  }

  constructor(props) {
    super(props)
    this.setEditorRef = elem => {
      if (elem && props.setEditor) {
        props.setEditor(elem.editor)
      }
    }
  }

  render = () => <AceEditor {...this.props} ref={this.setEditorRef} />
}

const YamlEditor = ({ onYamlChange, setEditor, yaml, width='49.5vw', height='40vh', readOnly=false }) => (
  <div className="yamlEditorContainer">
    <IsomorphicEditor
      theme='monokai'
      mode={'yaml'}
      width={width}
      height={height}
      onChange={onYamlChange}
      fontSize={12}
      showPrintMargin={false}
      showGutter={true}
      highlightActiveLine={true}
      value={yaml}
      setOptions={{
        readOnly,
        showLineNumbers: true,
        tabSize: 2,
      }}
      editorProps={{
        $blockScrolling: Infinity
      }}
      setEditor={setEditor}
    />
  </div>)

YamlEditor.propTypes = {
  height: PropTypes.string,
  onYamlChange: PropTypes.func,
  readOnly: PropTypes.bool,
  setEditor: PropTypes.func,
  width: PropTypes.string,
  yaml: PropTypes.string,
}

export default YamlEditor
