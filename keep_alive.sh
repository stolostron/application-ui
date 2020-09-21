#!/bin/bash

# keep_alive.sh
#   This script wraps a one-liner that will keep our travis worker alive by printing a message every
#   5 minutes.  
#

while sleep 5m; do echo "\n=====[ $SECONDS seconds, still building (don't die travis, don't die)... ]=====\n"; done &
