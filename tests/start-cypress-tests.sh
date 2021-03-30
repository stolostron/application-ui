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
  mkdir ./import-kubeconfig && touch ./import-kubeconfig/kubeconfig
  export KUBECONFIG=$(pwd)/import-kubeconfig/kubeconfig
  oc login --server=$CYPRESS_MANAGED_OCP_URL -u $CYPRESS_MANAGED_OCP_USER -p $CYPRESS_MANAGED_OCP_PASS --insecure-skip-tls-verify
  unset KUBECONFIG
  echo "Copying managed cluster kubeconfig to ./cypress/config/import-kubeconfig ..."
  cp ./import-kubeconfig/* ./cypress/config/import-kubeconfig
fi

echo "Running tests on $CYPRESS_BASE_URL in $CYPRESS_TEST_MODE mode..."
testCode=0
npx cypress run --config-file "./cypress.json" --browser $BROWSER
testCode=$?

echo "Copying Mocha JSON and XML output to /results..."
cp -r ./test-output/cypress/json/* /results
cp -r ./test-output/cypress/xml/* /results

echo "Copying outputed screenshots and videos to /results..."
cp -r ./cypress/screenshots /results/screenshots
cp -r ./cypress/videos /results/videos

# merge xml reports
# echo "Merging xml reports..."
# npm run test:merge-xml
# mkdir /results
# cp ./test-output/application-ui.xml /results
# ls -al /results

if [[ ! -z "$SLACK_TOKEN" ]]; then
   echo "Slack integration is configured; processing..."
   npm run test:slack
fi

#if [ $CYPRESS_TEST_MODE == "functional" ]; then
#  echo "Cleaning up functional test resources..."
#  sh ./tests/cypress/scripts/resource-cleanup.sh
#fi

exit $testCode
