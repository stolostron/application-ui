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

-include $(shell curl -H 'Authorization: token ${GITHUB_TOKEN}' -H 'Accept: application/vnd.github.v4.raw' -L https://api.github.com/repos/open-cluster-management/build-harness-extensions/contents/templates/Makefile.build-harness-bootstrap -o .build-harness-bootstrap; echo .build-harness-bootstrap)

default::
	@echo "Build Harness Bootstrapped"

install:
	npm install

.PHONY: copyright-check
copyright-check:
	./copyright-check.sh $(TRAVIS_BRANCH) $(TRAVIS_PULL_REQUEST_BRANCH)
	
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
