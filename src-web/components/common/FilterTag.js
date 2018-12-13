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

class Tag extends React.Component {
  // customized tag, used by tag input
  getClassType(tag) {
    const { classNames } = this.props
    switch (tag.classType) {
    case 'keyword':
      return 'react-tags__keyword-tag'
    default: return classNames.selectedTag
    }
  }
  render() {
    const { classNames, onDelete, tag } = this.props
    return (
      <button type='button' className={this.getClassType(tag)} onClick={onDelete}>
        <span className={classNames.selectedTagName}>{tag.name}</span>
      </button>
    )
  }
}

Tag.propTypes = {
  classNames: PropTypes.object,
  onDelete: PropTypes.func,
  tag: PropTypes.object,
}

export default Tag
