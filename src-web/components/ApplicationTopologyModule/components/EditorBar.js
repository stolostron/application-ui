/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2018, 2019. All Rights Reserved.
 *
 * US Government Users Restricted Rights - Use, duplication or disclosure
 * restricted by GSA ADP Schedule Contract with IBM Corp.
 *******************************************************************************/
'use strict'

import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import {
  Search,
  OverflowMenu,
  OverflowMenuItem
} from 'carbon-components-react'
import resources from '../../../../lib/shared/resources'
import '../../../../graphics/diagramIcons.svg'
import msgs from '../../../../nls/platform.properties'

resources(() => {
  require('../scss/editor-bar.scss')
})

class EditorBar extends React.Component {
  static propTypes = {
    exceptions: PropTypes.array,
    gotoEditorLine: PropTypes.func,
    handleEditorCommand: PropTypes.func,
    handleSearchChange: PropTypes.func,
    hasRedo: PropTypes.bool,
    hasUndo: PropTypes.bool
  };

  constructor(props) {
    super(props)
    this.state = {
      searchName: ''
    }
    this.renderErrorIcon = this.renderErrorIcon.bind(this)
  }

  handleClick = command => {
    this.props.handleEditorCommand(command)
  };

  handleSearch = ({ target }) => {
    const searchName = target.value || ''
    this.props.handleSearchChange(searchName)
    this.setState({ searchName })
  };

  render() {
    const { locale } = this.context
    const { hasUndo, hasRedo, exceptions } = this.props
    const { searchName } = this.state

    const editorButtons = [
      {
        command: 'previous',
        tooltip: msgs.get('editor.bar.previous', locale),
        icon: 'previous',
        disabled: !searchName
      },
      {
        command: 'next',
        tooltip: msgs.get('editor.bar.next', locale),
        icon: 'next',
        disabled: !searchName
      },
      { command: 'spacer1', spacer: true },
      {
        command: 'undo',
        tooltip: msgs.get('editor.bar.undo', locale),
        icon: 'undo',
        disabled: !hasUndo
      },
      {
        command: 'redo',
        tooltip: msgs.get('editor.bar.redo', locale),
        icon: 'redo',
        disabled: !hasRedo
      },
      {
        command: 'restore',
        tooltip: msgs.get('editor.bar.restore', locale),
        icon: 'restore',
        disabled: !hasUndo
      },
      { command: 'spacer2', spacer: true }
    ]
    const menuItems = []
    if (exceptions.filter(exception=>exception.type==='error').length === 0) {
      editorButtons.push({
        command: 'update',
        tooltip: msgs.get('editor.bar.update', locale),
        icon: 'deploy',
        disabled: !hasUndo
      })
    } else {
      exceptions.forEach(({ text, row }) => {
        if (text.length > 64) text = text.substr(0, 64) + '...'
        menuItems.push({
          text,
          row
        })
      })
    }
    const searchTitle = msgs.get('search.label', locale)
    return (
      <div className="editor-bar">
        <div
          className="editor-bar-search"
          role="region"
          aria-label={searchTitle}
          id={searchTitle}
        >
          <Search
            id="search-name"
            labelText=""
            aria-label={searchTitle}
            placeHolderText={searchTitle}
            small={true}
            onChange={this.handleSearch}
          />
        </div>
        {editorButtons.map(button => {
          const { command } = button
          return (
            <EditorButton
              key={command}
              command={command}
              button={button}
              handleClick={this.handleClick}
            />
          )
        })}
        {exceptions.filter(exception=>exception.type==='error').length > 0 && (
          <OverflowMenu floatingMenu flipped renderIcon={this.renderErrorIcon}>
            {menuItems.map(({ text, row }) => {
              const gotoEditorLine = this.gotoEditorLine.bind(this, row)
              return (
                <OverflowMenuItem
                  key={text}
                  className="editor-error-button-item"
                  itemText={
                    <div className="item-container">
                      <div className="item-icon">
                        <svg width="12px" height="12px">
                          <use href={'#diagramIcons_failure'} />
                        </svg>
                      </div>
                      <div>{text}</div>
                    </div>
                  }
                  onClick={gotoEditorLine}
                />
              )
            })}
          </OverflowMenu>
        )}
      </div>
    )
  }

  gotoEditorLine(line) {
    const { gotoEditorLine } = this.props
    gotoEditorLine(line)
  }

  renderErrorIcon({ ...props }) {
    props.className = 'editor-error-button'
    const { exceptions } = this.props
    const { locale } = this.context
    const tooltips = exceptions
      .map(({ row, column, text }) => {
        return msgs.get('editor.bar.error', [row, column, text], locale)
      })
      .join('\n')
    return (
      <div title={tooltips} {...props}>
        <svg width="12px" height="12px">
          <use href={'#diagramIcons_failure'} />
        </svg>
      </div>
    )
  }
}

class EditorButton extends React.Component {
  static propTypes = {
    button: PropTypes.object,
    command: PropTypes.string,
    handleClick: PropTypes.func
  };

  handleClick = () => {
    const { command, button: { disabled } } = this.props
    if (!disabled) {
      document.activeElement.blur()
      this.props.handleClick(command)
    }
  };

  handleKeyPress = e => {
    if (e.key === 'Enter') {
      this.props.handleClick(this.props.command)
    }
  };

  render() {
    const {
      button: { disabled, tooltip, icon, className = '', spacer }
    } = this.props
    if (spacer) {
      return <div className="editor-bar-spacer" />
    } else {
      const classes = classNames({
        'editor-bar-button': true,
        [`${className}`]: true,
        disabled
      })
      return (
        <div
          className={classes}
          tabIndex="0"
          role={'button'}
          aria-label={tooltip}
          title={tooltip}
          onClick={this.handleClick}
          onKeyPress={this.handleKeyPress}
        >
          <svg width="16px" height="16px">
            <use href={`#diagramIcons_${icon}`} />
          </svg>
        </div>
      )
    }
  }
}

export default EditorBar
