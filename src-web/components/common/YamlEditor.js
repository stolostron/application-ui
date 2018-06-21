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

const AceEditor = (props) => {
  if (typeof window !== 'undefined') {
    const Ace = require('react-ace').default
    require('brace/mode/yaml')
    require('brace/theme/monokai')
    return <Ace {...props} />
  }
  return null
}


class IsomorphicEditor extends React.Component {
  constructor(props) {
    super(props)
    this.mounted = false
  }

  componentDidMount() {
    this.mounted = true
  }
  render = () => (this.mounted && <AceEditor {...this.props} />)
}

const YamlEditor = ({ onYamlChange, yaml }) =>
  <div>
    <IsomorphicEditor
      theme='monokai'
      mode={'yaml'}
      width='49.5vw'
      height='40vh'
      onChange={onYamlChange}
      fontSize={12}
      showPrintMargin={false}
      showGutter={true}
      highlightActiveLine={true}
      value={yaml}
      setOptions={{
        showLineNumbers: true,
        tabSize: 2,
      }}
      editorProps={{
        $blockScrolling: Infinity
      }}
    />
  </div>

YamlEditor.propTypes = {
  onYamlChange: PropTypes.func,
  yaml: PropTypes.string,
}

export default YamlEditor
