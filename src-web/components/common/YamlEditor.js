/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2018, 2019. All Rights Reserved.
 * Copyright (c) 2020 Red Hat, Inc.
 *
 * US Government Users Restricted Rights - Use, duplication or disclosure
 * restricted by GSA ADP Schedule Contract with IBM Corp.
 *******************************************************************************/
'use strict'

import React from 'react'
import PropTypes from 'prop-types'
import AceEditor from 'react-ace'
import { parse } from '../../../lib/client/design-helper'

import 'brace/mode/yaml'
import 'brace/theme/monokai'
import 'brace/theme/vibrant_ink'

class IsomorphicEditor extends React.Component {
  static propTypes = {
    handleParsingError: PropTypes.func,
    setEditor: PropTypes.func,
    validator: PropTypes.func
  };

  constructor(props) {
    super(props)
    const { setEditor, handleParsingError, validator } = props
    this.setEditorRef = elem => {
      if (elem) {
        if (setEditor) {
          setEditor(elem.editor)
        }
        if (handleParsingError) {
          elem.editor.on('input', () => {
            const yaml = elem.editor.getValue()
            const { exceptions } =
              yaml.length > 0
                ? parse(yaml, validator, this.context.locale)
                : { exceptions: [] }
            elem.editor.session.setAnnotations(exceptions)
            let reason = exceptions
              .map(({ text }) => {
                return text
              })
              .join('; ')
            if (reason.length > 200) {
              reason = reason.substr(0, 200) + '...'
            }
            handleParsingError(exceptions.length > 0 ? { reason } : null)
          })
        }
      }
    }
  }

  render = () => <AceEditor {...this.props} ref={this.setEditorRef} />;
}

const YamlEditor = ({
  onYamlChange,
  setEditor,
  validator,
  handleParsingError,
  yaml,
  theme = 'monokai',
  width = '100%',
  height = '40vh',
  readOnly = false,
  wrapEnabled = false
}) => (
  <div className="yamlEditorContainer">
    <IsomorphicEditor
      theme={theme}
      mode={'yaml'}
      width={width}
      height={height}
      wrapEnabled={wrapEnabled}
      onChange={onYamlChange}
      fontSize={12}
      showPrintMargin={false}
      showGutter={true}
      highlightActiveLine={true}
      value={yaml}
      validator={validator}
      handleParsingError={handleParsingError}
      setOptions={{
        readOnly,
        showLineNumbers: true,
        newLineMode: 'unix',
        tabSize: 2
      }}
      editorProps={{
        $blockScrolling: Infinity
      }}
      setEditor={setEditor}
    />
  </div>
)

YamlEditor.propTypes = {
  handleParsingError: PropTypes.func,
  height: PropTypes.string,
  onYamlChange: PropTypes.func,
  readOnly: PropTypes.bool,
  setEditor: PropTypes.func,
  theme: PropTypes.string,
  validator: PropTypes.func,
  width: PropTypes.string,
  wrapEnabled: PropTypes.bool,
  yaml: PropTypes.string
}

export default YamlEditor
