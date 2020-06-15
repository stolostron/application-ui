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
import R from 'ramda'
import PropTypes from 'prop-types'
import { DropdownV2 } from 'carbon-components-react'
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

  handleSubscriptionChange = e => {
    const channel = e.selectedItem.chn
    this.changeSubscriptionChannels(channel)
  };

  selectChannelByNumber(channelNb) {
    const allChannels = R.pathOr([], ['channelControl', 'allChannels'])(
      this.props
    )

    const changeToChannel =
      allChannels.length >= channelNb ? allChannels[channelNb - 1] : null
    this.changeSubscriptionChannels(changeToChannel)
  }

  handlePageChanged = e => {
    const selectedValue = e.target.value
    this.selectChannelByNumber(selectedValue)
  };

  handlePageClick = e => {
    const allChannels = R.pathOr([], ['channelControl', 'allChannels'])(
      this.props
    )
    const activeChannel = R.pathOr(null, ['channelControl', 'activeChannel'])(
      this.props
    )
    const selectedChannelIndex =
      activeChannel && allChannels ? allChannels.indexOf(activeChannel) + 1 : 1
    switch (e.target.id) {
    case 'p1': {
      //move to the first channel
      this.selectChannelByNumber(1)
      break
    }
    case 'p2': {
      //move one channel down
      if (selectedChannelIndex > 0) {
        this.selectChannelByNumber(selectedChannelIndex - 1)
      }
      break
    }
    case 'p3': {
      //move one channel up
      if (selectedChannelIndex < allChannels.length) {
        this.selectChannelByNumber(selectedChannelIndex + 1)
      }

      break
    }
    case 'p4': {
      //up to the last channel
      this.selectChannelByNumber(allChannels.length)
      break
    }
    default:
      break
    }
  };

  render() {
    const { channelControl = {}, locale } = this.props
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
      const showMainChannel = Object.keys(channelMap).length > 0
      const comboLabel = msgs.get('combo.subscription.choose', locale)

      Object.values(channelMap).forEach(({ chnl, splitChn, subchannels }) => {
        const hasSubchannels = subchannels.length > 0
        let channelLabel = splitChn && splitChn[2] ? splitChn[2] : 'unknown'
        if (channelLabel === '__ALL__') {
          channelLabel = msgs.get('combo.subscription.all')
        }
        displayChannels.push({
          label: channelLabel,
          chn: chnl,
          splitChn,
          hasSubchannels,
          subchannels
        })
      })
      let selectedIdx =
        displayChannels.length === 1
          ? 0
          : displayChannels.findIndex(({ chn }) => chn === activeChannel)
      if (selectedIdx < 0) {
        selectedIdx = displayChannels.findIndex(({ chn }) => !!chn)
      }

      const hasSubchannelsList = displayChannels[selectedIdx].hasSubchannels
      const channelsLength = hasSubchannelsList
        ? displayChannels[selectedIdx].subchannels.length
        : 0

      const selectedChannelIndex = activeChannel
        ? allChannels.indexOf(activeChannel) + 1
        : 1
      const back1 = '<<'
      const back2 = '<'
      const fwd1 = '>'
      const fwd2 = '>>'

      return (
        // show subscription names only when more than one
        <div className="channel-controls-container">
          {showMainChannel && (
            <div className="channels">
              <div className="subscription label">
                {msgs.get('combo.subscription')}
              </div>

              <div className="channelsCombo">
                <DropdownV2
                  items={displayChannels}
                  id="comboChannel"
                  label={comboLabel}
                  ariaLabel={comboLabel}
                  inline={true}
                  onChange={this.handleSubscriptionChange}
                  selectedItem={displayChannels[selectedIdx]}
                />
              </div>
            </div>
          )}
          {hasSubchannelsList && (
            <div className="pagination">
              <div className="resourcePaging label">
                {msgs.get('subscription.page.label')}
              </div>
              <div className="mainPagination">
                <span
                  id="p1"
                  role="button"
                  className="label pageLabel labelLink"
                  onClick={this.handlePageClick}
                  onKeyPress={this.handlePageClick}
                  tabIndex="0"
                >
                  {back1}
                </span>
                <span
                  id="p2"
                  role="button"
                  className="label pageLabel labelLink"
                  onClick={this.handlePageClick}
                  onKeyPress={this.handlePageClick}
                  tabIndex="0"
                >
                  {back2}
                </span>
                <input
                  className="label pageInput"
                  id="valuePage"
                  onChange={this.handlePageChanged}
                  onKeyPress={this.handlePageClick}
                  aria-label="Current page"
                  type="number"
                  min="1"
                  max="{channelsLength}"
                  value={selectedChannelIndex}
                  tabIndex="0"
                />
                <span className="label pageLabel">
                  {msgs.get('subscription.page.nb', [channelsLength])}
                </span>
                <span
                  id="p3"
                  role="button"
                  className="label pageLabel labelLink"
                  onClick={this.handlePageClick}
                  onKeyPress={this.handlePageClick}
                  tabIndex="0"
                >
                  {fwd1}
                </span>
                <span
                  id="p4"
                  role="button"
                  className="label pageLabel labelLink"
                  onClick={this.handlePageClick}
                  onKeyPress={this.handlePageClick}
                  tabIndex="0"
                >
                  {fwd2}
                </span>
              </div>
            </div>
          )}
        </div>
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

  changeSubscriptionChannels(fetchChannel) {
    const { channelControl = {} } = this.props
    const { changeTheChannel } = channelControl

    if (changeTheChannel) {
      this.setState({ fetchChannel })
      changeTheChannel(fetchChannel)
    }
  }
}

export default ChannelControl
