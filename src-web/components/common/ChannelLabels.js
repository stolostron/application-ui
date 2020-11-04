// Copyright (c) 2020 Red Hat, Inc.
'use strict'

import React from 'react'
import { Icon } from 'carbon-components-react'
import PropTypes from 'prop-types'
import {
  Divider,
  Split,
  SplitItem,
  Stack,
  StackItem
} from '@patternfly/react-core'
import R from 'ramda'
import LabelWithPopover from './LabelWithPopover'
import { getSearchLink } from '../../../lib/client/resource-helper'
import msgs from '../../../nls/platform.properties'
import resources from '../../../lib/shared/resources'

resources(() => {
  require('../../../scss/channel-labels.scss')
})
const ChannelLabels = ({
  channels,
  locale,
  showSubscriptionAttributes = true
}) => {
  const groupByChannelType = R.groupBy(ch => {
    const channelType = (ch.type && ch.type.toLowerCase()) || ''
    return channelType === 'github' ? 'git' : channelType
  })
  const channelMap = groupByChannelType(channels || [])
  // Create sorting function for channels
  const channelSort = R.sortWith([
    R.ascend(R.prop('pathname')),
    R.ascend(R.prop('gitBranch')),
    R.ascend(R.prop('gitPath'))
  ])
  return (
    <div className="label-with-popover-container channel-labels">
      {['git', 'helmrepo', 'namespace', 'objectbucket']
        .filter(chType => channelMap[chType])
        .map(chType => {
          return (
            <LabelWithPopover
              key={`${chType}`}
              labelContent={
                <Split hasGutter className="channel-label">
                  <SplitItem>
                    {msgs.get(`channel.type.${chType}`, locale)}
                    {channelMap[chType].length > 1 &&
                      ` (${channelMap[chType].length})`}
                  </SplitItem>
                  <SplitItem>
                    <Icon className="channel-entry-icon" name="icon--launch" />
                  </SplitItem>
                </Split>
              }
            >
              <Stack className="channel-labels channel-labels-popover-content">
                {channelSort(channelMap[chType]).map((channel, index) => {
                  const pathname = channel.pathname
                  const link =
                    chType === 'namespace'
                      ? getSearchLink({
                        properties: {
                          namespace: pathname,
                          kind: 'deployable',
                          apigroup: 'apps.open-cluster-management.io'
                        }
                      })
                      : pathname
                  return (
                    <React.Fragment
                      key={`${chType}-${channel.pathname}-${
                        channel.gitBranch
                      }-${channel.gitPath}`}
                    >
                      {index > 0 && (
                        <StackItem>
                          <Divider />
                        </StackItem>
                      )}
                      <StackItem className="channel-entry">
                        <Stack hasGutter>
                          <StackItem className="channel-entry-link">
                            <a href={link} target="_blank" rel="noreferrer">
                              <Split hasGutter>
                                <SplitItem>
                                  <Icon
                                    className="channel-entry-icon"
                                    name="icon--launch"
                                  />
                                </SplitItem>
                                <SplitItem>{pathname}</SplitItem>
                              </Split>
                            </a>
                          </StackItem>
                          {showSubscriptionAttributes &&
                            chType === 'git' && (
                              <React.Fragment>
                                {['gitBranch', 'gitPath'].map(attrib => {
                                  return (
                                    <StackItem
                                      key={attrib}
                                      className="channel-entry-attribute"
                                    >
                                      <Split hasGutter>
                                        <SplitItem className="channel-entry-attribute-name">
                                          {msgs.get(
                                            `channel.type.label.${attrib}`
                                          )}
                                        </SplitItem>
                                        <SplitItem>
                                          {channel[attrib]
                                            ? channel[attrib]
                                            : msgs.get(
                                              'channel.type.label.noData',
                                              locale
                                            )}
                                        </SplitItem>
                                      </Split>
                                    </StackItem>
                                  )
                                })}
                              </React.Fragment>
                          )}
                        </Stack>
                      </StackItem>
                    </React.Fragment>
                  )
                })}
              </Stack>
            </LabelWithPopover>
          )
        })}
    </div>
  )
}

ChannelLabels.propTypes = {
  channels: PropTypes.arrayOf(PropTypes.object),
  locale: PropTypes.string,
  showSubscriptionAttributes: PropTypes.bool
}

export default ChannelLabels
