
#!/bin/bash
# Copyright (c) 2021 Red Hat, Inc.
# Copyright Contributors to the Open Cluster Management project

cd test
npx cypress run --config-file "./cypress.json" --browser "Chrome"