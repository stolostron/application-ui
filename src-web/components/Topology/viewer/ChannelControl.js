/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2019. All Rights Reserved.
 * Copyright (c) 2020 Red Hat, Inc.
 *
 * Note to U.S. Government Users Restricted Rights:
 * Use, duplication or disclosure restricted by GSA ADP Schedule
 * Contract with IBM Corp.
 *******************************************************************************/
'use strict'

import React from 'react'
import PropTypes from 'prop-types'
import { Scrollbars } from 'react-custom-scrollbars'
import classNames from 'classnames'
import msgs from '../../../../nls/platform.properties'
import _ from 'lodash'

class ChannelControl extends React.Component {
  static propTypes = {
    channelControl: PropTypes.shape({
      allChannels: PropTypes.array,
      activeChannel: PropTypes.string,
      isChangingChannel: PropTypes.bool,
      changeTheChannel: PropTypes.func
    }),
    locale: PropTypes.string
  };

  constructor(props) {
    super(props)
    this.state = {}
  }

  componentDidMount() {
    this.syncHeight = this.syncHeight.bind(this)
    window.addEventListener('resize', this.syncHeight)
    this.syncHeight()

    if (this.scrollIntoViewChn) {
      setTimeout(() => {
        this.scrollIntoViewChn.scrollIntoView(false)
      }, 100)
    }
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.syncHeight)
  }

  // sync scrollbar height with diagram height
  syncHeight() {
    var div = document.getElementById('diagram-viewer-container-container')
    if (div) {
      this.setState({ diagramHeight: div.getBoundingClientRect().height })
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    return (
      !_.isEqual(this.props.channelControl, nextProps.channelControl) ||
      this.state.diagramHeight !== nextState.diagramHeight
    )
  }

  render() {
    const { channelControl = {}, locale } = this.props
    const { diagramHeight = 0 } = this.state
    const { allChannels } = channelControl

    if (allChannels) {
      let { activeChannel } = channelControl
      const { fetchChannel } = this.state
      activeChannel = fetchChannel || activeChannel

      // determine if there are subchannels
      const channelMap = {}
      allChannels.forEach(chnl => {
        const [chn, beg, end] = chnl.split('///')
        const splitChn = /(.*)\/(.*)\/\/(.*)\/(.*)/.exec(chn)
        if (splitChn && splitChn.length === 5) {
          let data = channelMap[chn]
          if (!data) {
            data = channelMap[chn] = { chnl, splitChn, subchannels: [] }
          }
          if (beg && end) {
            data.subchannels.push({ chnl, beg, end })
          }
        }
      })

      // determine displayed channels
      const displayChannels = []
      const showMainChannel = Object.keys(channelMap).length > 2

      Object.values(channelMap).forEach(({ chnl, splitChn, subchannels }) => {
        const hasSubchannels = subchannels.length > 0
        displayChannels.push({
          chn: hasSubchannels ? '' : chnl,
          splitChn,
          hasSubchannels
        })
        subchannels.forEach(({ chnl, beg, end }) => {
          displayChannels.push({
            chn: chnl,
            splitChn,
            beg,
            end,
            isSubchannel: true
          })
        })
      })
      let selectedIdx = displayChannels.findIndex(
        ({ chn }) => chn === activeChannel
      )
      if (selectedIdx < 0) {
        selectedIdx = displayChannels.findIndex(({ chn }) => !!chn)
      }
      return (
        <Scrollbars
          style={{ width: 60, height: diagramHeight }}
          renderView={this.renderView}
          renderThumbVertical={this.renderThumbVertical}
          renderThumbHorizontal={this.renderThumbHorizontal}
          ref={this.setContainerRef}
          className="channel-controls-container"
        >
          <div className="channel-controls-container" ref={this.setControlRef}>
            {displayChannels.map(
              ({ chn, splitChn, hasSubchannels, isSubchannel }, idx) => {
                const [, , , , chnName] = splitChn
                let [, subNamespace, subName, chnNamespace] = splitChn
                if (subName === '__ALL__' && chnName === '__ALL__') {
                  subNamespace = chnNamespace = ''
                  subName = msgs.get(
                    'application.diagram.all.subscriptions',
                    locale
                  )
                }

                if (isSubchannel || showMainChannel) {
                  // show subscription name only when more than one

                  const isSelected = idx === selectedIdx
                  const classes = classNames({
                    'channel-control': true,
                    'channel-control-title': hasSubchannels,
                    'channel-control-subchannel': isSubchannel,
                    selected: isSelected
                  })
                  const handleClick = () => {
                    this.changeTheChannel(chn)
                  }
                  const handleKeyPress = e => {
                    if (e.key === 'Enter') {
                      this.changeTheChannel(chn)
                    }
                  }
                  const tooltip = isSubchannel
                    ? `${idx}`
                    : msgs.get(
                      'application.diagram.channel.tooltip',
                      [
                        `${subNamespace}/${subName}`,
                        `${chnNamespace}/${chnName}`
                      ],
                      locale
                    )

                  const scrollIntoViewChn = ref => {
                    if (ref && isSelected) {
                      this.scrollIntoViewChn = ref
                    }
                  }

                  return (
                    <div
                      className={classes}
                      key={chn ? chn : splitChn.join()}
                      tabIndex="0"
                      role={'button'}
                      aria-label={tooltip}
                      onClick={handleClick}
                      ref={scrollIntoViewChn}
                      onKeyPress={handleKeyPress}
                    >
                      {isSubchannel ? (
                        <React.Fragment>
                          <div className="channel-control-start">{idx}</div>
                        </React.Fragment>
                      ) : (
                        <React.Fragment>
                          <div className="channel-control-subscripion">
                            {subName}
                          </div>
                        </React.Fragment>
                      )}
                    </div>
                  )
                } else {
                  return <div key="noInfo" />
                }
              }
            )}
          </div>
        </Scrollbars>
      )
    }
    return null
  }

  renderView({ style, ...props }) {
    style.marginBottom = -17
    return <div {...props} style={{ ...style }} />
  }

  renderThumbHorizontal() {
    return <div />
  }

  renderThumbVertical({ style, ...props }) {
    const finalStyle = {
      ...style,
      cursor: 'pointer',
      borderRadius: 'inherit',
      backgroundColor: 'rgba(0,0,0,.2)'
    }
    return (
      <div
        className={'channel-controls-scrollbar'}
        style={finalStyle}
        {...props}
      />
    )
  }

  changeTheChannel(fetchChannel) {
    const { channelControl = {} } = this.props
    const { changeTheChannel } = channelControl
    if (changeTheChannel) {
      this.setState({ fetchChannel })
      changeTheChannel(fetchChannel)
    }
  }
}

export default ChannelControl
