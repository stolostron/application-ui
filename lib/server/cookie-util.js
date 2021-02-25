/** *****************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2017, 2019. All Rights Reserved.
 *
 * US Government Users Restricted Rights - Use, duplication or disclosure
 * restricted by GSA ADP Schedule Contract with IBM Corp.
 *******************************************************************************/
'use strict'

var constants = require('../shared/constants')
var cookie = require('cookie')

exports.getUser = function(userCookie) {
  if (userCookie) {
    const buffer = new Buffer(userCookie, 'base64')
    try {
      return JSON.parse(buffer.toString())
    } catch (e) {
      return false
    }
  }
}

exports.isLoggedIn = function(req) {
  return !!exports.getAccessToken(req) && !!exports.getUserToken(req)
}

exports.getAccessToken = function(req) {
  return req.cookies[constants.ACM_ACCESS_COOKIE]
}

exports.getUserToken = function(req) {
  return req.cookies[constants.ACM_USER_COOKIE]
}

exports.parseCookies = function(cookies) {
  return cookies && cookies.map(resCookie => cookie.parse(resCookie))
}

exports.getCookie = function(parsedCookies, cookieName) {
  return (
    parsedCookies &&
    parsedCookies.filter(parsedCookie => !!parsedCookie[cookieName])
  )
}

exports.expireUserCookie = function(res) {
  return res.cookie(constants.ACM_USER_COOKIE, '', { expires: new Date(0) })
}

exports.getCookieNames = function() {
  return [
    constants.ACM_USER_COOKIE,
    constants.ACM_ACCESS_COOKIE,
    constants.ACM_AUTH_COOKIE
  ]
}

exports.deleteAuthCookies = function(res) {
  res.clearCookie(constants.ACM_USER_COOKIE)
  res.clearCookie(constants.ACM_ACCESS_COOKIE)
  res.clearCookie(constants.ACM_AUTH_COOKIE)
  res.clearCookie(constants.JSESSIONID)
  res.clearCookie(constants.CFC_REDIRECT_COOKIE)
  res.clearCookie(constants.WAS_COOKIE)
  return res
}
