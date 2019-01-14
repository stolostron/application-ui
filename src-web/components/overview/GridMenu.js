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
import { OverflowMenu, OverflowMenuItem } from 'carbon-components-react'
import { CardActions, CardTypes } from './constants.js'
import msgs from '../../../nls/platform.properties'

class GridMenu extends React.Component {

  static propTypes = {
    item: PropTypes.object,
  }

  constructor (props) {
    super(props)
    this.pieChart = this.pieChart.bind(this)
    this.lineChart = this.lineChart.bind(this)
    this.removeCard = this.removeCard.bind(this)
  }

  render() {
    const { locale } = this.context
    const {item} = this.props
    const { cardData: {actions} } = item
    return (
      <div className='grid-menu' >
        <OverflowMenu  floatingMenu flipped
          iconDescription={msgs.get('svg.description.overflowMenu', locale)}>
          {actions.map((action) => {
            let itemText, onClick, isDelete=false
            switch(action) {
            case CardActions.pie:
              itemText = msgs.get('card.action.pie.chart', locale)
              onClick = this.pieChart
              break
            case CardActions.line:
              itemText = msgs.get('card.action.line.chart', locale)
              onClick = this.lineChart
              break
            case CardActions.remove:
              itemText = msgs.get('card.action.remove', locale)
              onClick = this.removeCard
              isDelete=true
              break
            }
            return (
              <OverflowMenuItem
                key={action}
                itemText={itemText}
                isDelete={isDelete}
                onClick={onClick}
              />)
          })}
        </OverflowMenu>
      </div>
    )
  }

  pieChart() {
    const {item: {spliceCards, cardData }} = this.props
    cardData.type = CardTypes.piechart
    const idx = cardData.actions.indexOf(CardActions.pie)
    cardData.actions.splice(idx,1,CardActions.line)
    spliceCards(cardData)
  }

  lineChart() {
    const {item: {spliceCards, cardData }} = this.props
    cardData.type = CardTypes.linegraph
    const idx = cardData.actions.indexOf(CardActions.line)
    cardData.actions.splice(idx,1,CardActions.pie)
    spliceCards(cardData)
  }

  removeCard() {
    const {item: {spliceCards }} = this.props
    spliceCards()
  }

}

export default GridMenu
