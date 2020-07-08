cd tests/cypress
cp test-artifacts-templates/* test-artifacts/

cd test-artifacts/

#export JOB_ID=$TRAVIS_JOB_ID

# do a find and replace operation to sub in the ID
sed -i "s/\$JOB_ID/$JOB_ID/" *.yaml

