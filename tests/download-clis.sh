#!/bin/bash

# Copyright (c) 2020 Red Hat, Inc.
# Copyright Contributors to the Open Cluster Management project

# Install OpenShift CLI.
echo "Installing oc and kubectl clis..."
curl -kLo oc.tar.gz https://mirror.openshift.com/pub/openshift-v4/clients/ocp/4.4.3/openshift-client-linux-4.4.3.tar.gz
mkdir oc-unpacked
tar -xzf oc.tar.gz -C oc-unpacked
chmod 755 ./oc-unpacked/oc
chmod 755 ./oc-unpacked/kubectl
mv ./oc-unpacked/oc /usr/local/bin/oc
mv ./oc-unpacked/kubectl /usr/local/bin/kubectl
rm -rf ./oc-unpacked ./oc.tar.gz

# Install helm CLI.
# curl -kLo helm-linux-amd64.tar.gz https://${CLUSTER_IP}:${CLUSTER_PORT}/api/cli/helm-linux-amd64.tar.gz
# mkdir helm-unpacked
# tar -xvzf helm-linux-amd64.tar.gz -C helm-unpacked
# chmod 755 ./helm-unpacked/*/helm
# sudo mv ./helm-unpacked/*/helm /usr/local/bin/helm
# rm -rf ./helm-unpacked ./helm-linux-amd64.tar.gz
# helm init

# Setup helm certs
# oc get secret helm-tiller-secret -n kube-system -o json | jq -r .data.crt | base64 --decode > ~/.helm/cert.pem
# oc get secret helm-tiller-secret -n kube-system -o json | jq -r .data.key | base64 --decode > ~/.helm/key.pem

# helm version --tls

# Install htpasswd utility 
apt-get update && apt-get install -y apache2-utils

# Install jq to parse json within bash scripts
curl -o /usr/local/bin/jq http://stedolan.github.io/jq/download/linux64/jq
chmod +x /usr/local/bin/jq

# Install ArgoCD CLI
ARGO_VERSION=$(curl --silent "https://api.github.com/repos/argoproj/argo-cd/releases/latest" | grep '"tag_name"' | sed -E 's/.*"([^"]+)".*/\1/')
LOCAL_OS=$(uname)

echo "$LOCAL_OS, $ARGO_VERSION"

if [[ "$LOCAL_OS" == "Linux" ]]; then
    curl -sSL -o /usr/local/bin/argocd https://github.com/argoproj/argo-cd/releases/download/$ARGO_VERSION/argocd-linux-amd64
elif [[ "$LOCAL_OS" == "Darwin" ]]; then
    curl -sSL -o /usr/local/bin/argocd https://github.com/argoproj/argo-cd/releases/download/$ARGO_VERSION/argocd-darwin-amd64
fi
chmod +x /usr/local/bin/argocd

echo 'set up complete'
