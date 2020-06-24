
# Application-UI Cypress Tests

The Cypress tests for [Application-UI](https://github.com/open-cluster-management/application-ui)

## How to run Cypress tests

#### Prerequisites:
- Install Node on MacOS (npm will be installed with Node): `brew install node`
- `npm install`

---

#### Live Cluster

1. Export the following environment variables:
    - CYPRESS_BASE_URL (e.g. `https://multicloud-console.apps.mycluster.dev07.open-cluster-management.com`)
    - CYPRESS_OC_IDP (the desired identity provider group on OCP login page; defaults to `kube:admin` if not set)
    - CYPRESS_OC_CLUSTER_USER (`login username`; defaults to `kubeadmin` if not set)
    - CYPRESS_OC_CLUSTER_PASS (`login password`)
2. From the root application-ui directory, run `npx cypress open`

#### Local Environment

1. Get the application running locally.
2. `oc login` to your hub cluster.
3. From the root application-ui directory, run `npx cypress open`

#### Running Cypress Tests in a Docker Container

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
