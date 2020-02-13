kubectl delete deployment mcm-application-ui-app -n default
kubectl delete service mcm-application-ui-app -n default
kubectl delete route mcm-application-ui-app -n default
kubectl delete serviceaccount mcm-application-ui-app -n default
kubectl delete clusterrole mcm-application-ui-app -n default
kubectl delete clusterrolebinding mcm-application-ui-app -n default