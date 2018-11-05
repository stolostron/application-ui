/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2018. All Rights Reserved.
 *
 * Note to U.S. Government Users Restricted Rights:
 * Use, duplication or disclosure restricted by GSA ADP Schedule
 * Contract with IBM Corp.
 *******************************************************************************/
'use strict'

export default {
  getRequiredTopologyFilters,
}

export function getRequiredTopologyFilters(item) {
  let label = []
  const {selector={}} = item
  for (var key in selector) {
    if (selector.hasOwnProperty(key)) {
      switch (key) {

      case 'matchLabels':
        for (var k in selector[key]) {
          if (selector[key].hasOwnProperty(k)) {
            const v = selector[key][k]
            label.push({ label: `${k}: ${v}`, name: k, value: v})
          }
        }
        break

      case 'matchExpressions':
        selector[key].forEach(({key:k='', operator='', values=[]})=>{
          switch (operator.toLowerCase()) {
          case 'in':
            label = values.map(v => {
              return { label: `${k}: ${v}`, name: k, value:v}
            })
            break

          case 'notin':
            //TODO
            break

          default:
            break
          }
        })
        break

      default:
        break
      }
    }
  }
  return {
    namespace: [],
    label
  }
}
