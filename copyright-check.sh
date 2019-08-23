#!/bin/bash

# Licensed Materials - Property of IBM
# 5737-E67
# (c) Copyright IBM Corporation 2018, 2019. All Rights Reserved.
#
# US Government Users Restricted Rights - Use, duplication or disclosure 
# restricted by GSA ADP Schedule Contract with IBM Corp.

YEAR=2019

# LINE1="${COMMENT_PREFIX}Licensed Materials - Property of IBM"
# LINE2="${COMMENT_PREFIX}(c) Copyright IBM Corporation ${YEAR}. All Rights Reserved."
# LINE3="${COMMENT_PREFIX}Note to U.S. Government Users Restricted Rights:"
# LINE4="${COMMENT_PREFIX}Use, duplication or disclosure restricted by GSA ADP Schedule"
# LINE5="${COMMENT_PREFIX}Contract with IBM Corp."
# CHECK3=" Note to U.S. Government Users Restricted Rights:"
# CHECK4=" Use, duplication or disclosure restricted by GSA ADP Schedule"
# CHECK5=" Contract with IBM Corp."
CHECK1=" Licensed Materials - Property of IBM"
CHECK2=" 5737-E67"
CHECK3=" Copyright IBM Corporation 2019. All Rights Reserved."
CHECK3a=" Copyright IBM Corporation 2018. All Rights Reserved."
CHECK3b=" Copyright IBM Corporation 2017. All Rights Reserved."
CHECK3c=" Copyright IBM Corporation 2016, 2018. All Rights Reserved."
CHECK3d=" Copyright IBM Corporation 2016, 2019. All Rights Reserved."
CHECK3e=" Copyright IBM Corporation 2017, 2018. All Rights Reserved."
CHECK3f=" Copyright IBM Corporation 2017, 2019. All Rights Reserved."
CHECK3g=" Copyright IBM Corporation 2018, 2019. All Rights Reserved."
CHECK4=" US Government Users Restricted Rights - Use, duplication or disclosure"
CHECK5=" restricted by GSA ADP Schedule Contract with IBM Corp."

#LIC_ARY to scan for
LIC_ARY=("$CHECK1" "$CHECK2" "$CHECK3" "$CHECK4" "$CHECK5")
LIC_ARY_SIZE=${#LIC_ARY[@]}

#Used to signal an exit
ERROR=0


echo "##### Copyright check #####"
#Loop through all files. Ignore .FILENAME types
for f in `find . -type f ! -iname ".*" ! -path "./build-harness/*" ! -path "./public/*" ! -path "./sslcert/*" ! -path "./node_modules/*" ! -path "./coverage/*"`; do
  if [ ! -f "$f" ] || [ "$f" = "./copyright-check.sh" ]; then
    continue
  fi

  FILETYPE=$(basename ${f##*.})
  case "${FILETYPE}" in
  	js | sh | go | java | rb)
  		COMMENT_PREFIX=""
  		;;
  	*)
      continue
  esac

  #Read the first 10 lines, most Copyright headers use the first 6 lines.
  HEADER=`head -10 $f`
  printf " Scanning $f . . . "

  #Check for all copyright lines
  for i in `seq 0 $((${LIC_ARY_SIZE}+1))`; do
    #Add a status message of OK, if all copyright lines are found
    if [ $i -eq ${LIC_ARY_SIZE} ]; then
      printf "OK\n"
    else
      #Validate the copyright line being checked is present
      if [[ $i == 1
        && "$HEADER" != *"${CHECK3}"*
        && "$HEADER" != *"${CHECK3a}"*
        && "$HEADER" != *"${CHECK3b}"*
        && "$HEADER" != *"${CHECK3c}"*
        && "$HEADER" != *"${CHECK3d}"*
        && "$HEADER" != *"${CHECK3e}"*
        && "$HEADER" != *"${CHECK3f}"*
        && "$HEADER" != *"${CHECK3g}"* ]]; then
        printf "Missing copyright\n  >>Could not find [${LIC_ARY[$i]}] in the file $f\n"
        ERROR=1
        break
      fi
      if [[ "$HEADER" != *"${LIC_ARY[$i]}"* && $i != 1 ]]; then
        printf "[$i] [${LIC_ARY[$i]}] Missing copyright\n  >>Could not find [${LIC_ARY[$i]}] in the file $f\n"
        ERROR=1
        break
      fi
    fi
  done
done

echo "##### Copyright check ##### ReturnCode: ${ERROR}"
exit $ERROR