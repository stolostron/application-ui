# Licensed Materials - Property of IBM
# (c) Copyright IBM Corporation 2018, 2019. All Rights Reserved.
#
# US Government Users Restricted Rights - Use, duplication or disclosure 
# restricted by GSA ADP Schedule Contract with IBM Corp.

spawn scp -r test-output root@9.42.23.217:/root

expect "Please type 'yes' or 'no':"

send yes\n;

expect "password:"

send us3rpa88\n;

interact