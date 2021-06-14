#!/usr/bin/env bash
# Copyright (c) 2021 Red Hat, Inc.
# Copyright Contributors to the Open Cluster Management project

function errEcho {
  echo >&2 "$@"
}

function usage {
  errEcho "usage: $(basename ${0}) [-l] HUB MANAGED"
  errEcho
  errEcho "    You must supply the name of the ClusterClaims for a hub and managed cluster."
  errEcho "    Use the -l option to run against localhost."
  exit 1
}

if ! jq --version > /dev/null 2>&1; then
  errEcho "Missing dependency: jq"
  exit 1
elif ! oc version > /dev/null 2>&1; then
  errEcho "Missing dependency: oc"
  exit 1
elif ! ck current > /dev/null 2>&1; then
  errEcho "Missing dependency: ck"
  exit 1
fi

while getopts :l o 
do case "$o" in
  l)  LOCAL="true";;
  [?]) usage;;
  esac
done
shift $(($OPTIND - 1))

HUB=$1
MANAGED=$2
if [[ -z $HUB || -z $MANAGED ]]
then
  usage
fi

set -e

cd tests

# Set up kubeconfig for managed cluster
rm -f cypress/config/import-kubeconfig/kubeconfig
cp $(ck kubeconfig $MANAGED) cypress/config/import-kubeconfig/

# Set up certificate for hub
OAUTH_POD=$(ck with $HUB oc -n openshift-authentication get pods -o jsonpath='{.items[0].metadata.name}')
export CYPRESS_OC_CLUSTER_INGRESS_CA=$(pwd)/cypress/config/certificates/ingress-ca.crt
ck with $HUB oc rsh -n openshift-authentication $OAUTH_POD cat /run/secrets/kubernetes.io/serviceaccount/ca.crt > $CYPRESS_OC_CLUSTER_INGRESS_CA

if [[ -z $CYPRESS_JOB_ID ]]
then
  export CYPRESS_JOB_ID=$(whoami)
fi

if [[ -z $CYPRESS_BASE_URL ]]
then
  if [[ -n $LOCAL ]]
  then
    PROTOCOL=http
    if [[ ($serverKey || -f '../sslcert/server.key') && ($serverCert || -f '../sslcert/server.crt') ]]
    then
      PROTOCOL=https
    fi
    export CYPRESS_BASE_URL=${PROTOCOL}://localhost:3001
  else
    export CYPRESS_BASE_URL=$(ck acm -d $HUB)
  fi
fi

if [[ -z $CYPRESS_OC_CLUSTER_URL ]]
then
  export CYPRESS_OC_CLUSTER_URL=$(ck creds -c -p api_url $HUB)
fi

if [[ -z $CYPRESS_OC_CLUSTER_USER ]]
then
  export CYPRESS_OC_CLUSTER_USER=$(ck creds -c -p username $HUB)
fi

if [[ -z $CYPRESS_OC_CLUSTER_PASS ]]
then
  export CYPRESS_OC_CLUSTER_PASS=$(ck creds -c -p password $HUB)
fi

npx cypress open
