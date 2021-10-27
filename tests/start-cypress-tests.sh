#!/bin/bash

# Copyright (c) 2020 Red Hat, Inc.
# Copyright Contributors to the Open Cluster Management project

echo "Initiating tests..."

if [ -z "$CYPRESS_TEST_MODE" ]; then
  echo "CYPRESS_TEST_MODE not exported; setting to 'e2e' mode"
  export CYPRESS_TEST_MODE='e2e'
fi

if [ -z "$BROWSER" ]; then
  export BROWSER="chrome"
fi

if [[ -z $CYPRESS_MANAGED_OCP_URL || -z $CYPRESS_MANAGED_OCP_USER || -z $CYPRESS_MANAGED_OCP_PASS ]]; then	
   echo 'One or more variables are undefined. Copying kubeconfigs...'
   cp -r ~/resources/extra-import-kubeconfigs/* ./cypress/config/import-kubeconfig
else	
  echo "Logging into the managed cluster using credentials and generating the kubeconfig..."
  mkdir -p ./import-kubeconfig && touch ./import-kubeconfig/kubeconfig
  export KUBECONFIG=$(pwd)/import-kubeconfig/kubeconfig
  oc login --server=$CYPRESS_MANAGED_OCP_URL -u $CYPRESS_MANAGED_OCP_USER -p $CYPRESS_MANAGED_OCP_PASS --insecure-skip-tls-verify
  unset KUBECONFIG
  echo "Copying managed cluster kubeconfig to ./cypress/config/import-kubeconfig ..."
  cp ./import-kubeconfig/* ./cypress/config/import-kubeconfig
fi

echo "Logging into Kube API server..."
oc login --server=$CYPRESS_OC_CLUSTER_URL -u $CYPRESS_OC_CLUSTER_USER -p $CYPRESS_OC_CLUSTER_PASS --insecure-skip-tls-verify

if [[ "$CLEAN_UP" == "true" ]]; then
  echo "Cleaning up test resources. Tests will not run."

  oc delete applications.app.k8s.io --all --all-namespaces
  oc delete channels.apps.open-cluster-management.io --all --all-namespaces
  oc delete deployables.apps.open-cluster-management.io --all --all-namespaces
  oc delete gitopsclusters.apps.open-cluster-management.io --all --all-namespaces
  oc delete placementrules.apps.open-cluster-management.io --all --all-namespaces
  oc delete subscriptions.apps.open-cluster-management.io --all --all-namespaces
  oc delete ansiblejobs.tower.ansible.com --all --all-namespaces
  oc delete managedclustersets.cluster.open-cluster-management.io --all --all-namespaces
  oc delete applicationsets.argoproj.io --all --all-namespaces
  oc delete operatorgroup --all=true -n app-ui-ansibleoperator
  oc delete deployment tower-resource-operator -n app-ui-ansibleoperator
  oc delete namespace app-ui-ansibleoperator
  oc delete namespace ggithubcom-open-cluster-management-app-ui-e2e-private-git-ns
  oc delete namespace ggithubcom-fxiang1-app-samples-ns
  oc delete identity app-e2e-htpasswd:app-test-cluster-manager-admin
  oc delete secret app-e2e-users -n openshift-config
  oc delete clusterrolebinding app-test-cluster-admin-clusterrolebinding
  oc delete clusterrolebinding app-test-cluster-manager-admin-clusterrolebinding
  oc delete clusterrolebinding app-test-subscription-admin-clusterrolebinding
  oc delete rolebinding app-test-admin-clusterrolebinding -n default
  oc delete rolebinding app-test-edit-clusterrolebinding -n default
  oc delete rolebinding app-test-view-clusterrolebinding -n default
  oc delete user app-test-cluster-manager-admin
  oc delete namespace hchartsbitnamicom-bitnami-ns
  oc delete namespace hcom-open-cluster-management-app-ui-e2e-private-helm-main-ns
  oc delete namespace hdummy-helminsecureskipverifyoption-undefined-ns
  oc delete namespace ominio-minioappshivemind-bawsred-chesterfieldcom-ui-test-ns
  oc delete namespace ui-git-ansible-ns
  oc delete namespace ui-git-ns
  oc delete namespace ui-helm-ns
  oc delete namespace ui-helm2-ns
  oc delete namespace ui-obj-ns
  oc delete operator awx-resource-operator.app-ui-ansibleoperator

  echo "Clean up done. Exiting."
  exit 0
fi

echo "Checking RedisGraph deployment."
installNamespace=`oc get mch -A -o jsonpath='{.items[0].metadata.namespace}'`
rgstatus=`oc get srcho searchoperator -o jsonpath="{.status.deployredisgraph}" -n ${installNamespace}`
if [ "$rgstatus" == "true" ]; then
  echo "RedisGraph deployment is enabled."
else
  echo "RedisGraph deployment disabled, enabling and waiting 60 seconds for the search-redisgraph-0 pod."
  oc set env deploy search-operator DEPLOY_REDISGRAPH="true" -n $installNamespace
  sleep 60
fi

echo "Running tests on $CYPRESS_BASE_URL in $CYPRESS_TEST_MODE mode..."
testCode=0
npx cypress run --config-file "./cypress.json" --browser $BROWSER
testCode=$?

testDirectory="/results"

if [ -d "$testDirectory" ]; then
  # move test results if $testDirectory exists.
  echo "Copying Mocha JSON and XML output to /results..."
  cp -r ./test-output/cypress/json/* /results
  cp -r ./test-output/cypress/xml/* /results

  echo "Copying outputed screenshots and videos to /results..."
  cp -r ./cypress/screenshots /results/screenshots
  cp -r ./cypress/videos /results/videos
fi

if [[ ! -z "$SLACK_TOKEN" ]]; then
   echo "Slack integration is configured; processing..."
   npm run test:slack
fi

exit $testCode
