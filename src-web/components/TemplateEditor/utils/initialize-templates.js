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

import { parseYAML } from './source-utils'


export const initializeTemplateData = () => {//template, controlData) => {

//  A regex template {{{ID.a-z.a-z}}} with {{{ID}}}[a-z.a-z]
//
//  B loop thru control data
//
//  C if control doesn’t have controlData, add to markerData as  id: <<ID>>
//
//  E) if markerData not empty,
//
//    2 use handlebars func and markerData to get yaml template
//
//    3 replace << >> with {{{. ]}}
//
//      Yaml = yaml.replace(/<<(.+)>>/g, (a)=>{
//
//      return `{{{${a}}}}`
//
//    4 parse
//
//    5 flattenObject—see email
//
//    6 filter out any w/o {{{ }}}
//
//    7 _.inverseBy( ).  —- {{{ }}}: [a.b.c, f.y.t]
//
//    8 get ids from key and append to sourcePath on control:
//
//      sourcePaths: [ {[{ }}}: [paths] ]
//
//      if {{{ }}}[a.z] —> {{{ID.a-z}}}
//
//
//
//  B if control itself has controlData, Reiterate
//
//

  return template
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
      for (let i = 0; i < object.length; i++) {
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
