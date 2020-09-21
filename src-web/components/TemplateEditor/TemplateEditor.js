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
import ReactDOM from 'react-dom'
import {Prompt} from 'react-router-dom'
import SplitPane from 'react-split-pane'
import classNames from 'classnames'
import PropTypes from 'prop-types'
import {
  Button,
  Notification,
  InlineNotification,
  ToggleSmall
} from 'carbon-components-react'
import {
  initializeControls,
  generateSource,
  getUniqueName,
  cacheUserData } from './utils/utils'
import { validateControls } from './utils/validate-controls'
import {
  highlightChanges,
  highlightAllChanges,
} from './utils/refresh-source-highlighting'
import ControlPanel from './components/ControlPanel'
import EditorHeader from './components/EditorHeader'
import EditorBar from './components/EditorBar'
import YamlEditor from './components/YamlEditor'
import TooltipContainer from './components/TooltipContainer'
import './scss/template-editor.scss'
import msgs from '../../../nls/platform.properties'
import '../../../graphics/diagramIcons.svg'
import _ from 'lodash'

const TEMPLATE_EDITOR_OPEN_COOKIE = 'template-editor-open-cookie'

export default class TemplateEditor extends React.Component {
  static propTypes = {
    controlData: PropTypes.array.isRequired,
    createControl: PropTypes.shape({
      hasPermissions: PropTypes.bool,
      createResource: PropTypes.func,
      cancelCreate: PropTypes.func,
      creationStatus: PropTypes.string,
      creationMsg: PropTypes.array
    }).isRequired,
    fetchControl: PropTypes.shape({
      resources: PropTypes.array,
      isLoaded: PropTypes.bool,
      isFailed: PropTypes.bool,
      fetchData: PropTypes.object
    }),
    history: PropTypes.object,
    locale: PropTypes.string,
    portals: PropTypes.object.isRequired,
    savedFormData: PropTypes.oneOfType([
      PropTypes.object,
      PropTypes.arrayOf(PropTypes.object)
    ]),
    template: PropTypes.func.isRequired,
    title: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    updateFormState: PropTypes.func
  };

  static getDerivedStateFromProps(props, state) {
    const { createControl = {}, type, locale } = props

    // update notifications
    let { notifications } = state
    const { hasFormExceptions, isEditing } = state
    const { creationStatus, creationMsg } = createControl
    if (creationStatus && !hasFormExceptions) {
      switch (creationStatus) {
      case 'IN_PROGRESS':
        notifications = [
          {
            id: 'creating',
            kind: 'info',
            exception: Array.isArray(creationMsg)
              ? creationMsg[0]
              : msgs.get(isEditing?'success.create.updating':'success.create.creating', [type], locale)
          }
        ]
        break

      case 'DONE':
        notifications = [
          {
            id: 'success',
            kind: 'success',
            exception: Array.isArray(creationMsg)
              ? creationMsg[0]
              : msgs.get(isEditing?'success.create.updated':'success.create.created', [type], locale)
          }
        ]
        break

      case 'ERROR':
        notifications = creationMsg.map(message => {
          return {
            id: 'create',
            kind: 'error',
            exception: message.message || message
          }
        })
        break
      }
      return { notifications }
    }

    // is a resource loaded in editor?
    const { fetchControl } = props
    const { isLoaded, isFailed } = fetchControl || { isLoaded: true }
    const showEditor = isLoaded && !!localStorage.getItem(TEMPLATE_EDITOR_OPEN_COOKIE)
    let newState = {isLoaded, isFailed, showEditor}

    // has control data been initialized?
    const { controlData: initialControlData } = props
    let { controlData, templateYAML, templateObject, editStack } = state
    const { forceUpdate, template } = state
    if (!controlData) {
      // initialize control data
      const cd = _.cloneDeep(initialControlData)
      controlData = initializeControls(
        cd,
        cd,
        forceUpdate,
        locale
      )
      newState = {...newState, controlData}
    }

    // has source been initialized?
    if (isLoaded && !templateYAML) {

      // editing an existing set of resources??
      const editResources = _.get(fetchControl, 'resources')
      if (editResources) {
        editStack = [{editResources, forceUpdate, locale}]
      }

      // generate source from template or stack of resources
      ({ templateYAML, templateObject } = generateSource(
        template,
        editStack,
        controlData
      ))

      newState = {...newState, templateYAML, firstTemplateYAML:templateYAML,
        templateObject, editStack, isEditing: !!editResources}
    }


    // make sure an auto generated name is unique
    const { isCustomName } = state
    if (!isCustomName) {
      const name = controlData.find(({ id }) => id === 'name')
      if (name) {
        const { active, existing } = name
        const uniqueName = getUniqueName(active, new Set(existing))
        if (uniqueName !== active) {
          name.active = uniqueName;
          ({ templateYAML, templateObject } = generateSource(
            template,
            editStack,
            controlData
          ))
          newState = {...newState, controlData, templateYAML, templateObject }
        }
      }
    }

    return newState
  }

  constructor(props) {
    super(props)
    this.state = {
      isCustomName: false,
      template: props.template,
      activeYAMLEditor: 0,
      exceptions: [],
      previouslySelectedCards: [],
      notifications: [],
      otherYAMLTabs: [],
      updateMessage: '',
      /* eslint-disable-next-line react/no-unused-state */
      hasFormExceptions: false,
      isFinalValidate: false,
      hasUndo: false,
      hasRedo: false,
      resetInx: 0,
      forceUpdate: (()=>{
        this.forceUpdate()
      }).bind(this)
    }
    this.selectedTab = 0
    this.isDirty = false
    this.firstGoToLinePerformed = false
    this.editors = []
    this.parseDebounced = _.debounce(yaml => {
      this.handleParse(yaml)
    }, 500)
    this.handleEditorCommand = this.handleEditorCommand.bind(this)
    this.handleSearchChange = this.handleSearchChange.bind(this)
    this.gotoEditorLine = this.gotoEditorLine.bind(this)
    this.handleNewEditorMode = this.handleNewEditorMode.bind(this)
    this.handleControlChange = this.handleControlChange.bind(this)
    this.handleGroupChange = this.handleGroupChange.bind(this)
    const { type = 'unknown' } = this.props
    this.splitterSizeCookie = `TEMPLATE-EDITOR-SPLITTER-SIZE-${type.toUpperCase()}`
    this.beforeUnloadFunc = (event => {
      if (this.isDirty) {
        event.preventDefault()
        event.returnValue = this.isDirty
      }
    }).bind(this)
    window.addEventListener('beforeunload', this.beforeUnloadFunc)
  }

  componentDidMount() {
    if (!this.renderedPortals) {
      setTimeout(() => {
        this.forceUpdate()
      }, 0)
    }
    window.addEventListener('resize', this.layoutEditors.bind(this))
  }

  componentWillUnmount() {
    const {
      history: { location },
      updateFormState,
      savedFormData
    } = this.props
    const { controlData } = this.state
    // persist user selections if they click Add connection
    if (location.search === '?createCluster') {
      updateFormState(controlData)
    } else {
      savedFormData && updateFormState(null)
    }
    window.removeEventListener('beforeunload', this.beforeUnloadFunc)
  }

  setSplitPaneRef = splitPane => (this.splitPane = splitPane);

  handleSplitterDefault = () => {
    const cookie = localStorage.getItem(this.splitterSizeCookie)
    let size = cookie ? parseInt(cookie, 10) : 1000
    const page = document.getElementById('page')
    if (page) {
      const width = page.getBoundingClientRect().width
      if (!cookie) {
        size = width / 2
        localStorage.setItem(this.splitterSizeCookie, size)
      } else if (size > width * 7 / 10) {
        size = width * 7 / 10
      }
    }
    return size
  };

  handleSplitterChange = size => {
    localStorage.setItem(this.splitterSizeCookie, size)
    this.layoutEditors()
  };

  setContainerRef = container => {
    this.containerRef = container
    this.layoutEditors()
  };

  render() {
    const { locale } = this.props
    const { isLoaded, isFailed, showEditor, resetInx } = this.state
    if (!showEditor) {
      this.editors = []
    }

    if (isLoaded && isFailed) {
      return (
        <Notification
          title=""
          className="overview-notification"
          kind="error"
          subtitle={msgs.get('overview.error.default', locale)}
        />
      )
    }
    const viewClasses = classNames({
      'creation-view': true,
      showEditor
    })
    return (
      <div
        key={`key${resetInx}`}
        className={viewClasses}
        ref={this.setContainerRef}
      >
        <Prompt
          when={this.isDirty}
          message={msgs.get('changes.maybe.lost', locale)} />
        {this.renderEditButton(isLoaded)}
        {this.renderCreateButton(isLoaded)}
        {this.renderCancelButton()}
        {this.renderSplitEditor(isLoaded)}
      </div>
    )
  }

  renderSplitEditor(isLoaded) {
    const { showEditor } = this.state
    const editorClasses = classNames({
      'creation-view-split-container': true,
      showEditor
    })
    let maxSize
    const page = document.getElementById('page')
    if (page) {
      maxSize = page.getBoundingClientRect().width * 8 / 10
    }
    return (
      <div className={editorClasses}>
        {showEditor ? (
          <SplitPane
            split="vertical"
            minSize={50}
            maxSize={maxSize}
            ref={this.setSplitPaneRef}
            defaultSize={this.handleSplitterDefault()}
            onChange={this.handleSplitterChange}
          >
            {this.renderControls(isLoaded)}
            {this.renderEditor()}
          </SplitPane>
        ) : (
          this.renderControls(isLoaded)
        )}
      </div>
    )
  }

  renderControls(isLoaded) {
    const { controlData, showEditor, isCustomName, notifications } = this.state
    const {
      controlData: originalControlData,
      fetchControl = {},
      locale
    } = this.props
    const { fetchData } = fetchControl
    return (
      <ControlPanel
        handleControlChange={this.handleControlChange}
        handleNewEditorMode={this.handleNewEditorMode}
        handleGroupChange={this.handleGroupChange}
        controlData={controlData||originalControlData}
        fetchData={fetchData}
        originalControlData={originalControlData}
        notifications={notifications}
        showEditor={showEditor}
        isCustomName={isCustomName}
        isLoaded={isLoaded}
        locale={locale}
      />
    )
  }

  handleControlChange(control, controlData, creationView, isCustomName) {
    const { locale } = this.props
    const {
      template,
      templateYAML,
      otherYAMLTabs,
      firstTemplateYAML,
      editStack,
      isFinalValidate
    } = this.state

    // if custom editing on a tab, clear it now that user is using controls
    otherYAMLTabs.forEach(tab => {
      delete tab.control.customYAML
    })

    // custom action when control is selected
    const { onSelect } = control
    if (typeof onSelect === 'function') {
      onSelect()
    }

    const { templateYAML: newYAML, templateObject } = generateSource(
      template,
      editStack,
      controlData,
      otherYAMLTabs
    )
    validateControls(
      this.editors,
      newYAML,
      otherYAMLTabs,
      controlData,
      isFinalValidate,
      locale
    )
    highlightAllChanges(
      this.editors,
      templateYAML,
      newYAML,
      otherYAMLTabs,
      this.selectedTab
    )
    const notifications = controlData.filter(c => {
      return !!c.exception && isFinalValidate
    })
    this.setState({
      controlData,
      isCustomName,
      templateYAML: newYAML,
      templateObject,
      exceptions: [],
      notifications
    })
    this.isDirty = firstTemplateYAML !==newYAML
    this.handleScrollAndCollapse(control, controlData, creationView)
  }

  handleGroupChange(control, controlData, creationView, inx) {
    const { locale } = this.props
    const {
      showEditor,
      forceUpdate,
      template,
      templateYAML,
      otherYAMLTabs,
      firstTemplateYAML,
      editStack,
      isFinalValidate
    } = this.state
    const { active, controlData: cd } = control
    if (inx === undefined) {
      // add new group
      const { prompts: { nameId, baseName } } = control
      const newGroup = initializeControls(
        cd,
        controlData,
        forceUpdate,
        locale,
        active.length + 1,
        true
      )
      active.push(newGroup)
      const nameControl = _.keyBy(newGroup, 'id')[nameId]
      nameControl.active = `${baseName}-${active.length - 1}`

      // scroll down
      setTimeout(() => {
        (showEditor ? creationView : window).scrollBy({
          top: 260,
          left: 0,
          behavior: 'smooth'
        })
      }, 100)
    } else {
      active.splice(inx, 1)
    }
    const { templateYAML: newYAML, templateObject } = generateSource(
      template,
      editStack,
      controlData,
      otherYAMLTabs
    )
    validateControls(
      this.editors,
      newYAML,
      otherYAMLTabs,
      controlData,
      isFinalValidate,
      locale
    )
    highlightAllChanges(
      this.editors,
      templateYAML,
      newYAML,
      otherYAMLTabs,
      this.selectedTab
    )
    this.setState({
      controlData,
      templateYAML: newYAML,
      templateObject,
    })
    this.isDirty = firstTemplateYAML!==newYAML
  }

  handleNewEditorMode(control, controlData, creationView) {
    let { notifications } = this.state
    const {
      controlData: newControlData,
      template,
      templateYAML,
      templateObject,
      otherYAMLTabs
    } = this.changeEditorMode(control, controlData)
    controlData = newControlData

    delete control.exception
    if (notifications.length > 0) {
      notifications = controlData.filter(c => {
        return !!c.exception
      })
    }

    this.setState({
      controlData,
      template,
      templateYAML,
      templateObject,
      notifications,
      exceptions: [],
      otherYAMLTabs
    })

    this.handleScrollAndCollapse(control, controlData, creationView)
  }

  // change editor mode based on what card is selected
  changeEditorMode(control, controlData) {
    const { locale } = this.props
    let { template } = this.props
    const { editStack, otherYAMLTabs, forceUpdate } = this.state
    let { templateYAML, templateObject } = this.state
    let newYAML = templateYAML
    let newYAMLTabs = otherYAMLTabs

    // delete all controls below this card control
    const { availableMap, groupControlData } = control
    const parentControlData = groupControlData || controlData
    const insertInx = parentControlData.findIndex(
      ({ id }) => id === control.id
    )
    const deleteLen = parentControlData.length - insertInx - 1
    if (deleteLen) {
      parentControlData.splice(
        insertInx + 1,
        deleteLen
      )
    }

    // add new controls and template
    const { change } = availableMap[control.active[0]] || {}
    if (change) {
      const { replaceTemplate = template, insertControlData } = change

      // insert control data into main control data
      if (insertControlData) {
        // splice control data with data from this card
        parentControlData.splice(
          insertInx + 1,
          0,
          ..._.cloneDeep(insertControlData)
        )

        // if this card control is in a group, tell each control
        // what group control it belongs to
        if (groupControlData) {
          parentControlData.forEach(cd => {
            cd.groupControlData = groupControlData
          })
        }
        controlData = initializeControls(controlData, controlData, forceUpdate, locale)
      }

      // replace template and regenerate templateYAML and highlight diffs
      if (replaceTemplate) {
        template = replaceTemplate
        newYAMLTabs = newYAMLTabs || [];
        ({ templateYAML: newYAML, templateObject } = generateSource(
          template,
          editStack,
          controlData,
          newYAMLTabs
        ))
        highlightAllChanges(
          this.editors,
          templateYAML,
          newYAML,
          otherYAMLTabs,
          this.selectedTab
        )
        templateYAML = newYAML
      }
    }
    return {
      controlData,
      template,
      templateYAML,
      templateObject,
      otherYAMLTabs
    }
  }

  handleScrollAndCollapse(control, controlData, creationView) {
    const { showEditor, previouslySelectedCards } = this.state
    // user chose a card with new controls in it---scroll the view down to the new fields
    const {
      id,
      ref,
      groupNum = 0,
      scrollViewAfterSelection,
      collapseAboveAfterSelection,
      scrollViewToTopOnSelect
    } = control
    if (
      scrollViewAfterSelection ||
      collapseAboveAfterSelection ||
      scrollViewToTopOnSelect
    ) {
      const wasPreviouslySelected = previouslySelectedCards.includes(
        id + groupNum
      )
      if (!wasPreviouslySelected) {
        const scrollView = showEditor ? creationView : window
        const controlTop = ref.getBoundingClientRect().top
        const panelTop = showEditor
          ? creationView.getBoundingClientRect().top
          : 200
        setTimeout(() => {
          switch (true) {
          // collapse section above when this control is selected
          case collapseAboveAfterSelection === true:
            controlData.some(({ id: tid, sectionRef, sectionTitleRef }) => {
              if (sectionRef && sectionTitleRef) {
                sectionRef.classList.toggle('collapsed', true)
                sectionTitleRef.classList.toggle('collapsed', true)
              }
              return id === tid
            })
            setTimeout(() => {
              scrollView.scrollTo({
                top: 0,
                left: 0
              })
            }, 100)
            break

            // scroll view down after control is selected by 'scrollViewAfterSelection' pixels
          case scrollViewAfterSelection !== undefined:
            scrollView.scrollBy({
              top: scrollViewAfterSelection,
              left: 0,
              behavior: 'smooth'
            })
            break

            // scroll control to top when cards have been collapsed (only one card shown)
          case scrollViewToTopOnSelect !== undefined:
            scrollView.scrollBy({
              top: controlTop - panelTop,
              left: 0,
              behavior: 'smooth'
            })
            break
          }
        }, 100)
        previouslySelectedCards.push(id + groupNum)
      }
    }
    this.setState({ previouslySelectedCards })
  }

  renderEditor() {
    const { locale, type = 'unknown', title } = this.props
    const {
      hasUndo,
      hasRedo,
      exceptions,
      updateMessage,
      updateMsgKind,
      otherYAMLTabs
    } = this.state
    return (
      <div className="creation-view-yaml">
        <EditorHeader
          otherYAMLTabs={otherYAMLTabs}
          handleTabChange={this.handleTabChange}
          type={type}
          locale={locale}
        >
          <EditorBar
            title={title}
            type={type}
            hasUndo={hasUndo}
            hasRedo={hasRedo}
            exceptions={exceptions}
            gotoEditorLine={this.gotoEditorLine}
            handleEditorCommand={this.handleEditorCommand}
            handleSearchChange={this.handleSearchChange}
          />
        </EditorHeader>
        {updateMessage && (
          <div className="creation-view-yaml-notification">
            <InlineNotification
              key={updateMessage}
              kind={updateMsgKind}
              title={
                updateMsgKind === 'error'
                  ? msgs.get(`error.create.${type}`, locale)
                  : msgs.get(`success.create.${type}.check`, locale)
              }
              iconDescription=""
              subtitle={updateMessage}
              onCloseButtonClick={this.handleUpdateMessageClosed}
            />
          </div>
        )}
        {this.renderEditors()}
      </div>
    )
  }

  renderEditors = () => {
    const { activeYAMLEditor, otherYAMLTabs, templateYAML } = this.state
    return (
      <React.Fragment>
        <YamlEditor
          key={'main'}
          hide={activeYAMLEditor !== 0}
          width={'100%'}
          height={'100%'}
          wrapEnabled={true}
          setEditor={this.addEditor}
          onYamlChange={this.handleEditorChange}
          yaml={templateYAML}
        />
        {otherYAMLTabs.map(({ id, templateYAML: yaml }, inx) => {
          return (
            <YamlEditor
              id={id}
              key={id}
              hide={activeYAMLEditor !== inx + 1}
              width={'100%'}
              height={'100%'}
              wrapEnabled={true}
              setEditor={this.addEditor}
              onYamlChange={this.handleEditorChange}
              yaml={yaml}
            />
          )
        })}
      </React.Fragment>
    )
  };

  handleTabChange = tabInx => {
    this.selectedTab = tabInx
    this.setState({ activeYAMLEditor: tabInx })
    this.layoutEditors()
  };

  addEditor = editor => {
    const { otherYAMLTabs } = this.state
    this.editors.push(editor)
    if (this.editors.length > 1) {
      otherYAMLTabs[this.editors.length - 2].editor = editor
    }
    this.layoutEditors()

    editor.onDidChangeModelContent(() => {
      const model = editor.getModel()
      const hasUndo = model.canUndo()
      const hasRedo = model.canRedo()
      this.setState({ hasUndo, hasRedo })
    })
  };

  layoutEditors() {
    if (this.containerRef && this.editors.length > 0) {
      const { otherYAMLTabs } = this.state
      const hasTabs = otherYAMLTabs.length > 0
      const controlsSize = this.handleSplitterDefault()
      const rect = this.containerRef.getBoundingClientRect()
      const width = rect.width - controlsSize - 16
      const height = rect.height - (hasTabs ? 80 : 40)
      this.editors.forEach(editor => {
        editor.layout({ width, height })
      })
    }
  }

  gotoEditorLine(line) {
    const { activeYAMLEditor } = this.state
    const editor = this.editors[activeYAMLEditor]
    editor.revealLineInCenter(line)
  }

  // text editor commands
  handleEditorCommand(command) {
    const { activeYAMLEditor } = this.state
    const editor = this.editors[activeYAMLEditor]
    switch (command) {
    case 'next':
    case 'previous':
      if (this.selectionIndex !== -1) {
        if (this.selections && this.selections.length > 1) {
          switch (command) {
          case 'next':
            this.selectionIndex++
            if (this.selectionIndex >= this.selections.length) {
              this.selectionIndex = 0
            }
            break
          case 'previous':
            this.selectionIndex--
            if (this.selectionIndex < 0) {
              this.selectionIndex = this.selections.length - 1
            }
            break
          }
          editor.revealLineInCenter(
            this.selections[this.selectionIndex].selectionStartLineNumber,
            0
          )
        }
      }
      break
    case 'undo':
      if (editor) {
        editor.trigger('api', 'undo')
      }
      break
    case 'redo':
      if (editor) {
        editor.trigger('api', 'redo')
      }
      break
    case 'restore':
      this.resetEditor()
      break
    case 'close':
      this.closeEdit()
      break
    }
    return command
  }

  closeEdit() {
    localStorage.removeItem(TEMPLATE_EDITOR_OPEN_COOKIE)
    this.setState({ showEditor: false })
  }

  handleSearchChange(searchName) {
    const { activeYAMLEditor } = this.state
    const editor = this.editors[activeYAMLEditor]
    if (searchName.length > 1 || this.nameSearchMode) {
      if (searchName) {
        const found = editor.getModel().findMatches(searchName)
        if (found.length > 0) {
          this.selections = found.map(({ range }) => {
            const {
              endColumn,
              endLineNumber,
              startColumn,
              startLineNumber
            } = range
            return {
              positionColumn: endColumn,
              positionLineNumber: endLineNumber,
              selectionStartColumn: startColumn,
              selectionStartLineNumber: startLineNumber
            }
          })
          editor.setSelections(this.selections)
          editor.revealLineInCenter(
            this.selections[0].selectionStartLineNumber,
            0
          )
          this.selectionIndex = 1
        } else {
          this.selections = null
          this.selectionIndex = -1
        }
      } else {
        this.selections = null
        this.selectionIndex = -1
      }
      this.nameSearch = searchName
      this.nameSearchMode = searchName.length > 0
    }
  }

  handleEditorChange = yaml => {
    this.parseDebounced(yaml)
  };

  handleParse = yaml => {
    const { locale } = this.props
    const {
      otherYAMLTabs,
      activeYAMLEditor,
      controlData,
      firstTemplateYAML,
      editStack,
      isFinalValidate
    } = this.state
    let { templateYAML, notifications } = this.state

    if (activeYAMLEditor === 0) {
      templateYAML = yaml
    } else {
      const tab = otherYAMLTabs[activeYAMLEditor - 1]
      // protect user edits from being clobbered by form updates
      tab.control.customYAML = yaml
      // update the yaml shown in this tab
      tab.templateYAML = yaml
    }

    // update controls with values typed into yaml
    const { templateExceptionMap, hasSyntaxExceptions } = validateControls(
      this.editors,
      templateYAML,
      otherYAMLTabs,
      controlData,
      isFinalValidate,
      locale
    )
    if (notifications.length > 0) {
      notifications = []
      if (hasSyntaxExceptions) {
        Object.values(templateExceptionMap).forEach(({ exceptions }) => {
          exceptions.forEach(({ row, text, editor, tabInx }) => {
            notifications.push({
              id: 'error',
              kind: 'error',
              exception: msgs.get('error.create.syntax', [text], locale),
              row,
              editor,
              tabInx
            })
          })
        })
      } else {
        notifications = controlData.filter(control => {
          return !!control.exception
        })
      }
    }

    this.isDirty = firstTemplateYAML !== yaml

    // if typing on another tab that represents encoded yaml in the main tab,
    // update the main yaml--for now
    if (activeYAMLEditor !== 0) {
      const { template, templateYAML: oldYAML } = this.state
      const { templateYAML: newYAML, templateObject } = generateSource(
        template,
        editStack,
        controlData,
        otherYAMLTabs
      )
      highlightChanges(this.editors[0], oldYAML, newYAML)
      this.setState({
        controlData,
        notifications,
        templateYAML: newYAML,
        templateObject
      })
    } else {
      this.setState({ controlData, notifications, templateYAML })
    }
    return templateYAML // for jest test
  };

  handleUpdateMessageClosed = () => this.setState({ updateMessage: '' });

  getResourceJSON() {
    const { locale } = this.context
    const { template, editStack, controlData, otherYAMLTabs } = this.state
    let canCreate = false
    const { templateYAML } = generateSource(
      template,
      editStack,
      controlData,
      otherYAMLTabs,
      true
    )
    const {
      templateObjectMap,
      templateExceptionMap,
      hasSyntaxExceptions,
      hasValidationExceptions
    } = validateControls(
      this.editors,
      templateYAML,
      otherYAMLTabs,
      controlData,
      true,
      locale
    )
    let notifications = []
    if (hasSyntaxExceptions || hasValidationExceptions) {
      Object.values(templateExceptionMap).forEach(({ exceptions }) => {
        exceptions.forEach(({ row, text, editor, tabInx, controlId, ref }) => {
          notifications.push({
            id: 'error',
            kind: 'error',
            exception: msgs.get('error.create.syntax', [text], locale),
            row,
            editor,
            tabInx,
            controlId,
            ref
          })
        })
      })
    } else {
      notifications = controlData.filter(control => {
        return !!control.exception
      })
    }
    canCreate = notifications.length === 0

    this.setState({
      notifications,
      /* eslint-disable-next-line react/no-unused-state */
      hasFormExceptions: !canCreate,
      isFinalValidate: true
    })
    this.isDirty = false
    this.scrollControlPaneToTop()

    if (canCreate) {
      // cache user data
      cacheUserData(controlData)

      // create payload
      const payload = []
      Object.entries(templateObjectMap['<<main>>']).forEach(([, values]) => {
        values.forEach(({ $raw }) => {
          if ($raw) {
            payload.push($raw)
          }
        })
      })
      return payload
    }
    return null
  }

  scrollControlPaneToTop = () => {
    setTimeout(() => {
      if (this.containerRef) {
        const notifications = this.containerRef.getElementsByClassName(
          'notification'
        )
        if (notifications && notifications.length) {
          notifications[0].scrollIntoView({ behavior: 'smooth', block: 'end' })
        }
      }
    }, 0)
  };

  renderEditButton(isLoaded) {
    const { portals = {}, locale } = this.props
    const { editBtn } = portals
    if (editBtn && isLoaded) {
      const portal = document.getElementById(editBtn)
      if (portal) {
        const { showEditor } = this.state
        const handleToggle = () => {
          if (showEditor) {
            localStorage.removeItem(TEMPLATE_EDITOR_OPEN_COOKIE)
          } else {
            localStorage.setItem(TEMPLATE_EDITOR_OPEN_COOKIE, 'true')
          }
          this.setState({ showEditor: !showEditor })
        }
        this.renderedPortals = true
        return ReactDOM.createPortal(
          <div className="edit-template-switch">
            <ToggleSmall
              id="edit-yaml"
              key={`is${showEditor}`}
              ariaLabel={msgs.get('edit.yaml.on', locale)}
              defaultToggled={showEditor}
              onChange={() => {}}
              onToggle={handleToggle}
            />
            <div className="switch-label">
              {showEditor
                ? msgs.get('edit.yaml.on', locale)
                : msgs.get('edit.yaml.off', locale)}
            </div>
          </div>,
          portal
        )
      }
    }
    return null
  }

  renderCreateButton(isLoaded) {
    const { isEditing } = this.state
    const { portals = {}, createControl, locale } = this.props
    const { createBtn } = portals
    if (createControl && createBtn && isLoaded) {
      const { hasPermissions = true } = createControl
      const titleText = !hasPermissions
        ? msgs.get('button.save.access.denied', locale)
        : undefined
      let disableButton = true
      if (this.isDirty && hasPermissions) {
        disableButton = false
      }
      const portal = document.getElementById(createBtn)
      const label = isEditing ? msgs.get('button.update', locale) :
        msgs.get('button.create', locale)
      const button = (
        <Button
          id={createBtn}
          onClick={this.handleCreateResource.bind(this)}
          kind={'primary'}
          disabled={disableButton}
        >
          {label}
        </Button>
      )
      if (portal) {
        return !hasPermissions
          ? ReactDOM.createPortal(
            <TooltipContainer tooltip={titleText} isDisabled={!hasPermissions}>
              {button}
            </TooltipContainer>,
            portal
          )
          : ReactDOM.createPortal(button, portal)
      }
    }
    return null
  }

  handleCreateResource() {
    const { createControl } = this.props
    const { createResource } = createControl
    const resourceJSON = this.getResourceJSON()
    if (resourceJSON) {
      createResource(resourceJSON)
    }
  }

  renderCancelButton() {
    const { portals = {}, createControl, locale } = this.props
    const { cancelBtn } = portals
    if (createControl && cancelBtn) {
      const portal = document.getElementById(cancelBtn)
      if (portal) {
        const { cancelCreate } = createControl
        return ReactDOM.createPortal(
          <Button id={cancelBtn} onClick={cancelCreate} kind={'secondary'}>
            {msgs.get('button.cancel', locale)}
          </Button>,
          portal
        )
      }
    }
    return null
  }

  resetEditor() {
    const { template, controlData: initialControlData, locale } = this.props
    const { editStack, resetInx } = this.state
    const cd = _.cloneDeep(initialControlData)
    const controlData = initializeControls(
      cd,
      cd,
      this.forceUpdate,
      locale
    )
    const otherYAMLTabs = []
    const { templateYAML, templateObject } = generateSource(
      template,
      editStack,
      controlData,
      otherYAMLTabs
    )
    this.setState({
      isCustomName: false,
      template: this.props.template,
      controlData,
      activeYAMLEditor: 0,
      exceptions: [],
      previouslySelectedCards: [],
      notifications: [],
      otherYAMLTabs,
      updateMessage: '',
      hasUndo: false,
      hasRedo: false,
      isFinalValidate: false,
      templateYAML,
      templateObject,
      resetInx: resetInx + 1
    })
    this.isDirty = false
    this.selectedTab = 0
    this.firstGoToLinePerformed = false
    this.editors = []
  }
}
