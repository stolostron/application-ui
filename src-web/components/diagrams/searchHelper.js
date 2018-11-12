/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2018. All Rights Reserved.
 *
 * Note to U.S. Government Users Restricted Rights:
 * Use, duplication or disclosure restricted by GSA ADP Schedule
 * Contract with IBM Corp.
 *******************************************************************************/
'use strict'

import { SearchResult } from './constants.js'

export default class SearchHelper {

  constructor() {
    this.lastSearch = ''
  }

  filterCollections = (cy, collections, searchName='', cbs) => {
    // reset previous search
    let searchNames = []
    const isSearching = searchName.length>0
    const isNewSearch = searchName.localeCompare(this.lastSearch)!==0
    if (this.lastSearch && isNewSearch) {
      ['connected', 'unconnected'].forEach(key=>{
        collections[key].forEach(({elements})=>{
          elements.forEach(element=>{
            const data = element.data()
            let layout
            if (element.isNode()) {
              ({layout} = data.node)
            } else {
              ({layout} = data.edge)
            }
            if (!searchName && layout.search===SearchResult.match) {
              layout.search = SearchResult.matched // past tense
            } else {
              layout.search = SearchResult.nosearch
            }
            delete layout.undragged
            delete layout.dragged
          })
        })
      })
    }

    // if start of search, save layout
    // if new search, reset layout caches
    // if end of seach, restore original layout
    if (isNewSearch) {
      if (!isSearching) {
        cbs.restoreLayout()
      } else {
        if (!this.lastSearch) {
          cbs.saveLayout()
        }
        cbs.resetLayout()
      }
    }

    // new search
    let directedPath=false
    if (isSearching) {
      this.cy = cy
      this.caseSensitive = searchName.localeCompare(searchName.toLowerCase()) !== 0
      if (!this.caseSensitive) {
        searchName = searchName.toLowerCase()
      }
      ({searchNames, directedPath} = getSearchNames(searchName))
      if (directedPath) {
        collections['connected'] = this.findConnectedPath(collections['connected'], searchNames)
        collections['unconnected'] = this.hideUnconnected(collections['unconnected'])
      } else {
        searchNames = searchNames.filter(s=>!!s)
        collections['connected'] = this.filterConnected(collections['connected'], searchNames)
        collections['unconnected'] = this.filterUnconnected(collections['unconnected'], searchNames)
      }
    }
    this.lastSearch = searchName
    return {searchNames, directedPath}
  }

  findConnectedPath = (connected, searchNames) => {
    return connected.filter(collection => {
      const {elements} = collection
      const elementMap = {}
      elements.toArray().forEach(element=>{
        const {id} = element.data()
        elementMap[id] = element
      })

      // find matching sources and targets
      let srcs = []
      let tgts = []
      Object.values(elementMap).forEach(element=>{
        if (element.isNode()) {
          const name = this.getName(element)
          const arr = [0,1]
          arr.forEach(idx=>{
            if (searchNames[idx] && name.indexOf(searchNames[idx]) !==-1) {
              if (idx===0) {
                srcs.push(element)
              } else {
                tgts.push(element)
              }
            }
          })
        }
      })

      const relatedMap = {}
      const matchingMap = {}
      if (srcs.length>0 || tgts.length>0) {
        // if 1st search name is blank, add roots to source
        if (!searchNames[0]) {
          srcs = elements.roots()
        }
        // if 2nd search name is blank, add leaves to target
        if (!searchNames[1]) {
          tgts = elements.leaves()
        }

        // if this collection has both a matching source and target, see if there's a path between them
        if (srcs.length>0 && tgts.length>0) {

          // use floydWarshall algo from cytoscape to find paths between two nodes
          const floydWarshall = elements.floydWarshall({directed:true})
          srcs.forEach(src=>{
            tgts.forEach(tgt=>{
              if (src.data().id!==tgt.data().id) {
                const path = floydWarshall.path(src, tgt)||[]
                path.forEach((element, idx, arr)=>{
                  const {id} = element.data()
                  if (idx===0 || idx===arr.length-1) {
                    matchingMap[id] = element
                  } else {
                    relatedMap[id] = element
                  }
                })
              }
            })
          })

          // are there any paths between?
          if (Object.keys(matchingMap).length>0) {
            // mark srcs and tgts that have a path between them as matches
            for (const id in matchingMap) {
              const {node: {layout}} = matchingMap[id].data()
              layout.search = SearchResult.match
              delete relatedMap[id]
              delete elementMap[id]
            }

            // mark elements between matched srcs and tgts as related
            for (const id in relatedMap) {
              const element = relatedMap[id]
              const data = element.data()
              let layout
              if (element.isNode()) {
                ({layout} = data.node)
              } else {
                ({layout} = data.edge)
              }
              layout.search = SearchResult.match// SearchResult.related
              delete elementMap[id]
            }
          }
        }
      }

      // whatever is left in elementMap we hide
      Object.values(elementMap).forEach(element=>{
        const data = element.data()
        let layout
        if (element.isNode()) {
          ({layout} = data.node)
        } else {
          ({layout} = data.edge)
        }
        layout.search = SearchResult.nomatch
      })

      collection.elements = this.cy.add(Object.values(matchingMap).concat(Object.values(relatedMap)))
      return collection.elements.length>0
    })
  }

  hideUnconnected = (unconnected) => {
    unconnected.forEach(collection => {
      const {elements} = collection
      elements.nodes().forEach(element=>{
        const {node:{layout}} = element.data()
        layout.search = SearchResult.nomatch
      })
    })
    return []
  }

  filterConnected = (connected, searchNames) => {
    return connected.filter(collection => {
      const {elements} = collection
      const elementMap = {}
      elements.toArray().forEach(element=>{
        const {id} = element.data()
        elementMap[id] = element
      })

      // first find any matching nodes
      const processed = new Set()
      const matching = Object.values(elementMap).filter(element=>{
        if (element.isNode()) {
          const data = element.data()
          const {id, node:{layout}} = data
          const name = this.getName(element)
          for (let i = 0; i < searchNames.length; i++) {
            if (name.indexOf(searchNames[i]) !==-1) {
              layout.search = SearchResult.match
              processed.add(id)
              delete elementMap[id]
              return true
            }
          }
        }
        return false
      })

      // then find related nodes and edges
      const related = []
      matching.forEach(match=>{
        // use cytoscape to find related nodes and their edges
        [match.incomers(), match.outgoers()].forEach(collection=>{
          collection.forEach(element=>{
            const data = element.data()
            const {id} = data
            if (!processed.has(id)) {
              let layout
              if (element.isNode()) {
                ({layout} = data.node)
              } else {
                ({layout} = data.edge)
              }
              layout.search = SearchResult.related
              related.push(element)
              processed.add(id)
              delete elementMap[id]
            }
          })
        })
      })

      // whatever is left in elementMap we hide
      Object.values(elementMap).forEach(element=>{
        const data = element.data()
        let layout
        if (element.isNode()) {
          ({layout} = data.node)
        } else {
          ({layout} = data.edge)
        }
        layout.search = SearchResult.nomatch
      })

      collection.elements = this.cy.add(matching.concat(related))
      return collection.elements.length>0
    })
  }

  filterUnconnected = (unconnected, searchNames) => {
    return unconnected.filter(collection => {
      const {elements} = collection

      // find any matching nodes
      const matching = elements.nodes().filter(element=>{
        const data = element.data()
        const {node:{layout}} = data
        const name = this.getName(element)
        for (let i = 0; i < searchNames.length; i++) {
          if (name.indexOf(searchNames[i]) !==-1) {
            layout.search = SearchResult.match
            return true
          }
        }
        layout.search = SearchResult.nomatch
        return false
      })

      collection.elements = matching
      return collection.elements.length>0
    })
  }

  getName = (element) => {
    const {node} = element.data()
    let name = node.name
    // if not case sensative, make all lower case
    if (!this.caseSensitive) {
      name = name.toLowerCase()
    }
    // if this is a pod, don't match it uid at the end
    if (node.type==='pod') {
      name = name.split('-')
      name.pop()
      name = name.join('-')
    }
    return name
  }
}

export const getSearchNames = (searchName) => {
  let directedPath = false
  let searchNames = searchName.split(/(\+|>)+/)
  if (searchNames.length>1) {
    directedPath = searchNames[1]==='>'
    searchNames = searchNames.filter(item=>{
      return item!=='+' && item!=='>'
    })
  }
  return {searchNames:searchNames.map(s=>s.trim()), directedPath}
}
