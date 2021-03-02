#!/bin/bash

# Copyright (c) 2020 Red Hat, Inc.
# Copyright Contributors to the Open Cluster Management project

# Script to make sure kube resources are

# if [ -z $RESOURCEID ]; then
#     echo 'Please set RESOURCEID'
#     exit 1
# fi

echo "Cleaning up test resources..."

# Create connection resources
oc delete secret ui-test-create-connection-aws -n default

# Create cluster resources
oc delete ui-test-create-cluster-connection-aws -n default
oc delete clusters --all=true -n ui-test-create-cluster-aws
oc delete clusterdeployments --all=true -n ui-test-create-cluster-aws
oc delete secrets --all=true -n ui-test-create-cluster-aws
oc delete endpointconfigs --all=true -n ui-test-create-cluster-aws
oc delete machinepools --all=true -n ui-test-create-cluster-aws
oc delete namespace ui-test-create-cluster-aws

exit 0
