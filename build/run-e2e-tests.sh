#!/bin/bash
###############################################################################
# (c) Copyright IBM Corporation 2019, 2020. All Rights Reserved.
# Note to U.S. Government Users Restricted Rights:
# U.S. Government Users Restricted Rights - Use, duplication or disclosure restricted by GSA ADP Schedule
# Contract with IBM Corp.
# Licensed Materials - Property of IBM
# Copyright (c) 2020 Red Hat, Inc.
###############################################################################
set -e

UI_CURRENT_IMAGE=$1

function fold_start() {
  echo -e "travis_fold:start:$1\033[33;1m$2\033[0m"
}

function fold_end() {
  echo -e "\ntravis_fold:end:$1\r"
}

fold_start test-setup "Test Setup"

export OC_CLUSTER_URL=$OCP_CLUSTER_URL
export OC_CLUSTER_USER=$OCP_CLUSTER_USER
export OC_CLUSTER_PASS=$OCP_CLUSTER_PASS

echo "Running oc/install..."
make oc/install
echo "Running oc/login..."
make oc/login

echo "Running docker network create..."
docker network create --subnet 10.10.0.0/16 test-network

echo "Running pull-test-image..."
make pull-test-image

# Use setup script to set variables
. application-ui/setup-env.sh > /dev/null

docker run --network test-network -d --ip 10.10.0.6 -t -i -p 3001:3001 --name application-ui \
-e NODE_ENV=development \
-e headerUrl=$headerUrl \
-e hcmUiApiUrl=$hcmUiApiUrl \
-e searchApiUrl=$searchApiUrl \
-e API_SERVER_URL=$API_SERVER_URL \
-e SERVICEACCT_TOKEN=$SERVICEACCT_TOKEN \
-e OAUTH2_REDIRECT_URL=$OAUTH2_REDIRECT_URL \
-e OAUTH2_CLIENT_ID=$OAUTH2_CLIENT_ID \
-e OAUTH2_CLIENT_SECRET=$OAUTH2_CLIENT_SECRET \
$UI_CURRENT_IMAGE

docker container ls -a

fold_end test-setup

fold_start cypress "Functional Tests"
make run-test-image-pr
fold_end cypress


