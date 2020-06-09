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
3. `oc login` to your hub cluster.
4. From the root application-ui directory, run `npx cypress open`

## Code Coverage

- Coming soon...
