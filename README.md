# hcm-ui[![Build Status](https://travis.ibm.com/IBMPrivateCloud/hcm-ui.svg?token=FQtRyxd2oucrshZSEEqZ&branch=master)](https://travis.ibm.com/IBMPrivateCloud/hcm-ui)

## Build

<pre>
export ARTIFACTORY_PWD=xxx && npm install
You can get the value of ARTIFACTORY_PWD from: https://ibm.ent.box.com/notes/287638278960
npm run build[:watch|:production]
</pre>

## Running
1. The localhost redirect ui registration URL was removed by the auth team.  You must configure an existing cluster to support local development.

> 1. SSH into your existing cluster (`make ssh`)
> 2. Install `jq` if not already installed (`sudo apt-get install jq -y`)
> 3. Run the `setup-dev.sh` script in `platform-ui`: `curl https://raw.github.ibm.com/IBMPrivateCloud/platform-ui/master/setup-dev.sh?token=<token> | sudo bash`
>    or copy the script from `https://github.ibm.com/IBMPrivateCloud/platform-ui/blob/master/setup-dev.sh` then execute it
> 4. Copy the environment variables printed at the end of the script and proceed to step 2.

2. The folloing environment variables need to be set.
<pre>
hcmUiApiUrl=http://localhost:4000/hcmuiapi
cfcRouterUrl
PLATFORM_IDENTITY_PROVIDER_URL
WLP_CLIENT_SECRET
WLP_CLIENT_ID
WLP_REDIRECT_URL=https://localhost:3000/auth/liberty/callback
ARTIFACTORY_PWD - You can get this value from: https://ibm.ent.box.com/notes/287638278960
</pre>

3. Start the server
<pre>
npm run start:production
</pre>

4. For development, make sure execute both following npm commands
<pre>
npm run build:watch
npm run start
</pre>
