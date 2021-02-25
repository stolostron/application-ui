#!/bin/bash
# Copyright (c) 2020 Red Hat, Inc.
# Copyright Contributors to the Open Cluster Management project

# keep_alive.sh
#   This script wraps a one-liner that will keep our travis worker alive by printing a message every
#   5 minutes.  
#

while sleep 5m; do echo "=====[ $SECONDS seconds, still building (don't die travis, don't die)... ]====="; done &
