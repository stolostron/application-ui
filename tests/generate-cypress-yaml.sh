# Copyright (c) 2020 Red Hat, Inc.

cd tests/cypress
mkdir test-artifacts
cp test-artifacts-templates/* test-artifacts/

cd test-artifacts/

# do a find and replace operation to sub in the ID
sed -i "s/\$JOB_ID/$JOB_ID/" *.yaml

