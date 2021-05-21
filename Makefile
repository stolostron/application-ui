###############################################################################
# Licensed Materials - Property of IBM
# (c) Copyright IBM Corporation 2017, 2019. All Rights Reserved.
# US Government Users Restricted Rights - Use, duplication or disclosure 
# restricted by GSA ADP Schedule Contract with IBM Corp.
#
# Contributors:
#  IBM Corporation - initial API and implementation
###############################################################################
# Copyright (c) 2020 Red Hat, Inc.
# Copyright Contributors to the Open Cluster Management project
include build/Configfile

BROWSER ?= chrome

USE_VENDORIZED_BUILD_HARNESS ?=

ifndef USE_VENDORIZED_BUILD_HARNESS
-include $(shell curl -s -H 'Accept: application/vnd.github.v4.raw' -L https://api.github.com/repos/open-cluster-management/build-harness-extensions/contents/templates/Makefile.build-harness-bootstrap -o .build-harness-bootstrap; echo .build-harness-bootstrap)
else
-include vbh/.build-harness-bootstrap
endif

TEST_IMAGE_TAG ?= $(COMPONENT_VERSION)$(COMPONENT_TAG_EXTENSION)

default::
	@echo "Build Harness Bootstrapped"

install:
	npm install
	
lint:
	npm run lint

prune:
	npm prune --production

build-prod:
	npm run build:production

unit-test:
	if [ ! -d "test-output" ]; then \
		mkdir test-output; \
	fi
	npm test

.PHONY: e2e-test
e2e-test:
	if [ ! -d "test-output" ]; then \
		mkdir test-output; \
	fi
	npm run test:$(BROWSER)

.PHONY: build-test-image
build-test-image:
	@echo "Building $(COMPONENT_DOCKER_REPO)/$(COMPONENT_NAME)-tests:$(TEST_IMAGE_TAG)"
	docker build \
	-f Dockerfile.cypress \
	-t $(COMPONENT_DOCKER_REPO)/$(COMPONENT_NAME)-tests:$(TEST_IMAGE_TAG) \

.PHONY: run-test-image
run-test-image:
	docker run \
	-e BROWSER=$(BROWSER) \
	-v $(shell pwd)/results/:/results/ \
	$(COMPONENT_DOCKER_REPO)/$(COMPONENT_NAME)-tests:$(TEST_IMAGE_TAG)

.PHONY: run-test-image-pr
run-test-image-pr: # Suppress output as this contains sensitive information
	@docker run \
	-v $(shell pwd)/results/:/results/ \
	-v $(HOME)/certificates/:/certificates/ \
	--network host \
	-e BROWSER=$(BROWSER) \
	-e USER=$(shell git log -1 --format='%ae') \
	-e SLACK_TOKEN=$(SLACK_TOKEN) \
	-e TRAVIS_BUILD_WEB_URL=$(TRAVIS_BUILD_WEB_URL) \
	-e TRAVIS_REPO_SLUG=$(TRAVIS_REPO_SLUG) \
	-e TRAVIS_PULL_REQUEST=$(TRAVIS_PULL_REQUEST) \
	-e CYPRESS_RBAC_TEST=$(CYPRESS_RBAC_TEST) \
	-e CYPRESS_TEST_MODE=functional \
	-e CYPRESS_JOB_ID=$(TRAVIS_JOB_ID) \
	-e CYPRESS_BASE_URL=$(CYPRESS_BASE_URL) \
	-e CYPRESS_OC_CLUSTER_URL=$(OC_CLUSTER_URL) \
	-e CYPRESS_OC_CLUSTER_USER=$(OC_CLUSTER_USER) \
	-e CYPRESS_OC_CLUSTER_PASS=$(OC_CLUSTER_PASS) \
	-e CYPRESS_OC_CLUSTER_INGRESS_CA=$(OC_CLUSTER_INGRESS_CA) \
	-e CYPRESS_OC_IDP=$(CYPRESS_OC_IDP) \
	-e CYPRESS_MANAGED_OCP_URL=$(CYPRESS_MANAGED_OCP_URL) \
	-e CYPRESS_MANAGED_OCP_USER=$(CYPRESS_MANAGED_OCP_USER) \
	-e CYPRESS_MANAGED_OCP_PASS=$(CYPRESS_MANAGED_OCP_PASS) \
	-e GITHUB_USER=$(GITHUB_USER) \
	-e GITHUB_TOKEN=$(GITHUB_TOKEN) \
	-e GITHUB_PRIVATE_URL=https://github.com/open-cluster-management/app-ui-e2e-private-git \
	-e OBJECTSTORE_PRIVATE_URL=$(OBJECTSTORE_PRIVATE_URL) \
	-e OBJECTSTORE_ACCESS_KEY=$(OBJECTSTORE_ACCESS_KEY) \
	-e OBJECTSTORE_SECRET_KEY=$(OBJECTSTORE_SECRET_KEY) \
	-e HELM_PRIVATE_URL=https://raw.githubusercontent.com/open-cluster-management/app-ui-e2e-private-helm/master \
	-e HELM_USERNAME=$(GITHUB_USER) \
	-e HELM_PASSWORD=$(GITHUB_TOKEN) \
	-e HELM_CHART_NAME=mychart \
	-e ANSIBLE_URL="${ANSIBLE_URL}" \
  	-e ANSIBLE_TOKEN="${ANSIBLE_TOKEN}" \
	$(COMPONENT_DOCKER_REPO)/$(COMPONENT_NAME)-tests:$(TEST_IMAGE_TAG)

.PHONY: push-test-image
push-test-image:
	make component/push COMPONENT_NAME=$(COMPONENT_NAME)-tests

.PHONY: pull-test-image
pull-test-image:
	make component/pull COMPONENT_NAME=$(COMPONENT_NAME)-tests

.PHONY: publish-test-image
publish-test-image:
	rm -rf pipeline
	make pipeline-manifest/update COMPONENT_NAME=$(COMPONENT_NAME)-tests PIPELINE_MANIFEST_COMPONENT_SHA256=${TRAVIS_COMMIT} PIPELINE_MANIFEST_COMPONENT_REPO=${TRAVIS_REPO_SLUG} PIPELINE_MANIFEST_BRANCH=${TRAVIS_BRANCH}

.PHONY: build-image
build-image:
	@echo "Building $(COMPONENT_DOCKER_REPO)/$(COMPONENT_NAME):$(IMAGE_TAG)"
	docker build . \
	-f Dockerfile \
	-t $(COMPONENT_DOCKER_REPO)/$(COMPONENT_NAME):$(IMAGE_TAG) \