
# Application-UI Cypress Tests

This is the project for the End-to-end (E2E) Cypress tests for [Application-UI](https://github.com/open-cluster-management/application-ui)

The tests can be run locally and also are containerized in Docker for running on the Travis CI pipeline. On Travis, each PR build creates an appiication-ui image which is run using Docker, and another application-ui-tests image is built and also run on Docker, pointing to the application-ui image. The intent is that the tests will be run on new code every build.

For running tests locally for general testing, or development of test cases, the local environment can be configured to run on a hub cluster that has application-ui running. It can also be pointing to a local deployment that points to a hub cluster.

## How to run Cypress tests

#### Prerequisites:
- Install Node on MacOS (npm will be installed with Node): `brew install node`
- `npm install`
- oc - OpenShift CLI
---

#### Running Cypress tests on a live hub cluster

1. Export the following environment variables:
	- `export CYPRESS_BASE_URL=https://multicloud-console.apps.hli-test.dev06.red-chesterfield.com/` (URL of a working cluster)
	- `export CYPRESS_OC_CLUSTER_USER=kubeadmin`
	- `export CYPRESS_OC_CLUSTER_PASS=xxxxxxxxx`
2. From the root application-ui directory, run `npx cypress open`

#### Running Cypress tests on a local environment

The environment variables are similar to running on the live cluster, however in order to run Cypress tests on a local environment, 

1. Deploy the application-ui locally either by running `npm start` or running the application-ui using a Docker image
2. `oc login` to the hub cluster the local environment is pointing to. For local instances, an authenticated token is required.  
	- Example: `oc login --token=xxxxxxx --server=https://api.hli-test.dev06.red-chesterfield.com:6443`
3. Export the following environment variables:
	- `export CYPRESS_BASE_URL=https://localhost:3001`
	- `export CYPRESS_OC_CLUSTER_USER=kubeadmin`
	- `export CYPRESS_OC_CLUSTER_PASS=xxxxxxxxx`
	- `export CYPRESS_OC_CLUSTER_URL=https://api.hli-test.dev06.red-chesterfield.com:6443` (API of the cluster that the local env points to needs to be specified)
4. From the root application-ui directory, run `npx cypress open`

#### Building and Running Cypress tests in a Docker Container

1. Create an options.yaml file in /application-ui/, this is a configuration file that is used by the Docker container, the following is an example: 

       options:
       hub:
	       name: multicloud-console
	       baseDomain: definite-oarfish.dev06.red-chesterfield.com
	       user: kubeadmin
	       password: xxxxxxx
	       idp: ocp

2. From the /application-ui/ directory, run `make build-test-image` this will build the Docker container with the Cypress tests inside /application-ui/tests/
3. Export the following environment variables:
	- BROWSER (web browser to be used, optional, it will default to Chrome)
	- COMPONENT_DOCKER_REPO (some unique value for local Docker container)
	- COMPONENT_NAME (some unique value for local Docker container)
	- TEST_IMAGE_TAG (some unique value for local Docker container)
4. Run `make run-test-image` to run the Docker container. 
5. Alternatively, you can manually from the command line using this command: `docker run \
	-e BROWSER=$(BROWSER) \
	-v $(shell pwd)/options.yaml:/resources/options.yaml \
	-v $(shell pwd)/results/:/results/ \
	$(COMPONENT_DOCKER_REPO)/$(COMPONENT_NAME)-tests:$(TEST_IMAGE_TAG)`
6. After running, the XML results, screenshots and videos will be copied from inside the Docker container into /application-ui/results/

## Code Coverage

- Coming soon...
