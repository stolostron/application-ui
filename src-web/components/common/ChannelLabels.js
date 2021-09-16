// Copyright (c) 2020 Red Hat, Inc.
// Copyright Contributors to the Open Cluster Management project
'use strict'

import React from 'react'
import PropTypes from 'prop-types'
import {
  Divider,
  Split,
  SplitItem,
  Stack,
  StackItem
} from '@patternfly/react-core'
import { ExternalLinkAltIcon } from '@patternfly/react-icons'
import _ from 'lodash'
import LabelWithPopover from './LabelWithPopover'
import {
  getSearchLink,
  groupByChannelType,
  getChannelLabel,
  CHANNEL_TYPES
} from '../../../lib/client/resource-helper'
import msgs from '../../../nls/platform.properties'
import resources from '../../../lib/shared/resources'

resources(() => {
  require('../../../scss/channel-labels.scss')
})
const ChannelLabels = ({
  channels,
  locale,
  showSubscriptionAttributes = true,
  isArgoApp = false
}) => {
  const channelMap = groupByChannelType(channels || [])
  // Create sorting function for channels
  const channelSort = channels =>
    _.sortBy(channels, ['pathname', 'gitBranch', 'gitPath'])
  return (
    <div className="label-with-popover-container channel-labels">
      {CHANNEL_TYPES.filter(chType => channelMap[chType]).map(chType => {
        const labelContent = getChannelLabel(
          chType,
          channelMap[chType].length,
          locale
        )
        return (
          <LabelWithPopover
            key={`${chType}`}
            labelContent={labelContent}
            labelColor="grey"
            popoverHeader={channelMap[chType].length > 1 && labelContent}
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
                let channelTypeAttributes = []
                if (showSubscriptionAttributes) {
                  if (chType === 'git') {
                    if (isArgoApp) {
                      channelTypeAttributes = ['gitPath', 'targetRevision']
                    } else {
                      channelTypeAttributes = ['gitBranch', 'gitPath']
                    }
                  } else if (chType === 'helmrepo') {
                    if (isArgoApp) {
                      channelTypeAttributes = ['chart', 'targetRevision']
                    } else {
                      channelTypeAttributes = [
                        'package',
                        'packageFilterVersion'
                      ]
                    }
                  } else if (chType === 'objectbucket') {
                    channelTypeAttributes = ['bucketPath']
                  }
                }
                return (
                  <React.Fragment
                    key={`${chType}-${channel.pathname}-${channel.gitBranch}-${
                      channel.gitPath
                    }`}
                  >
                    {index > 0 && (
                      <StackItem>
                        <Divider />
                      </StackItem>
                    )}
                    <StackItem className="channel-entry">
                      <Stack>
                        <StackItem className="channel-entry-link">
                          <a href={link} target="_blank" rel="noreferrer">
                            {pathname}
                            <ExternalLinkAltIcon />
                          </a>
                        </StackItem>
                        {channelTypeAttributes.length > 0 && (
                          <React.Fragment>
                            {channelTypeAttributes.map(attrib => {
                              return (
                                <StackItem
                                  key={attrib}
                                  className="channel-entry-attribute"
                                >
                                  <Split hasGutter>
                                    <SplitItem className="channel-entry-attribute-name">
                                      {msgs.get(`channel.type.label.${attrib}`)}:
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
  isArgoApp: PropTypes.bool,
  locale: PropTypes.string,
  showSubscriptionAttributes: PropTypes.bool
}

export default ChannelLabels
