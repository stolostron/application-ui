/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2018. All Rights Reserved.
 *
 * Note to U.S. Government Users Restricted Rights:
 * Use, duplication or disclosure restricted by GSA ADP Schedule
 * Contract with IBM Corp.
 *******************************************************************************/

export const convertStringToQuery = (searchText) => {
  const searchTokens = searchText.split(' ')
  const keywords = searchTokens.filter(token => token !== '' && token.indexOf(':') < 0)
  const filters = searchTokens.filter(token => token.indexOf(':') >= 0)
    .map(f => {
      const [ property, values ] = f.split(':')
      return { property, values: values.split(',') }
    })
    .filter(f => f.values[0] !== '')
  return {keywords, filters}
}

export const formatNumber = (count) => {
  if (count > 999) {
    // show one decimal place
    const num = (count - (count % 100)) / 1000
    return num + 'k'
  }
  return count
}
