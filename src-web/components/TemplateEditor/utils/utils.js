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
import { initializeControlData } from './initialize-control-data'
import { initializeControlFunctions } from './initialize-control-functions'
import { generateSourceFromResources } from './refresh-source-from-resources'
import { generateSourceFromTemplate } from './refresh-source-from-templates'

import _ from 'lodash'

export const ControlMode = Object.freeze({
  TABLE_ONLY: 'TABLE_ONLY',
  PROMPT_ONLY: 'PROMPT_ONLY'
})


export const initializeControls = (
  initialControlData,
  parentControlData,
  forceUpdate,
  locale,
  groupNum,
  inGroup
) => {
  const controlData = initializeControlData(
    initialControlData,
    locale,
    groupNum,
    inGroup
  )
  initializeControlFunctions(
    controlData,
    parentControlData,
    forceUpdate
  )
  return controlData
}

// from an edit resource, discover # of groups, card selections
export function discoverControls(
  controlData, templateObject, forceUpdate, locale
) {
  templateObject = _.cloneDeep(templateObject)
  const discoverControl = control => {
    const {
      discover
    } = control
    if (discover) {
      discover(control, controlData, templateObject, forceUpdate, locale)
    }
  }
  controlData.forEach(control => {
    discoverControl(control)
  })
}

// reverse control active valuess from template
export function reverseTemplate(
  controlData,
  templateObject
) {
  templateObject = _.cloneDeep(templateObject)
  const reverseControl = control => {
    const {
      type,
      active=[],
      reverse,
      shift
    } = control
    if (type === 'group') {
      active.forEach(group => {
        group.forEach(gcontrol => {
          reverseControl(gcontrol, templateObject)
        })
        shift(templateObject)
      })
    } else if (reverse) {
      reverse(control, templateObject)
    }
  }
  controlData.forEach(control => {
    reverseControl(control)
  })
}


export const generateSource = (template, editResources, controlData, otherYAMLTabs, isFinalGenerate)  => {
  if (editResources) {
    return generateSourceFromResources(editResources, controlData, otherYAMLTabs, isFinalGenerate)
  } else {
    return generateSourceFromTemplate(template, controlData, otherYAMLTabs, isFinalGenerate)
  }
}

export const parseYAML = yaml => {
  let absLine = 0
  const parsed = {}
  const resources=[]
  const exceptions = []
  const yamls = yaml.split(/^---$/gm)
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
      resources.push(obj)
      absLine += $synced.$l
      if (post) {
        absLine++
      }
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
  return { parsed, resources, exceptions }
}

export const getInsideObject = (ikey, parsed) => {
  const ret = {}
  Object.keys(parsed).forEach(key => {
    ret[key] = []
    _.get(parsed, `${key}`, []).forEach(obj => {
      ret[key].push(_.get(obj, `${ikey}`))
    })
  })
  return ret
}

//don't save user data until they create
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

export const getUniqueName = (name, nameSet) => {
  if (nameSet.has(name)) {
    let count = 1
    const baseName = name.replace(/-*\d+$/, '')
    do {
      name = `${baseName}-${count}`
      count++
    } while (nameSet.has(name))
  }
  return name
}

export const getSourcePath = (path) => {
  const sourcePath1 = path.split('["')
  const sourcePath2 = sourcePath1[0].split('.')
  const pathBase = sourcePath2.shift() + '.$synced'
  const sourcePath = sourcePath2.length > 0 ? pathBase + `.${sourcePath2.join('.$v.')}` : pathBase
  if (sourcePath1.length>1) {
    return `${sourcePath}.$v["${sourcePath1[1]}`
  }
  return sourcePath
}

export const removeVs = (object) => {
  if (object) {
    let o
    object = object.$v!==undefined ? object.$v : object
    if (Array.isArray(object)) {
      for (let i = 0; i < object.length; i++) {
        o = object[i]
        object[i] = o.$v!==undefined ? removeVs(o) : o
      }
    } else if (typeof object === 'object') {
      for (const key in object) {
        o = object[key]
        object[key] = o.$v!==undefined ? removeVs(o) : o
      }
    }
  }
  return object
}
