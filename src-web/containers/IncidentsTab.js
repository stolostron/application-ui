/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2018, 2019. All Rights Reserved.
 *
 * Note to U.S. Government Users Restricted Rights:
 * Use, duplication or disclosure restricted by GSA ADP Schedule
 * Contract with IBM Corp.
 *******************************************************************************/

import React from 'react'

import PropTypes from 'prop-types'
import withAccess from '../components/common/withAccess'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { ROLES, RESOURCE_TYPES } from '../../lib/shared/constants'
import { fetchResource } from '../actions/common'
import {
  getIncidentCount,
  getIncidentList
} from '../components/common/ResourceDetails/utils'

class IncidentsTab extends React.Component {
  static propTypes = {
    fetchIncidents: PropTypes.func,
    incidentCount: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    incidents: PropTypes.array
  };

  constructor(props) {
    super(props)
  }

  componentWillMount() {
    this.props.fetchIncidents()
  }

  render() {
    return (
      <div>
        {this.props.incidentCount}
        <br />
        <br />
        <ul>
          {this.props.incidents.map(item => {
            return <li key={Math.random()}>{JSON.stringify(item)}</li>
          })}
        </ul>
      </div>
    )
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  const { params } = ownProps
  return {
    fetchIncidents: () =>
      dispatch(
        fetchResource(
          RESOURCE_TYPES.CEM_INCIDENTS,
          params.namespace,
          params.name
        )
      )
  }
}

const mapStateToProps = state => {
  const { CEMIncidentList } = state
  return {
    incidents: getIncidentList(CEMIncidentList),
    incidentCount: getIncidentCount(CEMIncidentList)
  }
}

export default withRouter(
  withAccess(
    connect(mapStateToProps, mapDispatchToProps)(IncidentsTab),
    ROLES.VIEWER
  )
)
