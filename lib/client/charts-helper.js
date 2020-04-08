/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2017, 2019. All Rights Reserved.
 * Copyright (c) 2020 Red Hat, Inc.
 *
 * US Government Users Restricted Rights - Use, duplication or disclosure
 * restricted by GSA ADP Schedule Contract with IBM Corp.
 *******************************************************************************/
'use strict'

export const inflateKubeValue = value => {
  if (typeof value === 'string') {
    const match = value.match(/\D/g)
    if (match) {
      // if value has suffix
      const unit = match.join('')
      const val = value.match(/\d+/g).map(Number)[0]
      const BINARY_PREFIXES = ['Ki', 'Mi', 'Gi', 'Ti', 'Pi', 'Ei']
      const SI_PREFIXES = ['m', 'k', 'M', 'G', 'T', 'P', 'E']
      const num =
        unit && unit.length === 2
          ? factorize(BINARY_PREFIXES, unit, 'binary')
          : factorize(SI_PREFIXES, unit, 'si')
      return val * num
    }
  }
  return parseFloat(value || 0)
}

function factorize(prefixes, unit, type) {
  let factorize = 1
  for (var index = 0; index < prefixes.length; index++) {
    if (unit === prefixes[index]) {
      const base = type === 'binary' ? 1024 : 1000
      const exponent =
        type === 'binary' ? index + 1 : unit === 'm' ? -1 : index
      factorize = Math.pow(base, exponent)
    }
  }
  return factorize
}

export const getPercentage = (value, total) => {
  return Math.floor(100 * value / total) || 0
}

export const getTotal = data => {
  return data.reduce((acc, item) => {
    return acc + item.value
  }, 0)
}
