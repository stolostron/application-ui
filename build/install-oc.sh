# Licensed Materials - Property of IBM
# (c) Copyright IBM Corporation 2018, 2019. All Rights Reserved.
# Copyright (c) 2020 Red Hat, Inc
# Note to U.S. Government Users Restricted Rights:
# Use, duplication or disclosure restricted by GSA ADP Schedule
# Contract with IBM Corp.

if [ -z $DOCKER_USER ] || [ -z $DOCKER_PASS ]; then
    echo 'Please set DOCKER_USER and DOCKER_PASS' 
    exit 1
fi
if [ -z $DOCKER_IMAGE_AND_TAG ]; then
    echo 'Please set DOCKER_IMAGE_AND_TAG'
    exit 1
fi

echo 'check oc'
which oc && exit 0

# login & pull image
echo "docker login $DOCKER_IMAGE_AND_TAG"
docker login  quay.io/open-cluster-management -u $DOCKER_USER -p $DOCKER_PASS
echo 'pulling image'
docker pull $DOCKER_IMAGE_AND_TAG

echo 'download oc from kui image'
[ -d downloads ] || mkdir -p downloads
docker cp $(docker run -d $DOCKER_IMAGE_AND_TAG sleep 100):/usr/local/bin/oc downloads/oc
cp downloads/oc /usr/local/bin/oc
