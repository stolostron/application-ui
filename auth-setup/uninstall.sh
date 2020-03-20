# Licensed Materials - Property of IBM
# (c) Copyright IBM Corporation 2018, 2019. All Rights Reserved.
# Copyright (c) 2020 Red Hat, Inc
# Note to U.S. Government Users Restricted Rights:
# Use, duplication or disclosure restricted by GSA ADP Schedule
# Contract with IBM Corp.

kubectl delete deployment application-ui-app -n default
kubectl delete service application-ui-app -n default
kubectl delete route application-ui-app -n default
kubectl delete serviceaccount application-ui-app -n default
kubectl delete clusterrole application-ui-app -n default
kubectl delete clusterrolebinding application-ui-app -n default