#!/usr/bin/env bash
# Copyright (c) 2021 Red Hat, Inc.

function errEcho {
  echo >&2 "$@"
}

if ! jq --version > /dev/null 2>&1; then
  errEcho "Missing dependency: jq"
  exit 1
elif ! oc version > /dev/null 2>&1; then
  errEcho "Missing dependency: oc"
  exit 1
elif ! cm current > /dev/null 2>&1; then
  errEcho "Missing dependency: cm"
  exit 1
fi

HUB=$1
MANAGED=$2
if [[ -z $HUB || -z $MANAGED ]]
then
  errEcho "usage: $(basename ${0}) HUB MANAGED"
  errEcho
  errEcho "    You must supply the name of the ClusterClaims for a hub and managed cluster."
  errEcho
  exit 1
fi

set -e

cd tests

# Set up kubeconfig for managed cluster
rm -f cypress/config/import-kubeconfig/kubeconfig
cp $(cm kubeconfig $MANAGED) cypress/config/import-kubeconfig/

# Set up certificate for hub
OAUTH_POD=$(cm with $HUB oc -n openshift-authentication get pods -o jsonpath='{.items[0].metadata.name}')
export CYPRESS_OC_CLUSTER_INGRESS_CA=$(pwd)/cypress/config/certificates/ingress-ca.crt
cm with $HUB oc rsh -n openshift-authentication $OAUTH_POD cat /run/secrets/kubernetes.io/serviceaccount/ca.crt > $CYPRESS_OC_CLUSTER_INGRESS_CA

if [[ -z $CYPRESS_JOB_ID ]]
then
  export CYPRESS_JOB_ID=$(whoami)
fi

if [[ -z $CYPRESS_BASE_URL ]]
then
  export CYPRESS_BASE_URL=$(cm acm -d $HUB)
fi

if [[ -z $CYPRESS_OC_CLUSTER_URL ]]
then
  export CYPRESS_OC_CLUSTER_URL=$(cm creds -p api_url $HUB)
fi

if [[ -z $CYPRESS_OC_CLUSTER_USER ]]
then
  export CYPRESS_OC_CLUSTER_USER=$(cm creds -p username $HUB)
fi

if [[ -z $CYPRESS_OC_CLUSTER_PASS ]]
then
  export CYPRESS_OC_CLUSTER_PASS=$(cm creds -p password $HUB)
fi

npx cypress open
