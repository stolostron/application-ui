/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2019. All Rights Reserved.
 *
 * Note to U.S. Government Users Restricted Rights:
 * Use, duplication or disclosure restricted by GSA ADP Schedule
 * Contract with IBM Corp.
 * Copyright (c) 2020 Red Hat, Inc.
 *******************************************************************************/
'use strict'

import React from 'react'
import { Query } from 'react-apollo'
import PropTypes from 'prop-types'
import {
  Tag,
  TextInput,
  TextArea,
  Checkbox,
  DropdownV2,
  DropdownSkeleton,
  ComboBox,
  NumberInput,
  Notification,
  InlineLoading,
} from 'carbon-components-react'
import classNames from 'classnames'
import ControlPanelPrompt from './ControlPanelPrompt'
import ControlPanelTreeSelect from './ControlPanelTreeSelect'
import ControlPanelMultiSelect from './ControlPanelMultiSelect'
import ControlPanelCards from './ControlPanelCards'
import ControlPanelTable from './ControlPanelTable'
import ControlPanelLabels from './ControlPanelLabels'
import Tooltip from './Tooltip'
import '../scss/control-panel.scss'
import '../../../../graphics/diagramIcons.svg'
import msgs from '../../../../nls/platform.properties'
import _ from 'lodash'

class ControlPanel extends React.Component {

  static propTypes = {
    controlData: PropTypes.array,
    fetchData: PropTypes.object,
    handleControlChange: PropTypes.func,
    handleGroupChange: PropTypes.func,
    handleNewEditorMode: PropTypes.func,
    isCustomName: PropTypes.bool,
    locale: PropTypes.string,
    notifications: PropTypes.array,
    originalControlData: PropTypes.array,
    showEditor: PropTypes.bool,
  }

  constructor (props) {
    super(props)
    this.state = {}
  }

  componentDidMount(){
    this.refreshFading()
  }


  setCreationViewRef = ref => {this.creationView = ref}
  setCreationViewBottomBlurrRef = ref => {this.creationViewBottomBlurrRef = ref}

  refreshFading = () => {
    if (this.creationViewBottomBlurrRef) {
      const hasScrollbar= this.creationView.scrollHeight > this.creationView.clientHeight
      const towardsBottom = this.creationView.scrollTop + this.creationView.clientHeight > this.creationView.scrollHeight-20
      this.creationViewBottomBlurrRef.style.display =
        (hasScrollbar && !towardsBottom) ? 'block' : 'none'
    }
  }

  setControlSectionRef = (title, ref) => {
    title.sectionRef = ref
  }

  setControlSectionTitleRef = (title, ref) => {
    title.sectionTitleRef = ref
  }

  render() {
    const {controlData, showEditor} = this.props
    const controlClasses = classNames({
      'creation-view-controls': true,
      showEditor
    })

    // render notifications and collapsable control sections
    return (
      <div className='creation-view-controls-container' >
        <div className={controlClasses} ref={this.setCreationViewRef} onScroll={this.refreshFading.bind(this)} >
          {this.renderNotifications()}
          <div className='content'>
            {this.renderControlSections(controlData)}
          </div>
        </div>
        <div className='creation-view-controls-container-blurr bottom' ref={this.setCreationViewBottomBlurrRef} />
      </div>
    )
  }

  renderControlSections(controlData) {
    // create collapsable control sections
    let section
    let content = []
    let stopRendering = false
    let stopRenderingOnNextControl = false
    const controlSections = []
    controlData.forEach(control => {
      const {type, pauseControlCreationHereUntilSelected} = control
      stopRendering = stopRenderingOnNextControl
      if (pauseControlCreationHereUntilSelected) {
        stopRenderingOnNextControl = !control.active
      }
      if (!stopRendering) {
        if (type==='section') {
          content = []
          section={title:control, content}
          controlSections.push(section)
        } else {
          content.push(control)
        }
      }
    })

    return controlSections.map(({title, content})=>{
      const {id, collapsed=false, shadowed} = title
      const sectionClasses = classNames({
        'creation-view-controls-section': true,
        shadowed,
        collapsed,
      })
      title.content = content
      return (
        <React.Fragment key={id}>
          {this.renderControl(id, 'section', title)}
          <div className={sectionClasses}
            ref={this.setControlSectionRef.bind(this, title)}>
            {this.renderControls(content)}
          </div>
        </React.Fragment>
      )
    })
  }

  renderControls(controlData) {
    return (
      <React.Fragment>
        {controlData.map((control, i) => {
          const { id = `${control.type}-${i}`, type } = control
          switch (type) {
          case 'group':
            return this.renderGroup(control)
          default:
            return this.renderControlWithFetch(id, type, control)
          }
        })}
      </React.Fragment>
    )
  }

  renderGroup(control) {
    const {id, active=[], prompts} = control
    return (
      <React.Fragment  key={id}>
        {active.map((controlData, inx)=>{
          return (
            <React.Fragment key={`${controlData[0].id}Group`}>
              <div className='creation-view-group-container' >
                {prompts && inx>0 && this.renderDeleteGroupButton(control, inx)}
                {this.renderControlSections(controlData)}
              </div>
              {(prompts && active.length-1===inx) && this.renderAddGroupButton(control)}
            </React.Fragment>
          )
        })}
      </React.Fragment>
    )
  }

  // if data for 'available' is fetched from server, use apollo component
  renderControlWithFetch(id, type, control) {
    const {fetchAvailable} = control
    if (fetchAvailable) {
      const {query, setAvailable} = fetchAvailable
      return <Query query={query} key={id} >
        {( result ) => {
          setAvailable(control, result)
          return this.renderControlWithPrompt(id, type, control)
        }
        }
      </Query>
    }
    return this.renderControlWithPrompt(id, type, control)
  }

  // if data for 'available' is fetched from server, use apollo component
  renderControlWithPrompt(id, type, control) {
    const {prompts} = control
    if (prompts) {
      const {positionAboveControl} = prompts
      if (positionAboveControl) {
        return (
          <React.Fragment key={id}>
            {this.renderControlPrompt(control)}
            {this.renderControl(id, type, control)}
          </React.Fragment>
        )
      } else {
        return (
          <React.Fragment key={id}>
            {this.renderControl(id, type, control)}
            {this.renderControlPrompt(control)}
          </React.Fragment>
        )
      }
    }
    return this.renderControl(id, type, control)
  }

  renderControlPrompt(control) {
    const { locale, fetchData } = this.props
    return (<ControlPanelPrompt
      control={control}
      handleAddActive={(items) => this.handleAddActive(control, items)}
      locale={locale}
      fetchData={fetchData}
    />)
  }

  renderControl(id, type, control) {
    const { locale, showEditor } = this.props
    switch (type) {
    case 'title':
    case 'section':
      return (<React.Fragment key={id}>
        {this.renderTitle(control)}
      </React.Fragment>)
    case 'text':
      return (<React.Fragment key={id}>
        {this.renderTextInput(control)}
      </React.Fragment>)
    case 'textarea':
      return (<React.Fragment key={id}>
        {this.renderTextArea(control)}
      </React.Fragment>)
    case 'singleselect':
      return (<React.Fragment key={id}>
        {this.renderSingleSelect(control)}
      </React.Fragment>)
    case 'number':
      return (<React.Fragment key={id}>
        {this.renderNumberInput(control)}
      </React.Fragment>)
    case 'combobox':
      return (<React.Fragment key={id}>
        {this.renderComboBox(control)}
      </React.Fragment>)
    case 'multiselect':
      return (<ControlPanelMultiSelect key={id}
        control={control}
        handleChange={this.handleChange.bind(this, control)}
        locale={locale} />)
    case 'treeselect':
      return (<ControlPanelTreeSelect key={id}
        control={control}
        handleChange={this.handleChange.bind(this, control)}
        locale={locale} />)
    case 'cards':
      return (<ControlPanelCards key={id}
        control={control}
        showEditor={showEditor}
        handleChange={this.handleCardChange.bind(this, control)}
        locale={locale}
        fetchData={this.props.fetchData} />)
    case 'table':
      return (<ControlPanelTable key={id}
        control={control}
        handleChange={this.handleControlChange.bind(this, control)}
        locale={locale} />)
    case 'labels':
      return (<ControlPanelLabels key={id}
        control={control}
        handleChange={this.handleControlChange.bind(this, control)}
        locale={locale} />)
    case 'checkbox':
      return (<React.Fragment key={id}>
        {this.renderCheckbox(control)}
      </React.Fragment>)
    }
  }

  renderTitle(control) {
    const { locale } = this.props
    const {title, subtitle, note, overline, numbered, collapsable, collapsed=false, content=[]} = control
    const {info} = control

    const handleCollapse = () => {
      if (control.sectionRef && collapsable) {
        const isCollapsed = control.sectionRef.classList.contains('collapsed')
        control.sectionRef.classList.toggle('collapsed', !isCollapsed)
        control.sectionTitleRef.classList.toggle('collapsed', !isCollapsed)
        if (isCollapsed) {
          // if expanding make sure at least 1st control is visible
          const {content} = control
          const ref = _.get(content, '[2].ref') || _.get(content, '[1].ref') || _.get(content, '[0].ref')
          if (ref) {
            const rect = ref.getBoundingClientRect()
            if(rect.top < 0 || rect.bottom > window.innerHeight) {
              ref.scrollIntoView({ behavior: 'smooth', block: 'end', inline: 'nearest' })
            }
          }
        }
      }
    }
    const handleCollapseKey = (e) => {
      if ( e.type==='click' || e.key === 'Enter') {
        handleCollapse()
      }
    }
    const text = msgs.get('creation.ocp.toggle', locale)
    const titleClasses = classNames({
      'creation-view-controls-title': true,
      overline,
      collapsed,
    })
    const mainTitleClasses = classNames({
      'creation-view-controls-title-main': true,
      subtitle: !!subtitle
    })
    let summary=[]
    this.getSummary(content, summary)
    summary = summary.filter(s=>(!!s))
    let id = `${control.id}-${title || subtitle || ''}`
    id = id.replace(/\s+/g, '-').toLowerCase()
    return (
      <React.Fragment>
        <div id={id} className={titleClasses} tabIndex='0' role={'button'} title={text} aria-label={text}
          onClick={handleCollapse} onKeyPress={handleCollapseKey}
          ref={this.setControlSectionTitleRef.bind(this, control)}>
          {note && <div className='creation-view-controls-note'>{msgs.get(note, locale)}</div>}
          {(title||subtitle) && <div className={mainTitleClasses}>
            {collapsable &&
            <div className={'creation-view-controls-title-main-collapse-button'}>
              <svg className='icon'>
                <use href='#diagramIcons_caret--up' ></use>
              </svg>
            </div>
            }
            {numbered && <div className="creation-view-controls-title-circle">
              {numbered}
            </div>}
            <div className="creation-view-controls-title-main-name">
              {title||subtitle}
              {!info &&<Tooltip control={control} locale={locale} />}
              <span className="creation-view-controls-title-main-summary">
                {summary.map((tag, inx)=>{
                  // eslint-disable-next-line react/no-array-index-key
                  return <Tag key={`${id}-${tag}-${inx}`} className='tag' type='custom'>{tag}</Tag>
                })}
              </span>
            </div>
          </div>}
          <div className="creation-view-controls-title-normal-container">
            {info && <div className="creation-view-controls-title-normal">
              {info}
            </div>}
          </div>
        </div>
      </React.Fragment>
    )
  }

  getSummary(content=[], summary, ignoreEmpty) {
    content.forEach(({id, type, hasValueDescription, summaryKey:key, active, initial, available, availableMap})=>{
      switch (type) {
      case 'title':
      case 'section':
      case 'hidden':
        break
      case 'checkbox':
        summary.push(available[!active?0:1])
        break
      case 'number':
        summary.push(active||initial)
        break
      case 'table':
        active.forEach(a=>{
          summary.push(a[key])
        })
        break
      case 'labels':
        active.forEach(({key, value})=>{
          summary.push(`${key}=${value}`)
        })
        break
      default:
        if (hasValueDescription && availableMap) {
          summary.push(availableMap[active] || active)
        } else if (Array.isArray(active)) {
          if (availableMap && active.length===1) {
            const {title=''} = availableMap[active[0]]
            summary.push(title)
          } else if (typeof active[0] === 'string'){
            summary.push(...active)
          } else {
            this.getSummary(active[0], summary, true)
          }
        } else {
          switch (typeof active) {
          case 'string':
            if (active.length>24) {
              if (id.indexOf('ssh')!==-1) {
                active = 'ssh'
              } else if (id.indexOf('secret')!==-1) {
                active = 'secret'
              } else {
                active=`${active.substr(0,12)}...${active.substr(-12)}`
              }
            }
            summary.push(active)
            break
          default:
            if (!ignoreEmpty) {
              summary.push('')
            }
            break
          }
        }
        break
      }
    })
  }

  setControlRef = (control, ref) => {control.ref = ref}

  renderTextInput(control) {
    const {locale} = this.props
    const {id, name, active:value, existing, exception, validation={}} = control

    // special case--validate that name is unique
    let invalid = !!exception
    if (!invalid && id==='name') {
      const { isCustomName } = this.props
      if (isCustomName && existing) {
        invalid = new Set(existing).has(value)
      }
    }
    // if placeholder missing, create one
    let {placeholder} = control
    if (!placeholder) {
      placeholder = msgs.get('creation.ocp.cluster.enter.value', [name.toLowerCase()], locale)
    }
    return (
      <React.Fragment>
        <div className='creation-view-controls-textbox'
          style={{display: ''}}
          ref={this.setControlRef.bind(this, control)}>
          <div className="creation-view-controls-textbox-title">
            {name}
            {validation.required ? <div className='creation-view-controls-required'>*</div> : null}
            <Tooltip control={control} locale={locale} />
          </div>
          <TextInput
            id={id}
            hideLabel
            spellCheck={false}
            autoComplete={'no'}
            labelText=''
            invalid={!!exception}
            invalidText={exception}
            placeholder={placeholder}
            value={value||''}
            onChange={this.handleChange.bind(this, control)} />
        </div>
      </React.Fragment>
    )
  }

  renderTextArea(control) {
    const {locale} = this.props
    const {id, name, active:value, exception, validation} = control
    return (
      <React.Fragment>
        <div className='creation-view-controls-textarea'
          ref={this.setControlRef.bind(this, control)}>
          <div className="creation-view-controls-textarea-title">
            {name}
            {validation.required ? <div className='creation-view-controls-required'>*</div> : null}
            <Tooltip control={control} locale={locale} />
          </div>
          <TextArea
            id={id}
            invalid={!!exception}
            invalidText={exception}
            hideLabel
            spellCheck={false}
            autoComplete={'no'}
            labelText=''
            value={value}
            onChange={this.handleChange.bind(this, control)} />
        </div>
      </React.Fragment>
    )
  }

  renderCheckbox(control) {
    const {locale} = this.props
    const {id, name, active} = control
    return (
      <React.Fragment>
        <div className='creation-view-controls-checkbox'
          ref={this.setControlRef.bind(this, control)}>
          <Checkbox
            id={id}
            className='checkbox'
            hideLabel
            labelText=''
            checked={active}
            onChange={this.handleChange.bind(this, control)} />
          <div style={{height: '20px'}}>{name}</div>
          <Tooltip control={control} locale={locale} />
        </div>
      </React.Fragment>
    )
  }

  renderSingleSelect(control) {
    const {locale} = this.props
    const {id, name, placeholder='', available=[], validation, isLoading, isFailed} = control
    let {active} = control
    if (!active) {
      if (isLoading) {
        active = msgs.get(_.get(control, 'fetchAvailable.loadingDesc', 'resource.loading'), locale)
      } else if (isFailed) {
        active = msgs.get('resource.error', locale)
      } else if (available.length===0) {
        active = msgs.get(_.get(control, 'fetchAvailable.emptyDesc', 'resource.none'), locale)
      }
    }
    const key = `${id}-${name}-${available.join('-')}`
    return (
      <React.Fragment>
        <div className='creation-view-controls-singleselect'
          ref={this.setControlRef.bind(this, control)}>
          <div className="creation-view-controls-multiselect-title">
            {name}
            {validation.required ? <div className='creation-view-controls-required'>*</div> : null}
            <Tooltip control={control} locale={locale} />
          </div>
          {isLoading
            ? <div className='creation-view-controls-singleselect-loading'>
              <DropdownSkeleton />
              <InlineLoading description={active} />
            </div>
            : <div id={id}><DropdownV2
              key={key}
              items={available}
              label={active||placeholder}
              onChange={this.handleChange.bind(this, control)} />
            </div>}
        </div>
      </React.Fragment>
    )
  }

  renderNumberInput(control) {
    const {locale} = this.props
    const {id, name, initial, exception, validation} = control

    return (
      <React.Fragment>
        <div className='creation-view-controls-number'
          ref={this.setControlRef.bind(this, control)}>
          <div className="creation-view-controls-multiselect-title">
            {name}
            {validation.required ? <div className='creation-view-controls-required'>*</div> : null}
            <Tooltip control={control} locale={locale} />
          </div>
          <NumberInput
            allowEmpty
            id={id}
            value={typeof initial==='string' ? Number(initial) : initial}
            invalid={!!exception}
            invalidText={exception}
            min={1}
            max={100}
            step={1}
            onChange={this.handleChange.bind(this, control)}
          />
        </div>
      </React.Fragment>
    )
  }

  renderComboBox(control) {
    const {locale} = this.props
    const {id, name, userData=[], availableMap, exception, validation,
      hasReplacements, isLoading, isFailed} = control
    const { controlData } = this.props
    let {active, available, placeholder=''} = control
    let loadingMsg
    if (isLoading) {
      loadingMsg = msgs.get(_.get(control, 'fetchAvailable.loadingDesc', 'resource.loading'), locale)
    } else if (isFailed) {
      placeholder = msgs.get('resource.error', locale)
    } else if (available.length===0) {
      placeholder = msgs.get(_.get(control, 'fetchAvailable.emptyDesc', 'resource.empty'), locale)
    }
    available = _.uniq([...userData, ...available])

    // when available map has descriptions of choices
    // ex: instance types have # cpu's etc
    if (availableMap && !hasReplacements) {
      const map = _.invert(availableMap)
      active = map[active] || active
    }

    // combo prefers id's
    const items = available.map((label,inx)=>{
      return {label, id:inx}
    })
    const initialSelectedItem = items.find(item=>item.label===active)


    const key = `${id}-${name}-${active}`
    return (
      <React.Fragment>
        <div className='creation-view-controls-singleselect'
          ref={this.setControlRef.bind(this, control)}>
          <div className="creation-view-controls-multiselect-title">
            {name}
            {validation.required ? <div className='creation-view-controls-required'>*</div> : null}
            <Tooltip control={control} locale={locale} />
          </div>
          {isLoading
            ? <div className='creation-view-controls-singleselect-loading'>
              <DropdownSkeleton />
              <InlineLoading description={loadingMsg} />
            </div> :
            <ComboBox
              key={key}
              items={items}
              itemToString={item=>item?item.label:''}
              initialSelectedItem={initialSelectedItem}
              selecteditem={active}
              spellCheck={false}
              ref={(ref)=>{
                if (ref) {
                  const input = _.get(ref, 'textInput.current')
                  if (input) {
                    input.autocomplete = 'no'
                    input.addEventListener('keyup', (e)=>{
                      if ( e.key === 'Enter') {
                        if (control.typing) {
                          userData.push(control.typing)
                          control.userData = userData
                          control.active = control.typing
                          this.props.handleControlChange(control, controlData)
                          delete control.typing
                        }
                      }
                    })
                  }
                }
              }}
              invalid={!!exception}
              invalidText={exception}
              placeholder={placeholder}
              onChange={()=>{}}
              onFocus={(e)=>{
                e.target.select()
              }}
              onInputChange={this.handleComboboxInputChange.bind(this, control, available)}
            />}
        </div>
      </React.Fragment>
    )
  }

  handleComboboxInputChange(control, available, evt) {
    const { controlData } = this.props

    // if menu is still open, user is typing
    const menu = control.ref.getElementsByClassName('bx--list-box__menu')
    if (menu && menu.length>0) {

      // shh--user is typing something--filter the list
      Array.from(menu[0].getElementsByClassName('bx--list-box__menu-item')).forEach((item, inx)=>{
        if (available[inx].indexOf(evt)===-1) {
          item.innerHTML = available[inx]
          item.style.display = 'none'
        } else {
          item.innerHTML = available[inx].replace(new RegExp(evt, 'gi'), (found) => {
            return '<b>'+found+'</b>'
          })
          item.style.display = ''
        }
      })
      control.typing = evt

    } else {
      control.active = evt
      this.props.handleControlChange(control, controlData)
    }
  }

  handleChange(control, evt) {
    let updateName = false
    let { isCustomName } = this.props
    const { controlData, originalControlData } = this.props
    const { id:field, type, syncWith, syncedWith } = control
    switch (type) {
    case 'text':
      control.active = evt.target.value
      isCustomName = field==='name'
      break
    case 'textarea':
      control.active = evt.target.value
      break
    case 'singleselect':
      control.active = evt.selectedItem
      break
    case 'number':
      control.active = evt.imaginaryTarget.valueAsNumber
      break
    case 'combobox':
      control.active = evt.selectedItem
      break
    case 'treeselect':
      control.active = evt.selectedItem
      break
    case 'multiselect':
      control.active = evt.selectedItems
      // if user was able to select something that automatically
      // generates the name, blow away the user name
      updateName = !isCustomName && control.updateNamePrefix
      break
    case 'checkbox':
      control.active = evt
      break
    }

    // update name if spec changed
    if (updateName) {
      let cname
      const nname = controlData.find(({id})=>id==='name')
      if (nname) {
        if (control.active.length>0) {
          cname = control.updateNamePrefix +
            control.availableMap[control.active[0]].name.replace(/\W/g, '-')
        } else {
          cname = originalControlData.find(({id})=>id==='name').active
        }
        nname.active = cname.toLowerCase()
      }
    }

    // syncing values
    if (syncWith) {
      // whatever is typed into this control, also put in other control
      const syncControl = controlData.find(({id})=>id===syncWith)
      syncControl.active = control.active
    }
    if (syncedWith) {
      // if another control is synced with this control and
      // user is typing a value here directly, remove sync
      const syncedControl = controlData.find(({id})=>id===syncedWith)
      delete control.syncedWith
      delete syncedControl.syncWith
    }

    this.props.handleControlChange(control, controlData, isCustomName)
    return field
  }

  handleCardChange(control, selection) {
    const { controlData, isCustomName } = this.props
    const {multiselect, newEditorMode} = control
    if (!newEditorMode) {
      if (!multiselect) {
        control.active = selection
      } else {
        if (!control.active) {
          control.active = [selection]
        } else {
          const inx = control.active.indexOf(selection)
          if (inx===-1) {
            control.active.push(selection)
          } else {
            control.active.splice(inx, 1)
          }
        }
      }
      this.props.handleControlChange(control, controlData, this.creationView, isCustomName)
    } else {
      control.active = [selection]
      this.props.handleNewEditorMode(control, controlData, this.creationView)
    }
  }

  handleControlChange(control) {
    const { controlData } = this.props
    this.props.handleControlChange(control, controlData)
  }

  handleAddActive = (control, items) => {
    control.active = items
    this.props.handleControlChange(control, this.props.controlData, this.creationView, this.props.isCustomName)
  }

  renderNotifications() {
    const {notifications=[]} = this.props
    if (notifications.length>0) {
      return notifications.map(({id, exception, kind='error', ref, tabInx=0, editor, row})=>{
        const handleClick = () => {
          if (ref) {
            ref.scrollIntoView({behavior: 'smooth', block: 'center'})
          } else if (editor && row) {
            const tabContainer = document.querySelector('.creation-view-yaml-header-tabs')
            if (tabContainer) {
              const tabs = tabContainer.getElementsByClassName('.bx--tabs__nav-link')
              if (tabs.length>0) {
                tabs[tabInx].click()
              }
            }
            setTimeout(() => {
              editor.revealLineInCenter(row)
            }, 0)

          }
        }
        const handleKeyPress = (e) => {
          if ( e.key === 'Enter') {
            handleClick()
          }
        }
        return <div key={exception} role='button' onClick={handleClick}
          tabIndex="0" aria-label={exception} onKeyDown={handleKeyPress}>
          <Notification
            key={id}
            title=''
            className='persistent notification'
            subtitle={exception}
            kind={kind} />
        </div>
      })
    }
    return null
  }

  renderDeleteGroupButton(control, inx) {
    const { locale, controlData } = this.props
    const {prompts: {deletePrompt}} = control
    const handleGroupChange = () => {
      this.props.handleGroupChange(control, controlData, this.creationView, inx)
    }
    const handleGroupChangeKey = (e) => {
      if ( e.type==='click' || e.key === 'Enter') {
        handleGroupChange()
      }
    }
    const text = msgs.get(deletePrompt, locale)
    return (
      <div className='creation-view-controls-delete-button' tabIndex='0' role={'button'}
        title={text} aria-label={text}
        onClick={handleGroupChange} onKeyPress={handleGroupChangeKey}>
        <svg className='icon'>
          <use href={'#diagramIcons_trash'} ></use>
        </svg>
      </div>
    )
  }

  renderAddGroupButton(control) {
    const { locale, controlData } = this.props
    const {prompts: {addPrompt}} = control
    const handleGroupChange = () => {
      this.props.handleGroupChange(control, controlData, this.creationView)
    }
    const handleGroupChangeKey = (e) => {
      if ( e.type==='click' || e.key === 'Enter') {
        handleGroupChange()
      }
    }
    const text = msgs.get(addPrompt, locale)
    return (
      <div className='creation-view-controls-add-value-container'>
        <div id={`add-${control.id}`} className='creation-view-controls-add-button' tabIndex='0' role={'button'}
          title={text} aria-label={text}
          onClick={handleGroupChange} onKeyPress={handleGroupChangeKey}>
          {text}
          <svg className='icon'>
            <use href={'#diagramIcons_add'} ></use>
          </svg>
        </div>
      </div>
    )
  }

}

export default ControlPanel
