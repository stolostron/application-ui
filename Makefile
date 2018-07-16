###############################################################################
# Licensed Materials - Property of IBM Copyright IBM Corporation 2017, 2018. All Rights Reserved.
# U.S. Government Users Restricted Rights - Use, duplication or disclosure restricted by GSA ADP
# Schedule Contract with IBM Corp.
#
# Contributors:
#  IBM Corporation - initial API and implementation
###############################################################################

include Configfile

SHELL := /bin/bash

.PHONY: copyright-check
copyright-check:
	./copyright-check.sh

lint:
	npm run lint

install:
	npm install

prune:
	npm prune --production


.PHONY: my-version
my-version:
	$(eval IMAGE_VERSION := $(shell git rev-parse --short HEAD))

app-version: my-version


.PHONY: build
build:
	npm run build:production

image:: build lint prune

push: check-env app-version

.PHONY: run
run: check-env app-version
	docker run \
	-e NODE_ENV=development \
	-e cfcRouterUrl=$(cfcRouterUrl) \
	-e PLATFORM_IDENTITY_PROVIDER_URL=$(PLATFORM_IDENTITY_PROVIDER_URL) \
	-e WLP_CLIENT_ID=$(WLP_CLIENT_ID) \
	-e WLP_CLIENT_SECRET=$(WLP_CLIENT_SECRET) \
	-e WLP_REDIRECT_URL=$(WLP_REDIRECT_URL) \
	-e hcmUiApiUrl=$(hcmUiApiUrl) \
	-d -p $(HOST):$(APP_PORT):$(CONTAINER_PORT) $(IMAGE_REPO)/$(IMAGE_NAME_ARCH):$(IMAGE_VERSION)

push: check-env app-version

.PHONY: test
test:
	npm install \
	del@3.0.0 \
	enzyme@3.3.0 \
	enzyme-adapter-react-16@1.1.1 \
	jest@22.4.2 \
	react-test-renderer@16.2.0 \
	jsonfile@4.0.0 \
	redux-mock-store@1.5.1 \
	jest-tap-reporter@1.9.0 \
	properties-parser@0.3.1
ifeq ($(UNIT_TESTS), TRUE)
	if [ ! -d "test-output" ]; then \
		mkdir test-output; \
	fi
	npm test
endif
ifeq ($(SELENIUM_TESTS), TRUE)
ifeq ($(ARCH), x86_64)
	npm install selenium-standalone@6.12.0 xml2json@0.11.0 nightwatch@0.9.20
	nightwatch
endif
endif

include Makefile.docker
include Makefile.cicd
