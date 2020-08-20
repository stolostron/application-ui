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

import { diff } from 'deep-diff'
import jsYaml from 'js-yaml'
import YamlParser from '../components/YamlParser'
import _ from 'lodash'
import { Base64 } from 'js-base64'

export const highlightChanges = (editor, oldYAML, newYAML) => {
  // mark any modified/added lines in editor
  const decorationList = []

  const getInside = (ikey, { parsed }) => {
    const ret = {}
    Object.keys(parsed).forEach(key => {
      ret[key] = []
      _.get(parsed, `${key}`, []).forEach(obj => {
        ret[key].push(_.get(obj, `${ikey}`))
      })
    })
    return ret
  }

  // determine what rows were modified or added
  oldYAML = oldYAML.replace(/\./g, '_') // any periods will mess up the _.get later
  newYAML = newYAML.replace(/\./g, '_')
  const oldParse = parseYAML(oldYAML)
  const newParse = parseYAML(newYAML)
  const oldRaw = getInside('$raw', oldParse)
  const newRaw = getInside('$raw', newParse)
  const newSynced = getInside('$synced', newParse)
  let firstModRow = undefined
  let firstNewRow = undefined
  const ignorePaths = []
  normalize(oldRaw, newRaw)
  const diffs = diff(oldRaw, newRaw)
  if (diffs) {
    diffs.forEach(({ kind, path, index, item }) => {
      let pathBase = path.shift()
      pathBase = `${pathBase}[${path.length > 0 ? path.shift() : 0}]`
      let newPath =
        path.length > 0 ? pathBase + `.${path.join('.$v.')}` : pathBase
      let obj = _.get(newSynced, newPath)
      if (obj) {
        if (obj.$v || obj.$v === false) {
          // convert A's and E's into 'N's
          switch (kind) {
          case 'E': {
            if (obj.$l > 1) {
              // convert edit to new is multilines added
              kind = 'N'
              obj = { $r: obj.$r + 1, $l: obj.$l - 1 }
            }
            break
          }
          case 'A': {
            switch (item.kind) {
            case 'N':
              // convert new array item to new range
              kind = 'N'
              obj = obj.$v[index].$r ? obj.$v[index] : obj
              break
            case 'D':
              // if array delete, ignore any other edits within array
              // edits are just the comparison of other array items
              ignorePaths.push(path.join('/'))
              break
            }
            break
          }
          }
        } else if (obj.$l > 1 && path.length > 0 && kind !== 'D') {
          kind = 'N'
          path.pop()
          newPath = pathBase + `.${path.join('.$v.')}`
          obj = _.get(newSynced, newPath)
        } else if (path.length > 0) {
          kind = 'D'
        }

        // if array delete, ignore any other edits within array
        // edits are just the comparison of other array items
        if (ignorePaths.length > 0) {
          const tp = path.join('/')
          if (
            ignorePaths.some(p => {
              return tp.startsWith(p)
            })
          ) {
            // ignore any edits within an array that had an imtem deleted
            kind = 'D'
          }
        }

        switch (kind) {
        case 'E': {
          // edited
          if (obj.$v || obj.$v === false) {
            // if no value ignore--all values removed from a key
            decorationList.push({
              range: new editor.monaco.Range(obj.$r + 1, 0, obj.$r + 1, 0),
              options: {
                isWholeLine: true,
                linesDecorationsClassName: 'insertedLineDecoration',
                minimap: { color: '#c0c0ff', position: 2 }
              }
            })

            // if long encoded string, don't scroll to it
            let isEncoded = typeof obj.$v === 'string' && obj.$v.length > 200
            if (isEncoded) {
              try {
                Base64.decode(obj.$v)
              } catch (e) {
                isEncoded = false
              }
            }
            if (!firstModRow && !isEncoded) {
              firstModRow = obj.$r
            }
          }
          break
        }
        case 'N': // new
          decorationList.push({
            range: new editor.monaco.Range(obj.$r + 1, 0, obj.$r + obj.$l, 0),
            options: {
              isWholeLine: true,
              linesDecorationsClassName: 'insertedLineDecoration',
              minimap: { color: '#c0c0ff', position: 2 }
            }
          })
          if (!firstNewRow || firstNewRow > obj.$r) {
            firstNewRow = obj.$r
          }
          break
        }
      }
    })

    setTimeout(() => {
      editor.changeList = decorationList
      editor.decorations = editor.deltaDecorations(editor.decorations, [
        ...(editor.errorList || []),
        ...editor.changeList
      ])
    }, 0)
  } else {
    editor.decorations = editor.deltaDecorations(editor.decorations, [])
  }
  editor.changed = firstNewRow || firstModRow
}

// if there are arrays make sure equal array entries line up
const normalize = (oldRaw, newRaw) => {
  Object.keys(oldRaw).forEach(key => {
    if (newRaw[key] && oldRaw[key].length !== newRaw[key].length) {
      const oldKeys = _.keyBy(oldRaw[key], 'metadata.name')
      Object.keys(_.keyBy(newRaw[key], 'metadata.name')).forEach((k, inx) => {
        if (!oldKeys[k]) {
          oldRaw[key].splice(inx, 0, {})
        }
      })
    }
  })
}

export const highlightAllChanges = (
  editors,
  oldYAML,
  newYAML,
  otherYAMLTabs,
  selectedTab
) => {
  if (editors.length > 0) {
    highlightChanges(editors[0], oldYAML, newYAML)
    if (otherYAMLTabs.length > 0) {
      otherYAMLTabs.forEach(({ editor, oldTemplateYAML, templateYAML }) => {
        if (editor && oldTemplateYAML) {
          highlightChanges(editor, oldTemplateYAML, templateYAML)
        }
      })
    }

    // if currently opened tab has no change, open a tab with changes
    setTimeout(() => {
      let changedTab
      let changeTab = true
      let editorOnTab
      editors.forEach((editor, inx) => {
        editor.errorLine = _.get(editor, 'errorList[0].range.startLineNumber')
        if (editor.changed || editor.errorLine !== undefined) {
          if (changedTab === undefined) {
            changedTab = inx
            editorOnTab = editor
          }
          if (inx === selectedTab) {
            changeTab = false
          } else if (!changeTab && editor.errorLine !== undefined) {
            changeTab = true
          }
        }
      })
      if (changeTab && changedTab !== undefined) {
        const tabContainer = document.querySelector(
          '.creation-view-yaml-header-tabs'
        )
        const tabs = tabContainer.getElementsByClassName('bx--tabs__nav-link')
        if (tabs.length > 0) {
          tabs[changedTab].click()
        }
      }
      if (editorOnTab) {
        setTimeout(() => {
          editorOnTab.revealLineInCenter(
            editorOnTab.errorLine || editorOnTab.changed
          )
        }, 0)
      }
    }, 0)
  }
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
  return { parsed, exceptions }
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
