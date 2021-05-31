#!/bin/bash
# Copyright (c) 2021 Red Hat, Inc.
# Copyright Contributors to the Open Cluster Management project

set -e

UI_CURRENT_IMAGE=$1


###############################################################################
# Install oc and Cluster Keeper
###############################################################################
echo "Install oc and Cluster Keeper"

echo "Running oc/install..."
# make oc/install
echo "Cloning Cluster Keeper"
git clone https://github.com/open-cluster-management/cluster-keeper.git
pushd cluster-keeper
cat > user.env << EOF
CLUSTERPOOL_CLUSTER=$CLUSTERPOOL_HOST_API
CLUSTERPOOL_TARGET_NAMESPACE=$CLUSTERPOOL_HOST_NAMESPACE
CLUSTERCLAIM_GROUP_NAME=$CLUSTERPOOL_GROUP_NAME
EOF
export PATH=${PATH}:$(pwd)
popd

###############################################################################
# Test Setup
###############################################################################

echo $SHARED_DIR

# Hub cluster
export KUBECONFIG="${SHARED_DIR}/hub-1.kc"
HUB_CREDS=$(cat "${SHARED_DIR}/hub-1.json")

export OC_CLUSTER_URL=$(echo $HUB_CREDS | jq -r '.api_url')
export OC_CLUSTER_USER=$(echo $HUB_CREDS | jq -r '.username')
export OC_CLUSTER_PASS=$(echo $HUB_CREDS | jq -r '.password')

# Workaround for "error: x509: certificate signed by unknown authority" problem with oc login
mkdir -p ${HOME}/certificates
OAUTH_POD=$(oc -n openshift-authentication get pods -o jsonpath='{.items[0].metadata.name}')
export OC_CLUSTER_INGRESS_CA=/certificates/ingress-ca.crt
oc rsh -n openshift-authentication $OAUTH_POD cat /run/secrets/kubernetes.io/serviceaccount/ca.crt > ${HOME}${OC_CLUSTER_INGRESS_CA}

# managed cluster
MANAGED_CREDS=$(cat "${SHARED_DIR}/managed-1.json")
export CYPRESS_MANAGED_OCP_URL=$(echo $MANAGED_CREDS | jq -r '.api_url')
export CYPRESS_MANAGED_OCP_USER=$(echo $MANAGED_CREDS | jq -r '.username')
export CYPRESS_MANAGED_OCP_PASS=$(echo $MANAGED_CREDS | jq -r '.password')


echo "Running oc/install..."
make oc/install
echo "Running oc/login..."
make oc/login

echo "Running pull-test-image..."
make pull-test-image

# Use setup script to set variables
. ./setup-env.sh > /dev/null

echo "Functional Tests"
make run-test-image-pr