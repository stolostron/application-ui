/** *****************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2018, 2019. All Rights Reserved.
 *
 * US Government Users Restricted Rights - Use, duplication or disclosure
 * restricted by GSA ADP Schedule Contract with IBM Corp.
 *******************************************************************************/
// Copyright (c) 2020 Red Hat, Inc.
// Copyright Contributors to the Open Cluster Management project

import msgs from '../../../nls/platform.properties'

const endsWithLetter = str => str[str.length - 1].match(/[a-z]/i)
const addPeriodIfNoneExists = str => (endsWithLetter(str) ? `${str}.` : str)
export const truncateByWordLength = (str, maxNumberOfWords) => {
  const sentence = str.trim().split(/\s+|-/) // split by dash or space.
  const exceedsWordLength = sentence.length > maxNumberOfWords
  const possiblyTruncatedString = exceedsWordLength
    ? sentence.slice(0, maxNumberOfWords).join(' ')
    : str

  if (exceedsWordLength && endsWithLetter(possiblyTruncatedString)) {
    return `${possiblyTruncatedString}...`
  }
  return addPeriodIfNoneExists(possiblyTruncatedString)
}

// safe lowercase that works with different types
export const LC = el => {
  if (typeof el === 'string') {
    return el.toLowerCase()
  }
  if (Array.isArray(el)) {
    return el.map(e => (typeof e === 'string' ? e.toLowerCase() : e))
  }
  return el
}

// super hacky, but why does a failure resolte in a string wrapped in exclamation marks?
export const getTranslation = (prop, locale, defaultStr = '') => {
  const getMsgSuccess = str => str[0] !== '!' && str[str.length - 1] !== '!'
  const translatedStr = msgs.get(prop, locale)
  const translation = getMsgSuccess(translatedStr) ? translatedStr : ''
  if (translation) {
    return translation
  } else if (defaultStr) {
    return defaultStr
  }
  return ''
}
