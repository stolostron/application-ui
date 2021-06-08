#!/bin/bash
# Copyright (c) 2021 Red Hat, Inc.
# Copyright Contributors to the Open Cluster Management project

set -e

###############################################################################
# Test Setup
###############################################################################

echo $SHARED_DIR

BROWSER ?= chrome
OCM_NAMESPACE=open-cluster-management
OCM_ROUTE=multicloud-console
OCM_ADDRESS=https://`oc -n $OCM_NAMESPACE get route $OCM_ROUTE -o json | jq -r '.spec.host'`

PULL_NUMBER=$(PULL_NUMBER)

# Hub cluster
export KUBECONFIG="${SHARED_DIR}/hub-1.kc"
HUB_CREDS=$(cat "${SHARED_DIR}/hub-1.json")
export CYPRESS_BASE_URL=$(OCM_ADDRESS) \
export CYPRESS_OC_CLUSTER_URL=$(echo $HUB_CREDS | jq -r '.api_url')
export CYPRESS_OC_CLUSTER_USER=$(echo $HUB_CREDS | jq -r '.username')
export CYPRESS_OC_CLUSTER_PASS=$(echo $HUB_CREDS | jq -r '.password')

# Cypress environment variables
export ANSIBLE_URL=$(cat "/etc/e2e-secrets/ansible-url") \
export ANSIBLE_TOKEN=$(cat "/etc/e2e-secrets/ansible-token") \
export BROWSER=$(BROWSER) \
export CYPRESS_JOB_ID=$(PROW_JOB_ID) \
# maybe not used - have to check
# export CYPRESS_OC_IDP=$(cat "/etc/e2e-secrets/cypress-oc-idp") \
export CYPRESS_RBAC_TEST=$(cat "/etc/e2e-secrets/cypress-rbac-test") \
export CYPRESS_TEST_MODE=functional \
export GITHUB_PRIVATE_URL=$(cat "/etc/e2e-secrets/github-private-url") \
export GITHUB_USER=$(cat "/etc/e2e-secrets/github-user") \
export GITHUB_TOKEN=$(cat "/etc/e2e-secrets/github-token") \
export HELM_PRIVATE_URL=$(cat "/etc/e2e-secrets/helm-private-url") \
export HELM_USERNAME=$(cat "/etc/e2e-secrets/github-user") \
export HELM_PASSWORD=$(cat "/etc/e2e-secrets/github-token") \
export HELM_CHART_NAME=$(cat "/etc/e2e-secrets/helm-chart-name") \
export OBJECTSTORE_PRIVATE_URL=$(cat "/etc/e2e-secrets/objectstore-private-url") \
export OBJECTSTORE_ACCESS_KEY=$(cat "/etc/e2e-secrets/objectstore-access-key") \
export OBJECTSTORE_SECRET_KEY=$(cat "/etc/e2e-secrets/objectstore-secret-key") \
export SLACK_TOKEN=$(cat "/etc/e2e-secrets/slack-token") \
export PULL_NUMBER=$(PULL_NUMBER) \
export USER=$(shell git log -1 --format='%ae') \

# Workaround for "error: x509: certificate signed by unknown authority" problem with oc login
mkdir -p ${HOME}/certificates
OAUTH_POD=$(oc -n openshift-authentication get pods -o jsonpath='{.items[0].metadata.name}')
export CYPRESS_OC_CLUSTER_INGRESS_CA=/certificates/ingress-ca.crt
oc rsh -n openshift-authentication $OAUTH_POD cat /run/secrets/kubernetes.io/serviceaccount/ca.crt > ${HOME}${OC_CLUSTER_INGRESS_CA}

# managed cluster
MANAGED_CREDS=$(cat "${SHARED_DIR}/managed-1.json")
export CYPRESS_MANAGED_OCP_URL=$(echo $MANAGED_CREDS | jq -r '.api_url')
export CYPRESS_MANAGED_OCP_USER=$(echo $MANAGED_CREDS | jq -r '.username')
export CYPRESS_MANAGED_OCP_PASS=$(echo $MANAGED_CREDS | jq -r '.password')

echo "Functional Tests"
./start-cypress-tests.sh