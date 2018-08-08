/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2018. All Rights Reserved.
 *
 * Note to U.S. Government Users Restricted Rights:
 * Use, duplication or disclosure restricted by GSA ADP Schedule
 * Contract with IBM Corp.
 *******************************************************************************/
'use strict'

import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import ApplicationDetails from '../components/application/ApplicationDetails'

class ApplicationDetailsContainer  extends React.Component {
  static propTypes = {
    application: PropTypes.object,
  }
  render() {
    return (
      <div className='applicationDetails'>
        <ApplicationDetails
          application={this.props.application}
        />
      </div>
    )
  }
}

ApplicationDetailsContainer .contextTypes = {
  locale: PropTypes.string
}

const mapStateToProps = () =>{
  const application = {}
  return {
    application,
  }
}

const mapDispatchToProps= () => {
  return {
  }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(ApplicationDetailsContainer))
