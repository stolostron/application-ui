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
import { discoverControls, setEditingMode, reverseTemplate, getResourceID} from './utils'
import { generateSourceFromTemplate } from './refresh-source-from-templates'
import YamlParser from '../components/YamlParser'
import _ from 'lodash'

export const generateSourceFromStack = (
  template,
  editStack,
  controlData,
  otherYAMLTabs
) => {
  if (!editStack.initialized) {
    intializeControls(editStack, controlData)
  }
  return generateSource(editStack, controlData, template, otherYAMLTabs)
}

// update edit stack after the user types something into the editor
// and then uses the form it doesn't wipe out what they just typed
export const updateEditStack = (
  editStack={},
  templateResources,
  parsedResources
) => {

  const { initialized } = editStack
  if (!initialized) {
    editStack.customIdMap = {}
    editStack.deletedLinks = new Set()
    editStack.initialized = true
  }

  // last template generation becomes the base template
  editStack.baseTemplateResources = templateResources

  // last content of editor becomes the custom resource
  editStack.customResources = parsedResources

  // update map of custom id's to template id's
  updateCustomIdMap(editStack)

  return editStack
}

const updateCustomIdMap = (editStack) => {
  const { customResources, baseTemplateResources, customIdMap } = editStack
  const clonedTemplateResources = _.cloneDeep(baseTemplateResources)
  const customIdSet = new Set()
  customResources.forEach(resource=>{
    const resourceID = getResourceID(resource)
    if (resourceID) {
      customIdSet.add(resourceID)
    }
  })
  customResources.forEach(resource=>{
    let resourceID = getResourceID(resource)
    if (resourceID) {
      if (customIdMap[resourceID]) {
        resourceID = customIdMap[resourceID]
      }
      let inx = clonedTemplateResources.findIndex(res => {
        return resourceID === getResourceID(res)
      })
      if (inx !== -1) {
        const res = clonedTemplateResources.splice(inx, 1)[0]
        customIdMap[resourceID] = getResourceID(res)
      } else {
        clonedTemplateResources.filter(res=>res.kind===resource.kind).forEach(res=>{
          const templateID = getResourceID(res)
          if (!customIdSet.has(templateID)) {
            customIdMap[resourceID] = templateID
          }
        })
        inx = clonedTemplateResources.findIndex(res => {
          return customIdMap[resourceID] === getResourceID(res)
        })
        if (inx !== -1) {
          clonedTemplateResources.splice(inx, 1)
        }
      }
    }
  })
}

const intializeControls = (editStack, controlData) => {
  const { customResources, editor, locale } = editStack
  const { templateObject } = generateSourceFromResources(customResources)

  // determine the controls for this resource
  discoverControls(controlData, templateObject, editor, locale)

  // refresh the values from the template for these controls
  reverseTemplate(controlData, templateObject)

  // put controls into editing mode (ex: disable name input)
  setEditingMode(controlData)

  // keep track of template changes
  editStack.baseTemplateResources = null
  editStack.deletedLinks = new Set()
  editStack.customIdMap = {}
  editStack.initialized = true

}

const generateSource = (editStack, controlData, template, otherYAMLTabs) => {
  const {
    customResources,
    deletedLinks,
    customIdMap
  } = editStack

  // get the next iteration of template changes
  const { templateResources } = generateSourceFromTemplate(
    template,
    controlData,
    otherYAMLTabs
  )

  // first time thru, we just have the base template to compare against
  let currentTemplateResources
  let {baseTemplateResources} = editStack
  if (!baseTemplateResources) {
    editStack.baseTemplateResources = templateResources
    baseTemplateResources = templateResources
  } else {
    // next time we merge base and current templates into custom
    currentTemplateResources = templateResources
  }

  let resources = mergeSource(customResources, baseTemplateResources, currentTemplateResources, customIdMap, deletedLinks)

  // make sure there's no duplicates
  resources = _.uniqWith(resources, _.isEqual)

  // then generate the source from those resources
  return {...generateSourceFromResources(resources), templateResources}
}

const mergeSource = (resources, baseTemplateResources, currentTemplateResources, customIdMap, deletedLinks) => {

  let customResources = _.cloneDeep(resources)
  const clonedCurrentTemplateResources = currentTemplateResources && _.cloneDeep(currentTemplateResources)

  ////////////////////////////////////////////////
  ///////////  DELETE ////////////////////////////
  ////////////////////////////////////////////////
  // filter out the custom resources that don't exist in the current template using selfLinks
  customResources = customResources.filter(resource => {
    // filter out custom resource that isn't in next version of template
    const selfLink = _.get(resource, 'metadata.selfLink')
    let resourceID = getResourceID(resource)
    if (!resourceID) {
      return false
    }
    if (customIdMap[resourceID]) {
      resourceID = customIdMap[resourceID]
    }
    // if base template doesn't have this resource, the template never liked it
    // (ex: predefined app channel)
    let inx = baseTemplateResources.findIndex(res => {
      return resourceID === getResourceID(res)
    })
    if (inx === -1) {
      return false
    }

    // if user has added something with the forms
    if (currentTemplateResources) {
      inx = clonedCurrentTemplateResources.findIndex(res => {
        return resourceID === getResourceID(res)
      })
      if (inx === -1) {
        // if editor got rid of it, add to the selfLinks we will be deleting
        // when updating editor to server
        if (selfLink) {
          deletedLinks.add(selfLink)
        }
        return false
      } else {
        // else remove from currentTemplateResources such that
        // anything left is considered new and should be added to custom resources
        clonedCurrentTemplateResources.splice(inx, 1)
      }
    }
    return true
  })
  if (clonedCurrentTemplateResources) {
    ////////////////////////////////////////////////
    ///////////  ADD ////////////////////////////
    ////////////////////////////////////////////////
    // anything left in currentTemplateResources was added by editor
    if (clonedCurrentTemplateResources.length) {
      customResources.push(...clonedCurrentTemplateResources)
    }

    ////////////////////////////////////////////////
    ///////////  MODIFY ////////////////////////////
    ////////////////////////////////////////////////

    customResources.forEach(resource => {
      // compare the difference, and add them to edit the custom resource
      let val, idx

      let resourceID = getResourceID(resource)
      if (resourceID) {
        if (customIdMap[resourceID]) {
          resourceID = customIdMap[resourceID]
        }
        const baseInx = baseTemplateResources.findIndex(res => {
          return resourceID === getResourceID(res)
        })
        const currentInx = currentTemplateResources.findIndex(res => {
          return resourceID === getResourceID(res)
        })

        if (baseInx !== -1 && currentInx !== -1) {
          const oldResource = baseTemplateResources[baseInx]
          const newResource = currentTemplateResources[currentInx]
          const diffs = diff(oldResource, newResource)
          if (diffs) {
            diffs.forEach(({ kind, path, rhs, item }) => {
              if (!isProtectedNameNamespace(path)) {
                switch (kind) {
                // array modification
                case 'A': {
                  switch (item.kind) {
                  case 'N':
                    val = _.get(newResource, path, [])
                    if (Array.isArray(val)) {
                      _.set(resource, path, val)
                    } else {
                      val[Object.keys(val).length] = item.rhs
                      _.set(resource, path, Object.values(val))
                    }
                    break
                  case 'D':
                    val = _.get(newResource, path, [])
                    if (Array.isArray(val)) {
                      _.set(resource, path, val)
                    } else {
                      val = _.omitBy(val, e => e === item.lhs)
                      _.set(resource, path, Object.values(val))
                    }
                    break
                  }
                  break
                }
                case 'E': {
                  idx = path.pop()
                  val = _.get(resource, path)
                  if (Array.isArray(val)) {
                    val.splice(idx, 1, rhs)
                  } else {
                    path.push(idx)
                    _.set(resource, path, rhs)
                  }
                  break
                }
                case 'N': {
                  _.set(resource, path, rhs)
                  break
                }
                case 'D': {
                  _.unset(resource, path)
                  break
                }
                }
              }
            })
          }
        }
      }
    })
  }

  return customResources
}

const isProtectedNameNamespace = path => {
  if (path.length>=2) {
    const [key, value] = path.slice(Math.max(path.length - 2, 0))
    return ((typeof key==='string' && (key==='metadata' || key.endsWith('Ref'))) &&
        ['name', 'namespace'].indexOf(value) !== -1)
  }
  return false
}

const generateSourceFromResources = resources => {
  // use this to sort the keys generated by safeDump
  const order = ['name', 'namespace', 'start', 'end']
  const sortKeys = (a, b) => {
    const ai = order.indexOf(a)
    const bi = order.indexOf(b)
    if (ai < 0 && bi >= 0) {
      return 1
    } else if (ai >= 0 && bi < 0) {
      return -1
    } else if (ai < 0 && bi < 0) {
      return a.localeCompare(b)
    } else {
      return ai < bi
    }
  }

  let yaml,
      row = 0
  const parsed = {}
  const yamls = []
  resources.forEach(resource => {
    if (!_.isEmpty(resource)) {
      const key = _.get(resource, 'kind', 'unknown')
      yaml = jsYaml.safeDump(resource, {
        sortKeys,
        noRefs: true,
        lineWidth: 200
      })
      yaml = yaml.replace(/'\d+':(\s|$)\s*/gm, '- ')
      yaml = yaml.replace(/:\s*null$/gm, ':')
      const $synced = new YamlParser().parse(yaml, row)
      $synced.$r = row
      $synced.$l = yaml.split(/[\r\n]+/g).length
      let values = parsed[key]
      if (!values) {
        values = parsed[key] = []
      }
      values.push({ $raw: resource, $yml: yaml, $synced })
      row += yaml.split('\n').length
      yamls.push(yaml)
    }
  })

  return {
    templateYAML: yamls.join('---\n'),
    templateObject: parsed
  }
}
