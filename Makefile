###############################################################################
# Licensed Materials - Property of IBM
# (c) Copyright IBM Corporation 2017, 2019. All Rights Reserved.
# US Government Users Restricted Rights - Use, duplication or disclosure 
# restricted by GSA ADP Schedule Contract with IBM Corp.
#
# Contributors:
#  IBM Corporation - initial API and implementation
###############################################################################

include build/Configfile

BROWSER ?= chrome

-include $(shell curl -H 'Authorization: token ${GITHUB_TOKEN}' -H 'Accept: application/vnd.github.v4.raw' -L https://api.github.com/repos/open-cluster-management/build-harness-extensions/contents/templates/Makefile.build-harness-bootstrap -o .build-harness-bootstrap; echo .build-harness-bootstrap)

default::
	@echo "Build Harness Bootstrapped"

USE_VENDORIZED_BUILD_HARNESS ?=

ifndef USE_VENDORIZED_BUILD_HARNESS
-include $(shell curl -s -H 'Authorization: token ${GITHUB_TOKEN}' -H 'Accept: application/vnd.github.v4.raw' -L https://api.github.com/repos/open-cluster-management/build-harness-extensions/contents/templates/Makefile.build-harness-bootstrap -o .build-harness-bootstrap; echo .build-harness-bootstrap)
else
-include vbh/.build-harness-vendorized
endif

install:
	npm install

.PHONY: copyright-check
copyright-check:
	./copyright-check.sh
	
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
