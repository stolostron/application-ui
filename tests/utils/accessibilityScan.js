/*
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2018, 2019. All Rights Reserved.
 *
 * US Government Users Restricted Rights - Use, duplication or disclosure
 * restricted by GSA ADP Schedule Contract with IBM Corp.
 */
// Copyright Contributors to the Open Cluster Management project
/*
const AAT = require('@ibma/aat')

module.exports = {
  runAccessibilityScan: (browser, page) => {
    browser.source(source => {
      browser.perform(done => {
        AAT.getCompliance(source.value, page, report => {
          browser.assert.equal(
            report.summary.counts.violation,
            0,
            `Check for accesibility violations in page ${
              browser.launchUrl
            }/multicloud/${page}   See report at: ./tests-output/a11y/${page}.json`
          )
          if (
            report.issueMessages.messages &&
            report.summary.counts.violation > 0
          ) {
            console.log(
              '----- ITEMIZED A11Y ERRORS: --------------------------------------'
            ) // eslint-disable-line no-console
            console.log(report.issueMessages.messages) // eslint-disable-line no-console
            console.log(
              '------------------------------------------------------------------'
            ) // eslint-disable-line no-console
          }
          done()
        })
      })
    })
  }
}
*/
