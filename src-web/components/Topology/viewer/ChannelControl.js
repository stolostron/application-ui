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
import { DropdownV2, Tooltip } from 'carbon-components-react'
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
    this.state = {
      currentChannel: {}
    }
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

    // Initialize channel control variables for topology refresh state
    const { activeChannel, allChannels } = this.props.channelControl
    if (allChannels.length > 1) {
      this.fetchInitialData(activeChannel, allChannels)
    }
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.syncHeight)
  }

  // sync scrollbar height with diagram height
  syncHeight() {
    const div = document.getElementById('diagram-viewer-container-container')
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
    // Set the current channel to the selected channel
    this.setState({ currentChannel: e.selectedItem })
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

  getSelectedIndex = (activeChannel, allChannels) => {
    let selectedChannelIndex = 1
    if (
      activeChannel &&
      allChannels &&
      R.contains(activeChannel, allChannels)
    ) {
      selectedChannelIndex = allChannels.indexOf(activeChannel) + 1
    }

    return selectedChannelIndex
  };

  getSubChannels = allChannels => {
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

    return channelMap
  };

  getChannelAllIndex = displayChannels => {
    // find the index for all susbcriptions
    return displayChannels.findIndex(
      ({ chn }) => chn === '__ALL__/__ALL__//__ALL__/__ALL__'
    )
  };

  getDisplayedChannels = (channelMap, activeChannel) => {
    // construct display channels and the selected channel index
    const displayChannels = []

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

    const channelAllIndex = this.getChannelAllIndex(displayChannels)
    displayChannels.push(displayChannels.splice(channelAllIndex, 1)[0])

    let selectedIdx =
      displayChannels.length === 1
        ? 0
        : displayChannels.findIndex(({ chn }) => chn === activeChannel)
    if (selectedIdx < 0) {
      selectedIdx = displayChannels.findIndex(({ chn }) => !!chn)
    }

    return [displayChannels, selectedIdx]
  };

  fetchInitialData = (activeChannel, allChannels) => {
    // Update channel control variables for when refresh state is done
    const { fetchChannel } = this.state
    activeChannel = fetchChannel || activeChannel

    const channelMap = this.getSubChannels(allChannels)

    // determine displayed channels
    const channelsData = this.getDisplayedChannels(channelMap, activeChannel)
    const displayChannels = channelsData[0]
    const selectedIdx = channelsData[1]

    // Set default current channel on page load
    this.setState({
      currentChannel: displayChannels[selectedIdx],
      channelMap: channelMap
    })
  };

  getChannelSubscription = channel => {
    const channelSplit = channel ? channel.split('//') : []

    return channelSplit.length > 0 ? channelSplit[0] : ''
  };

  getSubscriptionCount = (displayChannels, currentChannel) => {
    // count subscription amount and renders corresponding message
    let subscriptionShowInfo
    const channelsLength = displayChannels.length
    const channelAllIndex = this.getChannelAllIndex(displayChannels)
    if (channelsLength !== -1) {
      subscriptionShowInfo =
        currentChannel.chn === '__ALL__/__ALL__//__ALL__/__ALL__'
          ? ''
          : msgs.get('subscription.page.count.nb', [
            channelsLength > 1
              ? channelAllIndex !== -1 ? channelsLength - 1 : channelsLength
              : 1
          ])
    }
    return subscriptionShowInfo
  };

  handlePageClick = e => {
    const allChannels = R.pathOr([], ['channelControl', 'allChannels'])(
      this.props
    )
    const activeChannel = R.pathOr(null, ['channelControl', 'activeChannel'])(
      this.props
    )
    const selectedChannelIndex = this.getSelectedIndex(
      activeChannel,
      allChannels
    )

    switch (e.target.id) {
    case 'p1': {
      //move to the first channel
      if (selectedChannelIndex !== 1) {
        this.selectChannelByNumber(1)
      }
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
      const currentSubscriptionP3 = this.getChannelSubscription(
        allChannels[selectedChannelIndex - 1]
      )
      const nextSubscription = this.getChannelSubscription(
        allChannels[selectedChannelIndex]
      )
      if (
        selectedChannelIndex < allChannels.length &&
          currentSubscriptionP3 === nextSubscription
      ) {
        this.selectChannelByNumber(selectedChannelIndex + 1)
      }

      break
    }
    case 'p4': {
      //up to the last channel
      const currentSubscriptionP4 = this.getChannelSubscription(
        allChannels[selectedChannelIndex - 1]
      )
      const { channelMap } = this.state
      const channelKeys = Object.keys(channelMap)
      let currentChannelMap = {}
      for (let i = 0; i < channelKeys.length; i++) {
        const channelSubscription = this.getChannelSubscription(
          channelKeys[i]
        )
        if (currentSubscriptionP4 === channelSubscription) {
          currentChannelMap = channelMap[channelKeys[i]]
          break
        }
      }
      //this.selectChannelByNumber(allChannels.length)
      if (selectedChannelIndex !== currentChannelMap.subchannels.length) {
        this.changeSubscriptionChannels(
          currentChannelMap.subchannels[
            currentChannelMap.subchannels.length - 1
          ].chnl
        )
      }
      break
    }
    default:
      break
    }
  };

  render() {
    const { channelControl = {}, locale } = this.props
    const { currentChannel } = this.state
    const { allChannels } = channelControl

    if (allChannels) {
      // Initialize channel control variables for topology refresh state
      let showMainChannel = true
      let hasSubchannelsList = false
      let channelsLength = 0
      let selectedChannelIndex = 0
      let displayChannels = []
      let isRefreshing = true

      const comboLabel = msgs.get('combo.subscription.choose', locale)
      const back1 = '<<'
      const back2 = '<'
      const fwd1 = '>'
      const fwd2 = '>>'

      if (allChannels.length > 1) {
        // Update channel control variables for when refresh state is done
        let { activeChannel } = channelControl
        const { fetchChannel } = this.state
        activeChannel = fetchChannel || activeChannel

        const channelMap = this.getSubChannels(allChannels)
        showMainChannel = Object.keys(channelMap).length > 0

        // determine displayed channels
        const channelsData = this.getDisplayedChannels(
          channelMap,
          activeChannel
        )
        displayChannels = channelsData[0]
        const selectedIdx = channelsData[1]

        hasSubchannelsList = displayChannels[selectedIdx].hasSubchannels
        channelsLength = hasSubchannelsList
          ? displayChannels[selectedIdx].subchannels.length
          : 0

        selectedChannelIndex = this.getSelectedIndex(
          activeChannel,
          allChannels
        )

        isRefreshing = false
      }

      return (
        // show subscription names only when more than one
        <div className="channel-controls-container">
          {showMainChannel && (
            <div className="channels">
              <div className="subscription label">
                {msgs.get('combo.subscription')}{' '}
                {this.getSubscriptionCount(displayChannels, currentChannel)}
                <Tooltip triggerText="" iconName="info">
                  <span className="showPagesTooltip">
                    {msgs.get('subscription.page.count.info', locale)}
                  </span>
                </Tooltip>
              </div>

              <div className="channelsCombo">
                <DropdownV2
                  items={displayChannels}
                  id="comboChannel"
                  label={comboLabel}
                  ariaLabel={comboLabel}
                  inline={true}
                  onChange={this.handleSubscriptionChange}
                  selectedItem={currentChannel}
                  disabled={isRefreshing}
                />
              </div>
            </div>
          )}
          {hasSubchannelsList && (
            <div className="pagination">
              <div className="resourcePaging label">
                {msgs.get('subscription.page.label')}
                <div className="show-subscription-pages-icon">
                  <Tooltip triggerText="" iconName="info">
                    <span className="showPagesTooltip">
                      {msgs.get('subscription.page.label.info', locale)}
                    </span>
                  </Tooltip>
                </div>
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
