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
import SplitPane from 'react-split-pane'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import { fetchResource } from '../../actions/common'
import { getSingleResourceItem, resourceItemByName } from '../../reducers/common'
import { Loading } from 'carbon-components-react'
import resources from '../../../lib/shared/resources'
import TopologyViewer from '../topology/TopologyViewer'
import YamlEditor from '../common/YamlEditor'
import {MCM_DESIGN_SPLITTER_COOKIE} from '../../../lib/shared/constants'
import _ from 'lodash'

resources(() => {
  require('../../../scss/resource-design.scss')
  require('../../../scss/topology-details.scss')
  require('../../../scss/topology-diagram.scss')
})

class ResourceDesign extends React.Component {
    static propTypes = {
      fetchDesign: PropTypes.func,
      links: PropTypes.arrayOf(PropTypes.shape({
        source: PropTypes.any,
        target: PropTypes.any,
        label: PropTypes.string,
        type: PropTypes.string,
      })),
      nodes: PropTypes.arrayOf(PropTypes.shape({
        cluster: PropTypes.string,
        uid: PropTypes.string.isRequired,
        type: PropTypes.string,
        name: PropTypes.string,
      })),
      staticResourceData: PropTypes.object,
      yaml: PropTypes.string,
    }

    constructor (props) {
      super(props)
      this.state = {
        links: [],
        nodes: []
      }
      this.resizePanes = _.debounce((viewerSize)=>{
        const editorSize = this.containerRef.getBoundingClientRect().width - viewerSize
        const fontSize = editorSize<=200 ? 3 : (editorSize<=400 ? 6 : (editorSize<=500 ? 8 : (editorSize<=600? 9 : 12)))
        this.viewer.resize()
        this.editor.setFontSize(fontSize)
        this.editor.resize()
      }, 150)
      this.setContainerRef = elem => {
        this.containerRef = elem
      }
    }

    componentWillMount() {
      this.props.fetchDesign()
    }

    componentWillReceiveProps(nextProps) {
      const links = _.cloneDeep(nextProps.links||[])
      const nodes = _.cloneDeep(nextProps.nodes||[])
      const yaml = nextProps.yaml || ''
      this.setState({ links, nodes, yaml })
    }

    shouldComponentUpdate(nextProps, nextState){
      return !_.isEqual(this.state.nodes.map(n => n.uid), nextState.nodes.map(n => n.uid)) ||
         !_.isEqual(this.state.links.map(n => n.uid), nextState.links.map(n => n.uid)) ||
         this.props.yaml !== nextProps.yaml}

    handleEditorChange = (yaml) => this.setState({ yaml })
    handleSplitterDefault = () => {
      const cookie = localStorage.getItem(`${MCM_DESIGN_SPLITTER_COOKIE}`)
      let size = 1000
      if (cookie) {
        size = parseInt(cookie)
      } else {
        const page = document.getElementById('page')
        if (page) {
          size = page.getBoundingClientRect().width/2
        }
      }
      this.resizePanes(size)
      return size
    }
    handleSplitterChange = (size) => {
      localStorage.setItem(`${MCM_DESIGN_SPLITTER_COOKIE}`, size)
      this.resizePanes(size)
    }
    setEditor = (editor) => this.editor = editor
    getEditor = () => this.editor
    setViewer = (viewer) => this.viewer = viewer
    getViewer = () => this.viewer

    render() {
      if (!this.props.nodes)
        return <Loading withOverlay={false} className='content-spinner' />

      const { staticResourceData} = this.props
      const { links, nodes, yaml } = this.state
      return (
        <div className="resourceDesignContainer"  ref={this.setContainerRef} >
          <SplitPane
            split='vertical'
            minSize={50}
            defaultSize={this.handleSplitterDefault()}
            onChange={this.handleSplitterChange}>
            <div className="topologyDiagramContainer">
              <TopologyViewer
                id={'application'}
                nodes={nodes}
                links={links}
                context={this.context}
                getEditor={this.getEditor}
                setViewer={this.setViewer}
                staticResourceData={staticResourceData}
              />
            </div>
            <YamlEditor
              width={'100%'}
              height={'100%'}
              readOnly={true}
              getViewer={this.getViewer}
              setEditor={this.setEditor}
              onYamlChange={this.handleEditorChange}
              yaml={yaml} />
          </SplitPane>
        </div>
      )
    }

}

const mapStateToProps = (state, ownProps) => {
  const { resourceType, staticResourceData, params } = ownProps
  const name = decodeURIComponent(params.name)
  const item = getSingleResourceItem(state, { storeRoot: resourceType.list, resourceType, name, predicate: resourceItemByName,
    namespace: params.namespace ? decodeURIComponent(params.namespace) : null })
  const {links, nodes, yaml} = staticResourceData.topologyTransform(item)
  return {
    links,
    nodes,
    yaml
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  const { resourceType, params: {name, namespace} } = ownProps
  return {
    fetchDesign: () => dispatch(fetchResource(resourceType, namespace, name))
  }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(ResourceDesign))
