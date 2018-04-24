###############################################################################
# Licensed Materials - Property of IBM Copyright IBM Corporation 2017. All Rights Reserved.
# U.S. Government Users Restricted Rights - Use, duplication or disclosure restricted by GSA ADP
# Schedule Contract with IBM Corp.
#
# Contributors:
#  IBM Corporation - initial API and implementation
###############################################################################

include Configfile

SHELL := /bin/bash

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

.PHONY: run
run: check-env app-version
	docker run \
	-e NODE_ENV=development \
	-e cfcRouterUrl=$(cfcRouterUrl) \
	-e PLATFORM_IDENTITY_PROVIDER_URL=$(PLATFORM_IDENTITY_PROVIDER_URL) \
	-e WLP_CLIENT_ID=$(WLP_CLIENT_ID) \
	-e WLP_CLIENT_SECRET=$(WLP_CLIENT_SECRET) \
	-e WLP_REDIRECT_URL=$(WLP_REDIRECT_URL) \
	-d -p $(HOST):$(APP_PORT):$(CONTAINER_PORT) $(IMAGE_REPO)/$(IMAGE_NAME):$(IMAGE_VERSION)

push: check-env app-version

.PHONY: test
test:
	npm test

include Makefile.docker
