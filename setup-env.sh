# Copyright (c) 2020 Red Hat, Inc.
# Copyright Contributors to the Open Cluster Management project

if ! jq --version > /dev/null 2>&1; then
  echo "Missing dependency: jq"
  return
elif ! oc version> /dev/null 2>&1; then
  echo "Missing dependency: oc"
  return
fi

OCM_NAMESPACE=open-cluster-management
OCM_ROUTE=multicloud-console
OCM_ADDRESS=https://`oc -n $OCM_NAMESPACE get route $OCM_ROUTE -o json | jq -r '.spec.host'`

OAUTH2_CLIENT_ID=multicloudingress
OAUTH2_CLIENT_SECRET=$(oc get OAuthClient $OAUTH2_CLIENT_ID -o json | jq -r '.secret')

PROTOCOL=http
if [[ ($serverKey || -f './sslcert/server.key') && ($serverCert || -f './sslcert/server.crt') ]]
then
  PROTOCOL=https
fi
OAUTH2_REDIRECT_URL=${PROTOCOL}://localhost:3001/multicloud/applications/auth/callback

# Patch ingress with redirect URL
REDIRECT_URIS=$(oc get OAuthClient $OAUTH2_CLIENT_ID -o json | jq -c "[.redirectURIs[], \"$OAUTH2_REDIRECT_URL\"] | unique")
oc patch OAuthClient multicloudingress --type json -p "[{\"op\": \"add\", \"path\": \"/redirectURIs\", \"value\": ${REDIRECT_URIS}}]"

SERVICEACCT_TOKEN=$(oc whoami -t)
API_SERVER_URL=$(oc whoami --show-server)
headerUrl=$OCM_ADDRESS
hcmUiApiUrl=$OCM_ADDRESS/multicloud/applications/graphql
searchApiUrl=$OCM_ADDRESS/multicloud/applications/search/graphql

echo
echo '"env": {'
for variable in OAUTH2_CLIENT_ID OAUTH2_CLIENT_SECRET OAUTH2_REDIRECT_URL SERVICEACCT_TOKEN API_SERVER_URL headerUrl hcmUiApiUrl searchApiUrl
do
  export $variable
  eval printf '"  \"%s\": \"%s\",\\n"' "$variable" "\${$variable?}"
done
echo '}'
