/** *****************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2018, 2019. All Rights Reserved.
 *
 * US Government Users Restricted Rights - Use, duplication or disclosure
 * restricted by GSA ADP Schedule Contract with IBM Corp.
 *******************************************************************************/
// Copyright (c) 2020 Red Hat, Inc.
'use strict'

import React from 'react'
import PropTypes from 'prop-types'
import msgs from '../../../nls/platform.properties'

class ScrollBox extends React.PureComponent {
  componentDidMount() {
    this.scrollToBottom()
  }

  componentDidUpdate() {
    this.scrollToBottom()
  }

  render() {
    const { content, className } = this.props
    // eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex
    return (
      <div
        className={className}
        ref={div => {
          this.scrollBox = div
        }}
        tabIndex="0" /* eslint-disable-line jsx-a11y/no-noninteractive-tabindex*/
      >
        <pre>
          {content ? content : msgs.get('search.notfound', this.context.locale)}
        </pre>
      </div>
    )
  }

  scrollToBottom() {
    if (this.scrollBox) {
      this.scrollBox.scrollTop = this.scrollBox.scrollHeight
    }
  }
}

ScrollBox.contextTypes = {
  locale: PropTypes.string
}

ScrollBox.propTypes = {
  className: PropTypes.string,
  content: PropTypes.string
}
export default ScrollBox
