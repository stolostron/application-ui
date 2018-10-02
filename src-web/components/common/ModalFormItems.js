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
import msgs from '../../../nls/platform.properties'
import { Icon } from 'carbon-components-react'
import withMultiple from './ModalListItem'
/* eslint-disable react/prop-types, react/jsx-no-bind */

const Label = ({ id, item, onRemove }) =>
  <div className='field-row'>
    <p>{item.key}={item.value}</p>
    {!item.formServer && <p className={'secondary-text-field'}>Added</p>}
    {item.updated && <p className={'secondary-text-field'}>Updated</p>}
    <RemoveIcon id={`labels-remove-${id}`} onRemove={onRemove} uniqueKey={item.key} />
  </div>

const RemoveIcon = ({ id, onRemove, uniqueKey }, context) =>
  <Icon
    id={id}
    tabIndex='0'
    onClick={onRemove}
    onKeyDown={e => e.persist && (e.which === 13 || e.which === 32) && onRemove(uniqueKey)}
    name='icon--close--solid'
    description={msgs.get('svg.description.remove', context.locale)}
  />


const Labels = withMultiple(Label, { key: '', value: '' })

export { Labels, RemoveIcon }
