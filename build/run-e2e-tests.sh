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

make docker/login
export DOCKER_URI=quay.io/open-cluster-management/application-ui:latest
make docker/pull

echo "Running pull-test-image..."
make pull-test-image

export TEST_LOCAL=true
export USE_USER=kube:admin
export SERVICEACCT_TOKEN=`${BUILD_HARNESS_PATH}/vendor/oc whoami --show-token`
echo "SERVICEACCT_TOKEN=$SERVICEACCT_TOKEN"

#application-ui
docker run --network test-network -d --ip 10.10.0.6 -t -i -p 3000:3000 --name application-ui \
-e NODE_ENV=development \
-e SERVICEACCT_TOKEN=$SERVICEACCT_TOKEN \
-e headerUrl=$headerUrl \
-e OAUTH2_REDIRECT_URL=https://localhost:3000/multicloud/auth/callback \
-e hcmUiApiUrl=https://10.10.0.5:4000/hcmuiapi \
-e OAUTH2_CLIENT_ID=multicloudingress \
-e OAUTH2_CLIENT_SECRET=multicloudingresssecret \
-e API_SERVER_URL=$OC_CLUSTER_URL $UI_CURRENT_IMAGE
docker container ls -a

fold_end test-setup

fold_start cypress "Functional Tests"
make run-test-image-pr
fold_end cypress


