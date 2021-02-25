/** *****************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2018, 2019. All Rights Reserved.
 *
 * US Government Users Restricted Rights - Use, duplication or disclosure
 * restricted by GSA ADP Schedule Contract with IBM Corp.
 *******************************************************************************/

import React from 'react'
import PropTypes from 'prop-types'
import { Tooltip } from 'carbon-components-react'
import resources from '../../../lib/shared/resources'
import truncate from '../../util/truncate-middle'

resources(() => {
  require('../../../scss/textWithTruncation.scss')
})

class TruncateText extends React.PureComponent {
  static propTypes = {
    maxCharacters: PropTypes.number,
    text: PropTypes.string.isRequired
  };

  static defaultProps = {
    maxCharacters: 35
  };

  render() {
    if (this.props.text.length <= this.props.maxCharacters) {
      return this.props.text
    }

    return (
      <Tooltip
        triggerClassName="textWithTruncation"
        showIcon={false}
        text={this.props.text}
        triggerText={truncate(this.props.text, this.props.maxCharacters)}
      >
        {this.props.text}
      </Tooltip>
    )
  }
}

export default TruncateText
