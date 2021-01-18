# application-ui [![Build Status](https://travis-ci.com/open-cluster-management/application-ui.svg?token=zz7o8y9oX6xWxP1o2gF2&branch=master)](https://travis-ci.com/open-cluster-management/application-ui)
The UI service for Application Lifecycle

## Design

The UI Platform is developed as an isomorphic react application.  The following major components are used to build this service. Test

* NodeJS
* Express
* React
* Handlebars
* Redux
* Webpack
* Babel
* Apollo/GraphQL
* IBM Carbon Design System
* Red Hat PatternFly
* Jest


## Build

<pre>
npm install
   npm run build
or npm run build:watch
or npm run build:production
</pre>

## Running

1. To run your local `application-ui` code against an existing ACM installation, make sure you are logged in using `oc` then source the `setup-env.sh` script.
   ```
   . ./setup-env.sh
   ```
   This will automatically set up the redirect URL and export all required environment variables, allowing you to skip the next 2 steps. The variables are also printed out as JSON in case you prefer to set them up in a VS Code launch configuration as described below.

   The script works in `zsh` or `bash` and requires `oc` and `jq`.

   By default, the script sets the `hcmUiApiURL` variable to use the running ACM. To use local `console-api`, unset this variable.
   ```
   unset hcmUiApiUrl
   ```

2. Add your `application-ui` redirect link to your hub's oauthclient multicloudingress if it does not already exist there
   <pre>
   oc edit oauthclient multicloudingress -n open-cluster-management

   (Add "- https://localhost:3001/multicloud/applications/auth/callback" to "redirectURIs:" list)
   </pre>

3. The following environment variables need to be set. [shared dev env](https://ibm.ent.box.com/notes/291748731101)
    <pre>
    export OAUTH2_CLIENT_ID=
    export OAUTH2_CLIENT_SECRET=
    export OAUTH2_REDIRECT_URL=https://localhost:3001/multicloud/applications/auth/callback

    #for local testing, from ocp login token
    export API_SERVER_URL=
    export SERVICEACCT_TOKEN=
    export NODE_ENV=development

    #search and mcm-ui-api
    export searchApiUrl=`<searchAPIRouteEndpoint>/searchapi/graphql`
    export hcmUiApiUrl=`<searchAPIRouteEndpoint>/hcmuiapi`
    </pre>

    For vscode users, these variables can be set in your local VS Code enviroment using the launch.json in the .vscode directory. To create a launch.json file, open your project folder in VS Code (File > Open Folder) and then select the Configure gear icon on the Run view top bar.  If you go back to the File Explorer view (Ctrl+Shift+E), you'll see that VS Code has created a .vscode folder and added the launch.json file to your workspace.

    Use a map, `env:{}` , in launch.json to contain your environment variables.
    <pre>
    {
        "version": "0.2.0",
        "configurations": [
        {
            "type": "node",
            "request": "launch",
            "name": "",
            "program": "${workspaceFolder}/app.js",
            "env": {
            "hcmUiApiUrl": "https://localhost:4000/hcmuiapi",
            "searchApiUrl": "https://localhost:4010/searchapi",
            "NODE_ENV": "",
            "leftNav": "",
            "headerUrl": "",
            "OAUTH2_REDIRECT_URL": "https://localhost:3001/multicloud/applications/auth/callback",
            "OAUTH2_CLIENT_ID": "",
            "OAUTH2_CLIENT_SECRET": "",
            "SERVICEACCT_TOKEN": "",
            "API_SERVER_URL": "",
            }
        }
        ]
    }
    </pre>

4. If you are working on changes to `console-ui`, run `console-api` locally following the instructions from https://github.com/open-cluster-management/console-api

5. Start the server for production
<pre>
npm run start:production
</pre>

6. Start the server for development, make sure execute both following npm commands
<pre>
npm run build:watch
npm run start
</pre>

7. Open a browser to `https://localhost:3001/multicloud/applications`, and you should already be logged in.

## Storybook
<pre>
npm run storybook
</pre>
Launch storybook at: http://localhost:6006/

## Testing

The following will run all unit tests.

<pre>
npm run test:unit
</pre>

## NPM Commands

The full list of npm scripts are described below.

| Command                          | Description                                                                                                                      |
|----------------------------------|----------------------------------------------------------------------------------------------------------------------------------|
| `npm start`                      | Starts the application with NODE_ENV='development'                                                                               |
| `npm run test:unit`                  | Runs jest tests                                                                                                                  |
| `npm run test:update-snapshot`       | Updates snapshots for jest tests. This command should only be used if you have made changes to a component that requires an updated snapshot artifact for a test case.|
| `npm run start:production`       | Starts the application with NODE_ENV='production'                                                                                |
| `npm run clean`                  | Deletes the generated files from public folder.                                                                                  |
| `npm run build`                  | Does a FULL development build.  (caching disabled and dev source maps)                                                           |
| `npm run build:production`       | Does a FULL production build.                                                                                                    |
| `npm run build:watch`            | Does a build of application code (w/o the DLL generation) and remains running in the background watching for changes.            |
| `npm run build:dll`              | Only re-builds the the vendor library component.                                                                                 |
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
