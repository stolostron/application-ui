kubectl delete deployment application-ui-app -n default
kubectl delete service application-ui-app -n default
kubectl delete route application-ui-app -n default
kubectl delete serviceaccount application-ui-app -n default
kubectl delete clusterrole application-ui-app -n default
kubectl delete clusterrolebinding application-ui-app -n default