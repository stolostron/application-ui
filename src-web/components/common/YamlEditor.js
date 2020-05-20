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
import MonacoEditor from 'react-monaco-editor'
import {
  global_BackgroundColor_100 as lineNumberActiveForeground,
  global_BackgroundColor_300 as lineNumberForeground,
  global_BackgroundColor_dark_100 as editorBackground,
} from '@patternfly/react-tokens'

//import 'monaco-editor/esm/vs/editor/editor.all.js'
import 'monaco-editor/esm/vs/editor/standalone/browser/quickOpen/quickCommand.js'
import 'monaco-editor/esm/vs/basic-languages/yaml/yaml.contribution.js'
import { parse } from '../../../lib/client/design-helper'
import config from '../../../lib/shared/config'

if (window.monaco) {
  window.monaco.editor.defineTheme('console', {
    base: 'vs-dark',
    inherit: true,
    rules: [
    // avoid pf tokens for `rules` since tokens are opaque strings that might not be hex values
      { token: 'number', foreground: 'ace12e' },
      { token: 'type', foreground: '73bcf7' },
      { token: 'string', foreground: 'f0ab00' },
      { token: 'keyword', foreground: 'cbc0ff' },
    ],
    colors: {
      'editor.background': editorBackground.value,
      'editorGutter.background': '#292e34', // no pf token defined
      'editorLineNumber.activeForeground': lineNumberActiveForeground.value,
      'editorLineNumber.foreground': lineNumberForeground.value,
    },
  })
}

window.MonacoEnvironment = {
  getWorkerUrl: function () {
    return `${config.contextPath}/editor.worker.js`
  }
}

class IsomorphicEditor extends React.Component {

  static propTypes = {
    handleParsingError: PropTypes.func,
    setEditor: PropTypes.func,
    validator: PropTypes.func,
  }

  constructor(props) {
    super(props)
    this.handleEscKeyPress = this.handleEscKeyPress.bind(this)
  }

  handleEscKeyPress(event) {
    if(event.key === 'Escape' && event.target.className === 'ace_text-input') {
      event.target.blur()
    }
  }

  componentDidMount() {
    window.addEventListener('keydown',this.handleEscKeyPress)
  }

  componentWillUnmount() {
    window.removeEventListener('keydown', this.handleEscKeyPress)
  }

  editorWillMount() {
    // Monaco uses <span> to measure character sizes
    // therefore make sure <span> has the right font
    let stylesheet = document.querySelector('link[href*=main]')
    if (stylesheet) {
      stylesheet = stylesheet.sheet
      stylesheet.insertRule('span { font-family: monospace }', stylesheet.cssRules.length)
    }
  }

  editorDidMount(editor, monaco) {
    const { setEditor, handleParsingError, validator } = this.props
    editor.layout()
    editor.focus()
    editor.monaco = monaco
    editor.decorations = []
    if (setEditor) {
      setEditor(editor)
    }
    this.editor = editor

    // remove the rule setting <span> font
    let stylesheet = document.querySelector('link[href*=main]')
    if (stylesheet) {
      stylesheet = stylesheet.sheet
      stylesheet.deleteRule(stylesheet.cssRules.length-1)
    }

    monaco.editor.setModelLanguage(editor.getModel(), 'yaml')

    // syntax errors
    if (handleParsingError) {
      editor.getModel().onDidChangeContent(() => {
        const yaml = editor.getValue()
        const { exceptions } =
          yaml.length > 0
            ? parse(yaml, validator, this.context.locale)
            : { exceptions: [] }
        const decorationList = []
        exceptions.forEach(({row, text})=>{
          decorationList.push({
            range: new monaco.Range(row+1, 0, row+1, 132),
            options: {
              isWholeLine: true,
              glyphMarginClassName: 'errorDecoration',
              glyphMarginHoverMessage: {value: text},
              minimap: {color: 'red' , position:1}
            }
          })
        })
        exceptions.forEach(({row, column})=>{
          decorationList.push({
            range: new monaco.Range(row+1, column-6, row+1, column+6),
            options: {
              className: 'squiggly-error',
            }
          })
        })
        editor.decorations = editor.deltaDecorations(editor.decorations, decorationList)
        let reason = exceptions
          .map(({ text }) => {
            return text
          })
          .join('; ')
        if (reason.length > 200) {
          reason = `${reason.substr(0, 200)}...`
        }
        handleParsingError(exceptions.length > 0 ? { reason } : null)
      })
    }

  }

  render = () => <MonacoEditor
    {...this.props}
    editorDidMount={this.editorDidMount.bind(this)}
    editorWillMount={this.editorWillMount.bind(this)}
  />
}

const YamlEditor = ({ onYamlChange, setEditor, yaml,
  validator, handleParsingError,  width='49.5vw', height='40vh', readOnly=false }) => (
    <div className="yamlEditorContainer">
      <IsomorphicEditor
        key={!yaml ? 'loading' : 'loaded'}
        theme="console"
        language="yaml"
        width={width}
        height={height}
        onChange={onYamlChange}
        fontSize={12}
        value={yaml}
        validator={validator}
        handleParsingError={handleParsingError}
        options={{
          readOnly,
          wordWrapMinified: false,
          scrollBeyondLastLine: false,
          smoothScrolling: true,
          glyphMargin: true,
          tabSize: 2,
          scrollbar: {
            verticalScrollbarSize: 17,
            horizontalScrollbarSize: 17,
          }
        }}
        setEditor={setEditor}
    />
    </div>)

YamlEditor.propTypes = {
  handleParsingError: PropTypes.func,
  height: PropTypes.string,
  onYamlChange: PropTypes.func,
  readOnly: PropTypes.bool,
  setEditor: PropTypes.func,
  validator: PropTypes.func,
  width: PropTypes.string,
  yaml: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
}

export default YamlEditor
