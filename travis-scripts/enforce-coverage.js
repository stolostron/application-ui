/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2018. All Rights Reserved.
 *
 * Note to U.S. Government Users Restricted Rights:
 * Use, duplication or disclosure restricted by GSA ADP Schedule
 * Contract with IBM Corp.
 *******************************************************************************/

/* eslint-disable no-console, import/no-unresolved */

if(!process.env.PREV_COVERAGE_REPORT
  || process.env.PREV_COVERAGE_REPORT === ''
  || process.env.PREV_COVERAGE_REPORT === '404: Not Found'){
  console.error('Skipped code coverage enforcement. Unable to find the previous coverage report.')
  console.error('Please check the value of PREV_COVERAGE_REPORT')
  process.exit(0)  // Ignoring for now, once we get the right process in place we should fail the build.
}

console.log('Current path:', process.cwd())

const currReport = require('../test-output/coverage/coverage-summary.json')
let prevReport
try{
  prevReport = JSON.parse(process.env.PREV_COVERAGE_REPORT)
} catch (error){
  console.error('Skipped code coverage enforcement. Unable to parse the previous coverage report.')
  console.error(error)
  process.exit(0)  // Ignoring for now, once we get the right process in place we should fail the build.
}

var result = ''
if(currReport.total.lines.pct < prevReport.total.lines.pct){
  result += '\n  - Lines covered declined by: ' + (prevReport.total.lines.pct - currReport.total.lines.pct) + '%'
}
if(currReport.total.statements.pct < prevReport.total.statements.pct){
  result += '\n  - Statements covered declined by: ' + (prevReport.total.statements.pct - currReport.total.statements.pct) + '%'
}
if(currReport.total.functions.pct < prevReport.total.functions.pct){
  result += '\n  - Functions covered declined by: ' + (prevReport.total.functions.pct - currReport.total.functions.pct) + '%'
}
if(currReport.total.branches.pct < prevReport.total.branches.pct){
  result += '\n  - Branches covered declined by: ' + (prevReport.total.branches.pct - currReport.total.branches.pct) + '%'
}

if(result !== ''){
  console.error('BUILD FAILED because code coverage declined.')
  console.error(result)
  process.exit(1)
}
