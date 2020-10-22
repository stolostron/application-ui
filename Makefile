###############################################################################
# Licensed Materials - Property of IBM
# (c) Copyright IBM Corporation 2017, 2019. All Rights Reserved.
# US Government Users Restricted Rights - Use, duplication or disclosure 
# restricted by GSA ADP Schedule Contract with IBM Corp.
# Copyright (c) 2020 Red Hat, Inc.
#
# Contributors:
#  IBM Corporation - initial API and implementation
###############################################################################

include build/Configfile

BROWSER ?= chrome

USE_VENDORIZED_BUILD_HARNESS ?=

ifndef USE_VENDORIZED_BUILD_HARNESS
-include $(shell curl -s -H 'Authorization: token ${GITHUB_TOKEN}' -H 'Accept: application/vnd.github.v4.raw' -L https://api.github.com/repos/open-cluster-management/build-harness-extensions/contents/templates/Makefile.build-harness-bootstrap -o .build-harness-bootstrap; echo .build-harness-bootstrap)
else
-include vbh/.build-harness-bootstrap
endif

TEST_IMAGE_TAG ?= $(COMPONENT_VERSION)$(COMPONENT_TAG_EXTENSION)

default::
	@echo "Build Harness Bootstrapped"

install:
	npm install

.PHONY: copyright-check
copyright-check:
	./copyright-check.sh $(TRAVIS_BRANCH)
	
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
	docker build tests/ \
	-f Dockerfile.cypress \
	-t $(COMPONENT_DOCKER_REPO)/$(COMPONENT_NAME)-tests:$(TEST_IMAGE_TAG) \

.PHONY: run-test-image
run-test-image:
	docker run \
	-e BROWSER=$(BROWSER) \
	-v $(shell pwd)/options.yaml:/resources/options.yaml \
	-v $(shell pwd)/results/:/results/ \
	$(COMPONENT_DOCKER_REPO)/$(COMPONENT_NAME)-tests:$(TEST_IMAGE_TAG)

.PHONY: run-test-image-pr
run-test-image-pr:
	docker run \
	-v $(shell pwd)/results/:/results/ \
	--network host \
	-e BROWSER=$(BROWSER) \
	-e USER=$(shell git log -1 --format='%ae') \
	-e SLACK_TOKEN=$(SLACK_TOKEN) \
	-e GITHUB_TOKEN=$(GITHUB_TOKEN) \
	-e TRAVIS_BUILD_WEB_URL=$(TRAVIS_BUILD_WEB_URL) \
	-e TRAVIS_REPO_SLUG=$(TRAVIS_REPO_SLUG) \
	-e TRAVIS_PULL_REQUEST=$(TRAVIS_PULL_REQUEST) \
	-e CYPRESS_TEST_MODE=functional \
	-e CYPRESS_BASE_URL=https://localhost:3001 \
	-e CYPRESS_OC_CLUSTER_URL=$(OC_CLUSTER_URL) \
	-e CYPRESS_JOB_ID=$(TRAVIS_JOB_ID) \
	-e CYPRESS_OC_CLUSTER_USER=$(OC_CLUSTER_USER) \
	-e CYPRESS_OC_CLUSTER_PASS=$(OC_CLUSTER_PASS) \
	-e CYPRESS_OC_IDP=$(CYPRESS_OC_IDP) \
	-e CYPRESS_MANAGED_OCP_URL=$(CYPRESS_MANAGED_OCP_URL) \
	-e CYPRESS_MANAGED_OCP_USER=$(CYPRESS_MANAGED_OCP_USER) \
	-e CYPRESS_MANAGED_OCP_PASS=$(CYPRESS_MANAGED_OCP_PASS) \
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
