/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2018. All Rights Reserved.
 *
 * Note to U.S. Government Users Restricted Rights:
 * Use, duplication or disclosure restricted by GSA ADP Schedule
 * Contract with IBM Corp.
 *******************************************************************************/

import React from 'react'
import PropTypes from 'prop-types'
import { ClickableTile, OverflowMenu, OverflowMenuItem, SkeletonText } from 'carbon-components-react'
import { formatNumber } from '../../../lib/client/search-helper'
import msgs from '../../../nls/platform.properties'
import '../../../scss/search-query-tile.scss'

class SearchQueryTile extends React.PureComponent {
  static propTypes = {
    count: PropTypes.number,
    description: PropTypes.string,
    loading: PropTypes.bool,
    name: PropTypes.string,
    onClick: PropTypes.func,
    onDelete: PropTypes.func,
    onEdit: PropTypes.func,
    onShare: PropTypes.func,
    template: PropTypes.bool,
  }

  static contextTypes = {
    locale: PropTypes.string
  }

  loadingComponent() {
    return (
      <ClickableTile >
        <div className='query-tile-loading'>
          <SkeletonText />
          <SkeletonText />
        </div>
      </ClickableTile>
    )
  }

  overflowMenu(onDelete, onEdit, onShare, locale) {
    return (
      <div className='query-tile-overflow'>
        <OverflowMenu floatingMenu flipped iconDescription={msgs.get('svg.description.overflowMenu', locale)}>
          <OverflowMenuItem
            onClick={onEdit}
            key={'edit-query'}
            itemText={msgs.get('actions.edit.search', locale)} />
          <OverflowMenuItem
            onClick={onShare}
            key={'share-query'}
            itemText={msgs.get('actions.share.search', locale)} />
          <OverflowMenuItem
            isDelete={true}
            onClick={onDelete}
            key={'delete-query'}
            itemText={msgs.get('actions.delete.search', locale)}
          />
        </OverflowMenu>
      </div>
    )
  }

  render() {
    const { count, description, onClick, onDelete, onEdit, onShare, loading, name, template } = this.props
    const { locale } = this.context
    return loading
      ? this.loadingComponent()
      : <ClickableTile
        id={name}
        onClick={onClick}
        defaultChecked={false}
        tabIndex={0} >
        <div className='query-tile-content'>
          <div className='query-tile-content-result'>
            <div className={`query-tile-content-result${template ? '-template' : '-count'}`}>
              {formatNumber(count)}
            </div>
            <div className='query-tile-content-result-text'>
              {msgs.get('search.tile.results', locale)}
            </div>
          </div>
          <div className='spacer' />
          <div className='query-tile-content-info'>
            <div className='query-tile-content-info-name'>
              {name}
            </div>
            <div className='query-tile-content-info-desc'>
              {description}
            </div>
            {!template ? this.overflowMenu(onDelete, onEdit, onShare, locale) : null}
          </div>
        </div>
      </ClickableTile>
  }
}

export default SearchQueryTile
