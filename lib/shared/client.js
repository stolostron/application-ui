/*******************************************************************************
 * Licensed Materials - Property of IBM
 * 5737-E67
 * (c) Copyright IBM Corporation 2017. All Rights Reserved.
 *
 * US Government Users Restricted Rights - Use, duplication or disclosure
 * restricted by GSA ADP Schedule Contract with IBM Corp.
 *******************************************************************************/
'use strict'

/*
 * A boolean module that is true on the client, false on the server. This is for code that needs to
 * do different things on the server vs the client.
 */

module.exports = typeof window !== 'undefined'
