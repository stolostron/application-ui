# mcm-ui[![Build Status](https://travis.ibm.com/IBMPrivateCloud/mcm-ui.svg?token=FQtRyxd2oucrshZSEEqZ&branch=master)](https://travis.ibm.com/IBMPrivateCloud/mcm-ui)
The UI micro-service for IBM Hybrid Cloud Manager.

## Design

The UI Platform is developed as an isomorphic react application.  The following major components are used to build this service.

* NodeJS
* Express
* React
* Dust
* Redux
* Webpack 3
* Babel
* Apollo/GraphQL
* Bluemix Carbon
* Jest
* Nightwatch


## Build

<pre>
export ARTIFACTORY_PWD=xxx && npm install
You can get the value of ARTIFACTORY_PWD from: https://ibm.ent.box.com/notes/287638278960
   npm run build
or npm run build:watch
or npm run build:production
</pre>

## Running
1. The localhost redirect ui registration URL was removed by the auth team.  You must configure an existing cluster to support local development.

> 1. SSH into your existing cluster (`make ssh`)
> 2. Install `jq` if not already installed (`sudo apt-get install jq -y`)
> 3. Run the `setup-dev.sh` script in `platform-ui`: `curl https://raw.github.ibm.com/IBMPrivateCloud/platform-ui/master/setup-dev.sh?token=<token> | sudo bash`
>    or copy the script from `https://github.ibm.com/IBMPrivateCloud/platform-ui/blob/master/setup-dev.sh` then execute it
> 4. Copy the environment variables printed at the end of the script and proceed to step 2.

2. The folloing environment variables need to be set. [shared dev env](https://ibm.ent.box.com/notes/291748731101)
<pre>
hcmUiApiUrl=https://localhost:4000/hcmuiapi
cfcRouterUrl
PLATFORM_IDENTITY_PROVIDER_URL
WLP_CLIENT_SECRET
WLP_CLIENT_ID
WLP_REDIRECT_URL=https://localhost:3000/auth/liberty/callback
ARTIFACTORY_USER - mcmdev@us.ibm.com
ARTIFACTORY_PWD - Artifactory API KEY, base64 encoded. You can get this value for functional id mcmdev@us.ibm.com from: https://ibm.ent.box.com/notes/287638278960
</pre>

3. Start the server for production
<pre>
npm run start:production
</pre>

4. Start the server for development, make sure execute both following npm commands
<pre>
npm run build:watch
npm run start
</pre>

5.Open a browser to `https://localhost:{httpPort}/multicloud` and log in using your cluster admin credentials.

## Storybook
<pre>
npm run storybook
</pre>
Launch storybook at: http://localhost:6006/

## Testing

The following will run all unit tests and selenium based tests.  The selenium based tests require the UI running locally or can target a remote cluster.

<pre>
npm run test:unit
npm run test:e2e
</pre>

## NPM Commands

The full list of npm scripts are described below.

| Command                          | Description                                                                                                                      |
|----------------------------------|----------------------------------------------------------------------------------------------------------------------------------|
| `npm start`                      | Starts the application with NODE_ENV='development'                                                                               |
| `npm test:unit`                  | Runs jest tests                                                                                                                  |
| `npm test:update-snapshot`       | Updates snapshots for jest tests. This command should only be used if you have made changes to a component that requires an updated snapshot artifact for a test case.|
| `npm test:e2e`                   | Runs nightwatch e2e tests                                                                                                        |
| `npm run start:production`       | Starts the application with NODE_ENV='production'                                                                                |
| `npm run clean`                  | Deletes the generated files from public folder.                                                                                  |
| `npm run build`                  | Does a FULL development build.  (caching disabled and dev source maps)                                                           |
| `npm run build:production`       | Does a FULL production build.                                                                                                    |
| `npm run build:watch`            | Does a build of application code (w/o the DLL generation) and remains running in the background watching for changes.            |
| `npm run build:dll`              | Only re-builds the the vendor library component.                                                                                 |
| `npm run test:install-selenium`  | Install selenium standalone for running UI tests locally. Automatically invoked during `npm run test:e2e`                        |
| `npm run lint`                   | Runs linting on the code base.                                                                                                   |
| `npm run lint:fix`               | Attempts to fix any linting errors automatically.                                                                                |
| `npm run shrinkwrap:clean`       | Regenerates a clean `npm-shrinkwrap.json` - THIS COMMAND SHOULD ONLY BE USED IN EXTREME CIRCUMSTANCES.                           |
| `npm run storybook`              | Start the storybook  |

> Note: The build process leverages the Dll and DllReference plugins to extract out vendor plugins for faster build times and improved browser caching.  A separate bundle is created for 3rd-party client-side libraries.  The generated bundle is sourced (_public/dll.vendor.js_) along with its manifest (_vendor-manifest.json_).  If new client dependencies are added or existing versions of dependencies are updated this module needs be regenerated and recommitted back into source control via  `npm run build:dll`.

## Links

These are a few useful links that will help provide technical reference and best practices when developing for the platform.

- [Carbon Components](https://github.com/carbon-design-system/carbon-components)
- [Carbon React Components](https://github.com/carbon-design-system/carbon-components-react)
- [Webpack](https://webpack.js.org)
- [React Docs](https://facebook.github.io/react/docs/hello-world.html)
- [Thinking in React](https://facebook.github.io/react/docs/thinking-in-react.html)
- [Redux](http://redux.js.org)
- [Structuring Redux State](https://hackernoon.com/avoiding-accidental-complexity-when-structuring-your-app-state-6e6d22ad5e2a)
- [React Best Practices](https://engineering.musefind.com/our-best-practices-for-writing-react-components-dec3eb5c3fc8)
- [Smart and Dumb Components](https://medium.com/@dan_abramov/smart-and-dumb-components-7ca2f9a7c7d0)
- [Redux Best Practices](https://medium.com/@kylpo/redux-best-practices-eef55a20cc72)

