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
import { getSearchLink } from './ResourceOverview/utils'
import msgs from '../../../nls/platform.properties'
import resources from '../../../lib/shared/resources'

resources(() => {
  require('../../../scss/channel-labels.scss')
})
const ChannelLabels = ({ channels, locale }) => {
  const groupByChannelType = R.groupBy(ch => {
    const channelType = (ch.type && ch.type.toLowerCase()) || ''
    return channelType === 'github' ? 'git' : channelType
  })
  const channelMap = groupByChannelType(channels || [])

  return (
    <div className="label-with-popover-container channel-labels">
      {['git', 'helmrepo', 'namespace', 'objectbucket']
        .filter(chType => channelMap[chType])
        .map(chType => {
          return (
            <LabelWithPopover
              key={`${chType}`}
              labelContent={
                <Split hasGutter className="channel-type-label">
                  <SplitItem>
                    {msgs.get(`channel.type.${chType}`, locale)}
                  </SplitItem>
                  <SplitItem>
                    <Icon className="channel-type-icon" name="icon--launch" />
                  </SplitItem>
                </Split>
              }
            >
              <Stack className="channel-labels">
                {channelMap[chType].map((channel, index) => {
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
                    <React.Fragment key={chType}>
                      {index > 0 && (
                        <StackItem>
                          <Divider />
                        </StackItem>
                      )}
                      <StackItem>
                        <a
                          href={link}
                          target="_blank"
                          className="channel-type-link"
                        >
                          <Split hasGutter>
                            <SplitItem>
                              <Icon
                                className="channel-type-icon"
                                name="icon--launch"
                              />
                            </SplitItem>
                            <SplitItem>{pathname}</SplitItem>
                          </Split>
                        </a>
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
  locale: PropTypes.string
}

export default ChannelLabels
