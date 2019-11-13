/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2018, 2019. All Rights Reserved.
 *
 * US Government Users Restricted Rights - Use, duplication or disclosure
 * restricted by GSA ADP Schedule Contract with IBM Corp.
 *******************************************************************************/
'use strict'

import React from 'react'
import msgs from '../../../nls/platform.properties'
import { Icon } from 'carbon-components-react'
import withMultiple from './ModalListItem'
import config from '../../../lib/shared/config'
/* eslint-disable react/prop-types, react/jsx-no-bind */

const Label = ({ id, item, onRemove, onClickRow, onUndo }) => (
  <div
    tabIndex="0"
    className="field-row"
    onClick={onClickRow}
    onKeyDown={e => e.persist && e.which === 13 && onClickRow(item.key)}
    role={'button'}
  >
    <p>
      {item.key}={item.value}
    </p>
    {item.deleted ? (
      <div>
        {<p className={'secondary-text-field'}>Deleted</p>}
        <UndoIcon
          id={`labels-undo-${id}`}
          onUndo={onUndo}
          uniqueKey={item.key}
        />
      </div>
    ) : (
      <div>
        {!item.fromServer && <p className={'secondary-text-field'}>Added</p>}
        {item.updated && <p className={'secondary-text-field'}>Updated</p>}
        <RemoveIcon
          id={`labels-remove-${id}`}
          onRemove={onRemove}
          uniqueKey={item.key}
        />
      </div>
    )}
  </div>
)

const RemoveIcon = ({ id, onRemove, uniqueKey }, context) => (
  <Icon
    id={id}
    tabIndex="0"
    onClick={onRemove}
    onKeyDown={e =>
      e.persist && (e.which === 13 || e.which === 32) && onRemove(uniqueKey)
    }
    name="icon--close--solid"
    description={msgs.get('svg.description.remove', context.locale)}
  />
)

const UndoIcon = ({ id, onUndo, uniqueKey }) => (
  <input
    id={id}
    tabIndex="0"
    onClick={onUndo}
    onKeyDown={e =>
      e.persist && (e.which === 13 || e.which === 32) && onUndo(uniqueKey)
    }
    type="image"
    alt="undo-icon"
    className="undo-button"
    src={`${config.contextPath}/graphics/undo.svg`}
  />
)

const Labels = withMultiple(Label, { key: '', value: '' })

export { Labels, RemoveIcon }
