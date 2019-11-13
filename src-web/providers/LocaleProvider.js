/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2016, 2019. All Rights Reserved.
 *
 * US Government Users Restricted Rights - Use, duplication or disclosure
 * restricted by GSA ADP Schedule Contract with IBM Corp.
 *******************************************************************************/

import PropTypes from 'prop-types'
import withContext from 'recompose/withContext'
import getContext from 'recompose/getContext'

const LocaleProvider = ({ children }) => children

const withLocaleContext = withContext({ locale: PropTypes.string }, props => ({
  locale: props.locale
}))

const withLocale = getContext({ locale: PropTypes.string })

export { withLocale }
export default withLocaleContext(LocaleProvider) // this can be used to wrap the root.
