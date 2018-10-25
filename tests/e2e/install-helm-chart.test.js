/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2018. All Rights Reserved.
 *
 * Note to U.S. Government Users Restricted Rights:
 * Use, duplication or disclosure restricted by GSA ADP Schedule
 * Contract with IBM Corp.
 *******************************************************************************/

const config = require('../../config')
const ROUTE = {
  'install-helm-release': '/remoteinstall',
}

module.exports = {
  '@disabled': false,
  before: (browser) => {
    const loginPage = browser.page.LoginPage()
    loginPage.navigate()
    loginPage.authenticate()
  },

  // TODO: Zack L - Need to use dynamic mock data
  // Test uses the mocked response from API repo - we can't actually install a release to a mocked cluster
  'install-helm-release': (browser) => {
    const url = `${browser.launch_url}${config.get('contextPath')}${ROUTE[browser.currentTest.name]}`
    browser.execute(`
      sessionStorage.setItem('chartName', 'acs-engine-autoscaler');
      sessionStorage.setItem('repoName', 'google-charts');
      sessionStorage.setItem('tarFiles', '["https://kubernetes-charts.storage.googleapis.com/acs-engine-autoscaler-2.2.0.tgz"]');
      sessionStorage.setItem('values', '{"replicaCount":1,"resources":{},"nodeSelector":{},"podAnnotations":{},"deploymentAnnotations":{},"tolerations":[],"affinity":{},"image.repository":"wbuchwalter/kubernetes-acs-engine-autoscaler","image.tag":"2.1.1","image.pullPolicy":"IfNotPresent","acsenginecluster.resourcegroup":"","acsenginecluster.azurespappid":"","acsenginecluster.azurespsecret":"","acsenginecluster.azuresptenantid":"","acsenginecluster.kubeconfigprivatekey":"","acsenginecluster.clientprivatekey":"","acsenginecluster.caprivatekey":"","selectedReleaseName":"test-acs-engine","selectedNamespace":"kube-system"}');
      sessionStorage.setItem('version', '2.2.0');
    `)
    const chartPage = browser.page.HelmChartsPage()
    chartPage.navigate(url)
    chartPage.verifyPageContent()
    chartPage.installHelmRelease(browser)
    chartPage.verifyHelmReleaseInstall(browser)
  },

  after: function (browser, done) {
    setTimeout(() => {
      browser.end()
      done()
    })
  }
}
