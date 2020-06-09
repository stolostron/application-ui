# Console-UI Cypress Tests

The Cypress tests for [Console-UI](https://github.com/open-cluster-management/console-ui)

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
2. From the root console-ui directory, run `npx cypress open`

#### Local Environment

1.  Follow steps in [Console-UI](https://github.com/open-cluster-management/console-ui) to get the application running locally.
2.  Follow the steps in [Console-API](https://github.com/open-cluster-management/console-api) to get the application running locally.
3. `oc login` to your hub cluster.
4. From the root console-ui directory, run `npx cypress open`

#### Functional vs E2E

Functional tests are primarily used to test behaviors of the UI.  E2E tests are used to test the UIs integrations with other components in RHACM, such as RCM-Controller, Hive, etc.

The default mode in which tests are run is functional, where we are using mock data. If you want to run the tests in the E2E mode, export the following variable:

- CYPRESS_TEST_MODE='e2e'

Afterwards, update the `tests/cypress/config/config.e2e.yaml` file with your configurations (please do not commit your configs to this file).

## Code Coverage

- Coming soon...
