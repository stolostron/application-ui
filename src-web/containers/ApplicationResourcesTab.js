/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2018. All Rights Reserved.
 *
 * Note to U.S. Government Users Restricted Rights:
 * Use, duplication or disclosure restricted by GSA ADP Schedule
 * Contract with IBM Corp.
 *******************************************************************************/

import React from 'react'
import resources from '../../lib/shared/resources'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { updateSecondaryHeader } from '../actions/common'
import msgs from '../../nls/platform.properties'
import PropTypes from 'prop-types'
//import { Loading, Notification } from 'carbon-components-react'

resources(() => {
  require('../../scss/dashboard.scss')
})

export class ApplicationResourcesTab extends React.Component {

  constructor(props) {
    super(props)
  }

  componentWillMount() {
    const { updateSecondaryHeader } = this.props
    const {title, tabs, breadcrumbs} = this.getSecondaryHeaderProps()
    updateSecondaryHeader(title, tabs, breadcrumbs)
  }

  getSecondaryHeaderProps() {
    const { secondaryHeaderProps: { tabs }, location: {pathname} } = this.props
    const title = decodeURIComponent(pathname.split('/').pop())
    const breadcrumbs = [
      {
        label: msgs.get('routes.applications', this.context.locale),
        url: '/hcmconsole/applications'
      },
      {
        label: title,
        url: location.pathname
      }
    ]
    return {title, tabs, breadcrumbs}
  }


  componentDidMount() {
  }

  componentWillUnmount() {
  }

  render() {
    return (
      <div>
        Resources TBD
      </div>
    )
  }
}

ApplicationResourcesTab.propTypes = {
  location: PropTypes.object,
  secondaryHeaderProps: PropTypes.object,
  updateSecondaryHeader: PropTypes.func,
}

ApplicationResourcesTab.contextTypes = {
  locale: PropTypes.string
}

const mapStateToProps = () => {
  return {
  }
}


const mapDispatchToProps = dispatch => {
  return {
    updateSecondaryHeader: (title, tabs, breadcrumbs) => dispatch(updateSecondaryHeader(title, tabs, breadcrumbs)),
  }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(ApplicationResourcesTab))
