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

import jsYaml from 'js-yaml'
import YamlParser from '../components/YamlParser'
import msgs from '../../../../nls/platform.properties'
import IPCIDR from 'ip-cidr'
import { Address4, Address6 } from 'ip-address'
import _ from 'lodash'

const IP_ADDRESS_TESTER = {
  test: value => new Address4(value).isValid() || new Address6(value).isValid()
}

const getCIDRContextTexter = (cidrFieldKey, sourcePath) => {
  const { tabId, path } = sourcePath
  return (value, templateObjectMap, locale) => {
    if (!IP_ADDRESS_TESTER.test(value)) {
      return msgs.get('creation.ocp.cluster.valid.ip', locale)
    }
    const cidrString = _.get(templateObjectMap[tabId], path) || ''
    const cidr = new IPCIDR(cidrString.toString())
    if (cidr.isValid() && !cidr.contains(value)) {
      const cidrFieldName = msgs.get(cidrFieldKey)
      return msgs.get(
        'creation.ocp.cluster.valid.cidr.membership',
        [cidrFieldName, cidrString],
        locale
      )
    }
    return null
  }
}

const MACHINE_CIDR_CONTEXT_TESTER = getCIDRContextTexter(
  'creation.ocp.machine.cidr',
  {
    tabId: 'install-config',
    path: 'unknown[0].$synced.networking.$v.machineCIDR.$v'
  }
)

export const VALIDATE_IP = {
  tester: IP_ADDRESS_TESTER,
  notification: 'creation.ocp.cluster.valid.ip',
  required: true
}

export const VALIDATE_CIDR = {
  tester: {
    test: value => {
      const cidr = new IPCIDR(value)
      // Ensure CIDR is valid and results in more than one address
      return cidr.isValid() && cidr.start() !== cidr.end()
    }
  },
  notification: 'creation.ocp.cluster.valid.cidr',
  required: true
}

export const VALIDATE_URL = {
  tester: {
    test: value => {
      try {
        new URL(value)
      } catch (_) {
        return false
      }
      return true
    }
  },
  notification: 'creation.invalid.url',
  required: true,
}

export const VALIDATE_IP_AGAINST_MACHINE_CIDR = {
  contextTester: MACHINE_CIDR_CONTEXT_TESTER,
  required: true
}

export const VALIDATE_IP_AGAINST_MACHINE_CIDR_OPTIONAL = {
  contextTester: MACHINE_CIDR_CONTEXT_TESTER,
  required: false
}

export const VALIDATE_USER_AND_IP = {
  tester: new RegExp(
    '^[-.0-9a-z]+@(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5]).){3,4}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])(:[0-9]+)*$'
  ),
  notification: 'creation.ocp.cluster.valid.user.ip',
  required: true
}

export const VALIDATE_MAC_ADDRESS = {
  tester: new RegExp('^([0-9a-fA-F]{2}[:-]){5}([0-9a-fA-F]{2})$'),
  notification: 'creation.ocp.cluster.valid.mac',
  required: true
}

export const VALIDATE_ALPHANUMERIC = {
  tester: new RegExp('^[A-Za-z0-9-_]+$'),
  notification: 'creation.ocp.cluster.valid.alphanumeric',
  required: false
}

export const VALIDATE_NUMERIC = {
  tester: new RegExp('^[0-9]+$'),
  notification: 'creation.ocp.cluster.valid.numeric',
  required: true
}

export const ControlMode = Object.freeze({
  TABLE_ONLY: 'TABLE_ONLY',
  PROMPT_ONLY: 'PROMPT_ONLY'
})

export const initializeControlData = (
  initialControlData,
  locale,
  groupNum,
  inGroup
) => {
  const parentControlData = initialControlData.map(control => {
    const { type, controlData, groupCnt = 1 } = control
    switch (type) {
    case 'group': {
      let active = control.active
      if (!active) {
        active = control.active = []
      }
      while (active.length < groupCnt) {
        active.push(
          initializeControlData(controlData, locale, active.length + 1, true)
        )
      }
      return control
    }
    default:
      return initialControl(control, locale, groupNum)
    }
  })

  // if any card controls, set this as parent control data
  if (inGroup) {
    parentControlData.forEach(c=>{
      if (c.type==='cards') {
        c.groupNum = groupNum
        c.groupControlData = parentControlData
      }
    })
  }
  return parentControlData
}

const initialControl = (control, locale, groupNum) => {
  const { type, active, available = [], multiselect, isInitialized } = control
  if (!isInitialized) {
    control = Object.assign({}, control)

    // if checkbox, convert active from an item name to a boolean
    if (type === 'checkbox') {
      control.active = available.indexOf(active) > 0
    }
    if (typeof control.active === 'boolean') {
      control.initialActive = control.active
    } else {
      control.initialActive = control.active || ''
    }
    if (type === 'number') {
      control.active = control.initial
    }

    // if user data was cached, apply now
    // save custom user input for session??
    if (control.cacheUserValueKey) {
      const storageKey = `${control.cacheUserValueKey}--${
        window.location.href
      }`
      const sessionObject = JSON.parse(sessionStorage.getItem(storageKey))
      if (sessionObject) {
        control.userData = sessionObject
      }
    }

    // convert message keys
    convertMsgs(control, locale, groupNum)

    // if available choices are objects, convert to keys
    // required for label lists, multiselect, cards
    let sortAvailableChoices = true
    let sortLabelsByName = false
    let availableMap = {}

    if (
      type !== 'table' &&
      type !== 'treeselect' &&
      typeof _.get(control, 'available[0]') === 'object'
    ) {
      const { available, sort = true } = control
      availableMap = control.availableMap = {}
      sortAvailableChoices = sort
      control.available = available.map(choice => {
        let availableKey
        const {
          id,
          key,
          value,
          name,
          description,
          replacements,
          change = {}
        } = choice
        // label choices
        if (key && value) {
          availableKey = `${key}: "${value}"`
          sortLabelsByName = control.hasKeyLabels = true
        } else if (value && description) {
          availableKey = `${value} - ${description}`
          sortLabelsByName = control.hasValueDescription = true
          choice = choice.value
        } else if (name && description) {
          // multiselect choices
          availableKey = `${name} - ${description}`
          control.hasReplacements = true
        } else if (id) {
          // card choices
          availableKey = id
          const replaces = replacements || change.replacements
          control.hasReplacements = control.hasReplacements || !!replaces
          if (control.hasReplacements) {
            choice.replacements = replaces
          }
          control.newEditorMode =
            change.insertControlData && type === 'cards' && !multiselect
        }
        control.availableMap[availableKey] = choice
        return availableKey
      })
      if (sortAvailableChoices) {
        control.available = control.available.sort((a, b) => {
          switch (type) {
          case 'cards':
            a = availableMap[a].title || a
            b = availableMap[b].title || b
            break
          }
          if (sortLabelsByName) {
            const aw = a.startsWith('name')
            const bw = b.startsWith('name')
            if (aw && !bw) {
              return 1
            } else if (!aw && bw) {
              return -1
            }
          }
          return a.localeCompare(b)
        })
      }
    }

    // connect controls to source for updates/validation
    const { validation, multiline } = control
    if (validation) {
      let { constraint } = validation
      if (constraint) {
        if (multiline) {
          validation.tester = new RegExp(constraint)
        } else {
          if (!constraint.startsWith('^')) {
            constraint = '^' + constraint
          }
          if (!constraint.endsWith('$')) {
            constraint = constraint + '$'
          }
          validation.tester = new RegExp(constraint)
        }
      } else if (validation.json) {
        validation.tester = {
          test: function(value) {
            try {
              JSON.parse(value)
              return true
            } catch (e) {
              return false
            }
          }
        }
      }
    }
    control.isInitialized = true
  }
  return control
}

const convertMsgs = (control, locale, groupNum) => {
  const { type, controlData, available } = control
  const keys = [
    'name',
    'description',
    'placeholder',
    'title',
    'subtitle',
    'prompt',
    'info',
    'tooltip'
  ]
  keys.forEach(key => {
    if (control[key]) {
      control[key] = groupNum
        ? msgs.get(control[key], [groupNum], locale)
        : msgs.get(control[key], locale)
    }
  })
  const properties = ['available', 'active']
  properties.forEach(prop => {
    const values = _.get(control, prop)
    if (Array.isArray(values)) {
      values.forEach(item => {
        keys.forEach(key => {
          if (item[key] && item[key].split('.').length > 2) {
            item[key] = msgs.get(item[key], locale)
          }
        })
      })
    }
  })

  // if table convert the controlData in that
  if (type === 'table' && controlData) {
    controlData.forEach(ctrl => {
      if (!ctrl.isInitialized) {
        convertMsgs(ctrl, locale, groupNum)
        ctrl.isInitialized = true
      }
    })
  }

  // if cards convert the data in that
  if (type === 'cards' && available) {
    available.forEach(({ change = {} }) => {
      if (change.insertControlData) {
        change.insertControlData.forEach(ctrl => {
          if (!ctrl.isInitialized) {
            convertMsgs(ctrl, locale, groupNum)
            ctrl.isInitialized = true
          }
        })
      }
    })
  }
}

// don't save user data until they create
export const cacheUserData = controlData => {
  controlData.forEach(control => {
    if (
      control.cacheUserValueKey &&
      control.userData &&
      control.userData.length > 0
    ) {
      const storageKey = `${control.cacheUserValueKey}--${
        window.location.href
      }`
      sessionStorage.setItem(storageKey, JSON.stringify(control.userData))
    }
  })
}

//looks for ## at end of a YAML line
export function hitchControlsToYAML(yaml, otherYAMLTabs = [], controlData) {
  const { parsed } = parseYAML(yaml)

  // get controlMap
  const controlMap = {}
  controlData.forEach(control => {
    const { id, type, active = [] } = control
    controlMap[id] = control

    switch (type) {
    case 'group':
      // each group gets an array of control data maps, one per group
      control.controlMapArr = []
      active.forEach(cd => {
        const cdm = {}
        control.controlMapArr.push(cdm)
        cd.forEach(c => {
          cdm[c.id] = c
        })
      })
      break

    case 'table':
      // each table cell has its own source path
      control.sourcePath = { paths: [] }
      break
    }
  })

  otherYAMLTabs.forEach(tab => {
    const { id: tabId, templateYAML } = tab
    const { parsed: tabParsed } = parseYAML(templateYAML)
    syncControlData(tabParsed, controlData, controlMap, tabId)
    tab.templateYAML = templateYAML.replace(/\s*##.+$/gm, '') // remove source markers
  })
  syncControlData(parsed, controlData, controlMap, '<<main>>')
  return yaml.replace(/\s*##.+$/gm, '') // remove source markers
}

//point control to what template value it changes
//looks for ##controlId in template
const syncControlData = (parsed, controlData, controlMap, tabId) => {
  Object.entries(parsed).forEach(([key, value]) => {
    value.forEach(({ $synced }, inx) => {
      syncControls($synced, `${key}[${inx}].$synced`, controlMap, tabId)
    })
  })
}

const syncControls = (object, path, controlMap, tabId) => {
  if (object) {
    if (object.$cmt) {
      // comment links in groups/tables have the format ##groupId.inx.controlId
      // ties into controlMap created above
      const [controlKey, inx, dataKey] = object.$cmt.split('.')
      let control = controlMap[controlKey]
      if (control) {
        const { type, controlMapArr } = control
        if (type !== 'table') {
          if (inx) {
            const cdm = controlMapArr[inx]
            if (cdm) {
              control = cdm[dataKey]
            }
          }
          control.sourcePath = { tabId, path }
        } else if (inx) {
          control.sourcePath.tabId = tabId
          let pathMap = control.sourcePath.paths[inx]
          if (!pathMap) {
            pathMap = control.sourcePath.paths[inx] = {}
          }
          pathMap[dataKey] = path
        }
      }
    }
    let o, p
    object = object.$v !== undefined ? object.$v : object
    if (Array.isArray(object)) {
      for (var i = 0; i < object.length; i++) {
        o = object[i]
        if (o.$v !== undefined) {
          p = `${path}[${i}].$v`
          syncControls(o, p, controlMap, tabId)
        }
      }
    } else if (object && typeof object === 'object') {
      Object.keys(object).forEach(key => {
        o = object[key]
        if (o.$v !== undefined) {
          if (key.includes('.')) {
            p = `${path}['${key}'].$v`
          } else {
            p = `${path}.${key}.$v`
          }
          syncControls(o, p, controlMap, tabId)
        }
      })
    }
  }
}

export function updateControls(
  editors,
  templateYAML,
  otherYAMLTabs = [],
  controlData,
  isFinalValidate,
  locale
) {
  // parse all yamls
  let { parsed, exceptions } = parseYAML(templateYAML)
  const templateObjectMap = { '<<main>>': parsed }
  const templateExceptionMap = {
    '<<main>>': {
      editor: editors[0],
      exceptions: attachEditorToExceptions(exceptions, editors, 0)
    }
  }
  otherYAMLTabs.forEach(({ id, templateYAML }, inx) => {
    ({ parsed, exceptions } = parseYAML(templateYAML))
    templateObjectMap[id] = parsed
    templateExceptionMap[id] = {
      editor: editors[inx + 1],
      exceptions: attachEditorToExceptions(exceptions, editors, inx + 1)
    }
  })

  // if any syntax errors, report them and leave
  let hasSyntaxExceptions = false
  Object.values(templateExceptionMap).forEach(({ exceptions }) => {
    if (exceptions.length > 0) {
      hasSyntaxExceptions = true
    }
  })

  // get values from parsed yamls using source paths and verify values are valid
  if (!hasSyntaxExceptions) {
    let stopValidating = false
    controlData.forEach(control => {
      const {
        type,
        active = [],
        pauseControlCreationHereUntilSelected
      } = control
      delete control.exception
      if (!stopValidating) {
        switch (type) {
        case 'group':
          updateGroupControl(
            active,
            templateObjectMap,
            templateExceptionMap,
            isFinalValidate,
            locale
          )
          break

        case 'table':
          control.exceptions = []
          updateTableControl(
            control,
            templateObjectMap,
            templateExceptionMap,
            isFinalValidate,
            locale
          )
          break

        default:
          updateControl(
            control,
            templateObjectMap,
            templateExceptionMap,
            isFinalValidate,
            locale
          )
          break
        }
      }
      if (pauseControlCreationHereUntilSelected) {
        stopValidating = !active
      }
    })
  }

  // update editors with any format exceptions
  let hasValidationExceptions = false
  Object.values(templateExceptionMap).forEach(({ editor, exceptions }, inx) => {
    setTimeout(() => {
      if (editor) {
        const decorationList = []
        exceptions.forEach(({ row, text }) => {
          decorationList.push({
            range: new editor.monaco.Range(row, 0, row, 132),
            options: {
              isWholeLine: true,
              glyphMarginClassName: 'errorDecoration',
              glyphMarginHoverMessage: { value: text },
              minimap: { color: 'red', position: 1 }
            }
          })
        })
        exceptions.forEach(({ row, column }) => {
          decorationList.push({
            range: new editor.monaco.Range(row, column - 6, row, column + 6),
            options: {
              className: 'squiggly-error'
            }
          })
        })
        editor.errorList = decorationList
        editor.decorations = editor.deltaDecorations(editor.decorations, [
          ...editor.errorList,
          ...(editor.changeList || [])
        ])
      }
    }, 0)
    if (exceptions.length > 0) {
      hasValidationExceptions = true
      attachEditorToExceptions(exceptions, editors, inx)
    }
  })
  return {
    templateObjectMap,
    templateExceptionMap,
    hasSyntaxExceptions,
    hasValidationExceptions
  }
}

const updateGroupControl = (
  group,
  templateObjectMap,
  templateExceptionMap,
  isFinalValidate,
  locale
) => {
  group.forEach(controlData => {
    controlData.forEach(control => {
      delete control.exception
      updateControl(
        control,
        templateObjectMap,
        templateExceptionMap,
        isFinalValidate,
        locale
      )
    })
  })
}

const updateTableControl = (
  table,
  templateObjectMap,
  templateExceptionMap,
  isFinalValidate,
  locale
) => {
  const {
    active: rows,
    controlData,
    sourcePath: { tabId = '<<main>>', paths },
    validation: { tester },
    exceptions
  } = table
  const controlDataMap = _.keyBy(controlData, 'id')
  let hidden = false
  rows.forEach((row, inx) => {
    const pathMap = paths[inx]
    Object.entries(row).forEach(([key, active]) => {
      if (
        controlDataMap[key] &&
        (typeof active !== 'string' || !active.trim().startsWith('#'))
      ) {
        const control = {
          ...controlDataMap[key],
          sourcePath: { tabId, path: pathMap ? pathMap[key] : '' },
          active
        }
        updateControl(
          control,
          templateObjectMap,
          templateExceptionMap,
          isFinalValidate,
          locale
        )
        row[key] = control.active
        const promptOnly = control.mode === ControlMode.PROMPT_ONLY
        if (control.exception) {
          // add exception to cell in table
          let exception = exceptions.find(
            ({ exception }) => exception === control.exception
          )
          if (!exception) {
            exception = {
              exception: control.exception,
              cells: []
            }
            exceptions.push(exception)
          }
          if (!promptOnly) {
            exception.cells.push(`${key}-${row.id}`)
          } else {
            hidden = true
          }
        }
      }
    })
  })
  if (exceptions.length > 0) {
    table.exception = msgs.get(
      `creation.ocp.validation.errors${hidden ? '.hidden' : ''}`,
      locale
    )
  } else if (typeof tester === 'function') {
    const exception = tester(rows)
    if (exception) {
      table.exception = msgs.get(exception, locale)
    }
  }
}

const updateControl = (
  control,
  templateObjectMap,
  templateExceptionMap,
  isFinalValidate,
  locale
) => {
  // if final validation before creating template, if this value is required, throw error
  const { type } = control
  if ((isFinalValidate || type === 'number') && control.validation) {
    const {
      name,
      active,
      validation: { required, notification },
      ref
    } = control
    if (required && (!active || (type === 'cards' && active.length === 0))) {
      const msg =
        !name || isNaN(active)
          ? notification
          : 'creation.ocp.cluster.missing.input'
      control.exception = msgs.get(msg, [name], locale)
      const { sourcePath } = control
      if (sourcePath) {
        const { tabId, path } = sourcePath
        const parsed = templateObjectMap[tabId]
        const { exceptions } = templateExceptionMap[tabId]
        const spath = splitPath(path)
        exceptions.push({
          row: getRow(spath, parsed),
          column: 0,
          text: control.exception,
          type: 'error',
          ref
        })
      }
      return
    }
  }

  if (shouldUpdateControl(control, templateObjectMap)) {
    const { type } = control
    switch (type) {
    case 'text':
    case 'textarea':
    case 'number':
    case 'combobox':
    case 'toggle':
    case 'hidden':
      updateTextControl(
        control,
        templateObjectMap,
        templateExceptionMap,
        isFinalValidate,
        locale
      )
      break
    case 'checkbox':
      updateCheckboxControl(
        control,
        templateObjectMap,
        templateExceptionMap,
        locale
      )
      break
    case 'cards':
      updateCardsControl(
        control,
        templateObjectMap,
        templateExceptionMap,
        locale
      )
      break
    case 'singleselect':
      updateSingleSelectControl(
        control,
        templateObjectMap,
        templateExceptionMap,
        locale
      )
      break
    case 'multiselect':
      updateMultiSelectControl(
        control,
        templateObjectMap,
        templateExceptionMap,
        locale
      )
      break
    case 'table':
      updateTableControl(
        control,
        templateObjectMap,
        templateExceptionMap,
        locale
      )
      break
    }
  }
}

const attachEditorToExceptions = (exceptions, editors, inx) => {
  return exceptions.map(exception => {
    exception.editor = editors[inx]
    exception.tabInx = inx
    return exception
  })
}

const shouldUpdateControl = (control, templateObjectMap) => {
  let required = false
  const { sourcePath, validation, active } = control
  if (sourcePath && validation) {
    ({ required } = validation)
    if (!required) {
      // if not required, only validate if that yaml path exists
      const { tabId, path } = sourcePath
      const parsed = templateObjectMap[tabId]
      return !!_.get(parsed, path) || !!active
    }
  }
  return required
}

const updateTextControl = (
  control,
  templateObjectMap,
  templateExceptionMap,
  isFinalValidate,
  locale
) => {
  const {
    id,
    name,
    sourcePath: { tabId, path },
    validation: { contextTester, tester, notification },
    template,
    ref
  } = control
  const parsed = templateObjectMap[tabId]
  let active = _.get(parsed, path)
  if (typeof active === 'number') {
    active = active.toString()
  }
  // ex: text input is in the form of a uri
  if (active && template) {
    const parts = template.split(`{{{${id}}}}`)
    active = active.replace(parts[0], '')
    if (parts.length > 1) {
      active = active.replace(new RegExp(parts[1] + '$'), '')
    }
  }
  control.active = active
  const { exceptions } = templateExceptionMap[tabId]
  const spath = splitPath(path)
  if (active === undefined) {
    addException(spath, parsed, exceptions, locale)
  } else if (active || isFinalValidate) {
    let exception
    if (active) {
      if (contextTester) {
        exception = contextTester(active, templateObjectMap, locale)
      } else if (tester && !tester.test(active)) {
        if (active.length > 50) {
          active = `${active.substr(0, 25)}...${active.substr(-25)}`
        }
        exception = msgs.get(notification, [active], locale)
      }
    } else {
      exception = msgs.get('validation.missing.value', [name], locale)
    }
    if (exception) {
      control.exception = exception
      exceptions.push({
        row: getRow(spath, parsed),
        column: 0,
        text: exception,
        type: 'error',
        ref
      })
    }
  }
  if (tester) {
    tester.lastIndex = 0
  }
}

const updateSingleSelectControl = (
  control,
  templateObjectMap,
  templateExceptionMap,
  locale
) => {
  const { available = [], sourcePath = {} } = control
  const { tabId = '<<main>>', path = '' } = sourcePath
  const parsed = templateObjectMap[tabId]
  const active = (control.active = _.get(parsed, path))
  const { exceptions } = templateExceptionMap[tabId]
  const spath = splitPath(path)
  if (!active) {
    addException(spath, parsed, exceptions, locale)
  } else if (
    available.findIndex(avail => active.indexOf(avail) !== -1) === -1
  ) {
    control.exception = msgs.get(
      'validation.bad.value',
      [active, _.get(control, 'available')],
      locale
    )
    exceptions.push({
      row: getRow(spath, parsed),
      column: 0,
      text: control.exception,
      type: 'error'
    })
  }
}

const updateCardsControl = (
  control,
  templateObjectMap,
  templateExceptionMap,
  locale
) => {
  const { active, validation: { required, notification } } = control
  if (required && !active) {
    control.exception = msgs.get(notification, locale)
  }
}

const updateCheckboxControl = (
  control,
  templateObjectMap,
  templateExceptionMap,
  locale
) => {
  const { available, sourcePath: { tabId, path } } = control
  const parsed = templateObjectMap[tabId]
  let active = _.get(parsed, path)
  const { exceptions } = templateExceptionMap[tabId]
  const spath = splitPath(path)
  if (!active) {
    addException(spath, parsed, exceptions, locale)
  }
  if (available.indexOf(active) === -1) {
    control.exception = msgs.get(
      'validation.bad.value',
      [getKey(spath), available.join(', ')],
      locale
    )
    exceptions.push({
      row: getRow(spath, parsed),
      column: 0,
      text: control.exception,
      type: 'error'
    })
  }
  if (typeof active == 'boolean') {
    active = available.indexOf(active.toString()) > 0
  } else {
    active = available.indexOf(active) > 0
  }
  control.active = active
}

const updateMultiSelectControl = (
  control,
  templateObjectMap,
  templateExceptionMap,
  locale
) => {
  const { hasKeyLabels, hasReplacements } = control
  if (hasKeyLabels) {
    updateMultiSelectLabelControl(
      control,
      templateObjectMap,
      templateExceptionMap,
      locale
    )
  } else if (hasReplacements) {
    updateMultiSelectReplacementControl(
      control,
      templateObjectMap,
      templateExceptionMap,
      locale
    )
  } else {
    updateMultiSelectStringControl(
      control,
      templateObjectMap,
      templateExceptionMap,
      locale
    )
  }
}

const updateMultiSelectStringControl = (
  control,
  templateObjectMap,
  templateExceptionMap,
  locale
) => {
  const { available, sourcePath: { tabId, path } } = control
  const parsed = templateObjectMap[tabId]
  let values = _.get(parsed, path)
  if (values) {
    if (typeof values === 'object') {
      values = values.map(({ $v }) => {
        return $v
      })
    } else if (typeof values === 'string') {
      values = values
        .split(',')
        .map(item => {
          return item.trim()
        })
        .filter(v => {
          return v !== ''
        })
    }
    const set = new Set(available)
    control.userData = values.filter(value => {
      return !set.has(value)
    })
  } else {
    values = []
  }
  control.active = values
  const { exceptions } = templateExceptionMap[tabId]
  if (values == null) {
    const spath = splitPath(path)
    addException(spath, parsed, exceptions, locale)
  }
}

const updateMultiSelectLabelControl = (
  control,
  templateObjectMap,
  templateExceptionMap,
  locale
) => {
  const { sourcePath: { tabId, path } } = control
  const parsed = templateObjectMap[tabId]
  const { exceptions } = templateExceptionMap[tabId]
  const selectors = []
  const userData = []
  const userMap = {}
  const { availableMap } = control
  const matchExpressions = _.get(parsed, path)
  if (matchExpressions instanceof Object) {
    matchExpressions.forEach(({ key, operator, values }) => {
      if (operator === 'In') {
        values.forEach(value => {
          const selection = `${key}: "${value}"`
          selectors.push(selection)
          if (!availableMap[selection]) {
            userMap[selection] = { key, value }
            userData.push(selection)
          }
        })
      }
    })
  }
  if (userData.length > 0) {
    control.userData = userData
    control.userMap = userMap
  }
  control.active = selectors

  if (!control.active) {
    const spath = splitPath(path)
    addException(spath, parsed, exceptions, locale)
  }
}

const updateMultiSelectReplacementControl = (
  control,
  templateObjectMap,
  templateExceptionMap,
  locale
) => {
  const { sourcePath: { tabId, path } } = control
  const parsed = templateObjectMap[tabId]
  const { exceptions } = templateExceptionMap[tabId]
  const hasOne = path.some(p => {
    return !!_.get(parsed, p)
  })
  if (!hasOne) {
    const spath = splitPath(path)
    addException(spath, parsed, exceptions, locale)
  }
}

const addException = (path, parsed, exceptions, locale) => {
  let exceptionAdded = false
  do {
    const lastPop = path.pop()
    if (!!_.get(parsed, path.join('.')) || path.length <= 1) {
      // create exception
      path.push(lastPop)
      const missingKey = getKey(path).replace(/^unknown\./, '')
      exceptions.push({
        row: getRow(path, parsed),
        column: 0,
        text: msgs.get('validation.missing.resource', [missingKey], locale),
        type: 'error'
      })
      exceptionAdded = true
    }
  } while (!exceptionAdded)
}

// split and join taking into account sss[.fff] in path
const splitPath = path => {
  return path.split(/\.(?![^[]*\])/)
}
const joinPath = path => {
  return path
    .map(s => {
      return s.indexOf('$v[') === -1 ? s.replace('[', '.$v[') : s
    })
    .join('.')
}

const getKey = path => {
  return path
    .join('.')
    .replace('.$synced', '')
    .replace('[0]', '')
    .replace(/\.\$v/g, '')
}

const getRow = (path, parsed) => {
  let synced
  if (path.length > 0) {
    const pathBase = path.shift()
    path = path.length > 0 ? pathBase + `.${joinPath(path)}` : pathBase
    path = splitPath(path)
    do {
      synced = _.get(parsed, path.join('.'))
      path.pop()
    } while (
      path.length > 0 &&
      (synced === undefined || synced === null || synced.$r === undefined)
    )
  }
  return synced ? synced.$r + 1 : 0
}

export const parseYAML = yaml => {
  let absLine = 0
  const parsed = {}
  const yamls = yaml.split(/^---$/gm)
  const exceptions = []
  // check for syntax errors
  try {
    yamls.forEach(snip => {
      const obj = jsYaml.safeLoad(snip)
      const key = _.get(obj, 'kind', 'unknown')
      let values = parsed[key]
      if (!values) {
        values = parsed[key] = []
      }
      const post = new RegExp(/[\r\n]+$/).test(snip)
      snip = snip.trim()
      const $synced = new YamlParser().parse(snip, absLine)
      $synced.$r = absLine
      $synced.$l = snip.split(/[\r\n]+/g).length
      values.push({ $raw: obj, $yml: snip, $synced })
      absLine += $synced.$l
      if (post) absLine++
    })
  } catch (e) {
    const { mark = {}, reason, message } = e
    const { line = 0, column = 0 } = mark
    exceptions.push({
      row: line + absLine,
      column,
      text: _.capitalize(reason || message),
      type: 'error'
    })
  }
  return { parsed, exceptions }
}
