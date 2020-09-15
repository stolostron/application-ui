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
    forceUpdate
  )
  return controlData
}

// refresh controls from template
export function refreshControls(
  templateObject,
  templateResources,
  controlData
) {
  const refreshControl = control => {
    const {
      type,
      active=[],
      refresh
    } = control
    if (refresh) {
      refresh(templateObject, templateResources)
      if (type === 'group') {
        active.forEach(group => {
          group.forEach(gcontrol => {
            refreshControl(gcontrol, templateObject, templateResources)
          })
        })
      }
    }
  }
  controlData.forEach(control => {
    refreshControl(control)
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
  const sourcePath = path.split('.')
  const pathBase = sourcePath.shift() + '.$synced'
  return sourcePath.length > 0 ? pathBase + `.${sourcePath.join('.$v.')}` : pathBase
}