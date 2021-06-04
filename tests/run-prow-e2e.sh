#!/bin/bash
# Copyright (c) 2021 Red Hat, Inc.
# Copyright Contributors to the Open Cluster Management project

set -e

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

echo "Running oc/login..."
make oc/login

echo "Functional Tests"
./start-cypress-tests.sh