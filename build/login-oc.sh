# Licensed Materials - Property of IBM
# (c) Copyright IBM Corporation 2018, 2019. All Rights Reserved.
# Copyright (c) 2020 Red Hat, Inc
# Note to U.S. Government Users Restricted Rights:
# Use, duplication or disclosure restricted by GSA ADP Schedule
# Contract with IBM Corp.

if [ -z ${K8S_CLUSTER_MASTER_IP} ] || [ -z ${K8S_CLUSTER_USER} ] || [ -z ${K8S_CLUSTER_PASSWORD} ] ; then
    echo 'Error: Missing Env Vars. Please set K8S_CLUSTER_MASTER_IP, K8S_CLUSTER_USER, K8S_CLUSTER_PASSWORD.'
    exit 1
fi

# generate the api server uri if needed
if [ -z ${K8S_API_SERVER} ] ; then
    K8S_API_SERVER=`echo ${K8S_CLUSTER_MASTER_IP} | sed 's/^.*\.apps\./https:\/\/api\./g' | sed 's/\/$//g' | sed 's/$/:6443/' `
fi
# login
echo "oc login --server=${K8S_API_SERVER}"
oc login --server="${K8S_API_SERVER}" --username=${K8S_CLUSTER_USER} --password=${K8S_CLUSTER_PASSWORD} --insecure-skip-tls-verify=true

