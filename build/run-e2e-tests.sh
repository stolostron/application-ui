#!/bin/bash
set -e

export DOCKER_IMAGE_AND_TAG=${1}

echo "TODO : run make docker/run"
sudo make -C tests install-oc
make -C tests login-oc
#make docker/run