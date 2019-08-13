/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2019. All Rights Reserved.
 *
 * Note to U.S. Government Users Restricted Rights:
 * Use, duplication or disclosure restricted by GSA ADP Schedule
 * Contract with IBM Corp.
 *******************************************************************************/

import React from 'react'
import moment from 'moment'

export const mapIncidents = incidents => {
  if (incidents instanceof Array && incidents.length > 0) {
    return incidents.map(elem => ({
      id: (elem.id && createIncidentLink(elem.id)) || '',
      summary: elem.summary || '',
      description: elem.description || '',
      priority: elem.priority || '',
      escalated:
        elem.escalated === 'true'
          ? 'Yes'
          : elem.escalated === 'false' ? 'No' : '',
      owner: elem.owner || '',
      team: elem.team || '',
      state: elem.state || '',
      createdTime: (elem.createdTime && getAge(elem.createdTime)) || '',
      lastChanged: (elem.lastChanged && getAge(elem.lastChanged)) || ''
    }))
  }
  return []
}

const getAge = value => {
  if (value) {
    if (value.includes('T')) {
      return moment(value, 'YYYY-MM-DDTHH:mm:ssZ').fromNow()
    } else {
      return moment(value, 'YYYY-MM-DD HH:mm:ss').fromNow()
    }
  }
  return '-'
}

const createIncidentLink = incidentId => {
  const link = `/cemui/incidents/${encodeURIComponent(incidentId)}/details`
  return (
    <a target="_blank" rel="noopener noreferrer" href={link}>
      {incidentId}
    </a>
  )
}
