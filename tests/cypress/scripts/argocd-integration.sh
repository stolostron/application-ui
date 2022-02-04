#! /bin/bash
echo "e2e TEST - ArgoCD integration"

ARGOCD_OPERATOR_PATH="cypress/templates/argocd_yaml/argocd-operator.yaml"
ARGOCD_RESOURCE_PATH="cypress/templates/argocd_yaml/argocd-resource.yaml"
MANAGEDCLUSTERSET_PATH="cypress/templates/argocd_yaml/managedclusterset.yaml"
MANAGEDCLUSTERSETBINDING_PATH="cypress/templates/argocd_yaml/managedclustersetbinding.yaml"
PLACEMENT_PATH="cypress/templates/argocd_yaml/placement.yaml"
GITOPSCLUSTER="cypress/templates/argocd_yaml/gitopscluster.yaml"

KUBECTL_HUB="oc"

waitForRes() {
    FOUND=1
    SECOND=0
    resKinds=$1
    resName=$2
    resNamespace=$3
    ignore=$4
    running="\([0-9]\+\)\/\1"
    printf "\n#####\nWait for ${resNamespace}/${resName} to reach running state (4min).\n"
    while [ ${FOUND} -eq 1 ]; do
        # Wait up to 4min, should only take about 20-30s
        if [ $SECOND -gt 240 ]; then
            echo "Timeout waiting for the ${resNamespace}\/${resName}."
            echo "List of current resources:"
            oc -n ${resNamespace} get ${resKinds}
            echo "You should see ${resNamespace}/${resName} ${resKinds}"
            if [ "${resKinds}" == "pods" ]; then
                oc -n ${resNamespace} describe deployments ${resName}
            fi
            exit 1
        fi
        if [ "$ignore" == "" ]; then
            echo "oc -n ${resNamespace} get ${resKinds} | grep ${resName}"
            operatorRes=`oc -n ${resNamespace} get ${resKinds} | grep ${resName}`
        else
            operatorRes=`oc -n ${resNamespace} get ${resKinds} | grep ${resName} | grep -v ${ignore}`
        fi
        if [[ $(echo $operatorRes | grep "${running}") ]]; then
            echo "* ${resName} is running"
            break
        elif [[ ("${operatorRes}" > "") && ("${resKinds}" == "deployments") ]]; then
            echo "* ${resKinds} created: ${operatorRes}"
            break
        elif [ "$operatorRes" == "" ]; then
            operatorRes="Waiting"
        fi
        echo "* STATUS: $operatorRes"
        sleep 3
        (( SECOND = SECOND + 3 ))
    done
}

retryCommand() {
    command=$1

    SECOND=0
    while [ true ]; do
        # Wait up to 5min
        if [ $SECOND -gt 300 ]; then
            echo "* STATUS: \'${command}\' failed after 5min of attempts"
            exit 1
        fi
        $command
        if [ $? -eq 0 ]; then
            break
        fi
        echo "* STATUS: \'${command}\' failed; retry in 10 sec"
        sleep 10
        (( SECOND = SECOND + 10 ))
    done
}

verifySecretAdded() {
    managedCluster=$1
    namespace=$2

    # Wait for the managed cluster secret to be deleted
    SECOND=0
    while [ true ]; do
        # Wait up to 2min
        if [ $SECOND -gt 120 ]; then
            echo "$(date) Timeout waiting for the managed cluster secret ${managedCluster}-cluster-secret to be added into ${namespace}"
            echo "E2E CANARY TEST - EXIT WITH ERROR"
            exit 1
        fi
        $KUBECTL_HUB get secret ${managedCluster}-cluster-secret -n ${namespace}
        if [ $? -eq 0 ]; then
            break
        fi

        echo "$(date) waiting for the managed cluster secret ${managedCluster}-cluster-secret to be added into ${namespace}"

        sleep 10
        (( SECOND = SECOND + 10 ))
    done

}

echo "==== Validating hub and spoke cluster access ===="
$KUBECTL_HUB cluster-info
if [ $? -ne 0 ]; then
    echo "hub cluster Not accessed."
    exit 1
fi

echo "==== Installing Openshift GitOps operator and ArgoCd server ===="
$KUBECTL_HUB apply -f $ARGOCD_OPERATOR_PATH
waitForRes "pods" "gitops-operator" "openshift-operators" ""

# $KUBECTL_HUB apply -f $ARGOCD_RESOURCE_PATH
waitForRes "pods" "openshift-gitops-server" "openshift-gitops" ""
waitForRes "pods" "openshift-gitops-repo-server" "openshift-gitops" ""
waitForRes "pods" "openshift-gitops-redis" "openshift-gitops" ""
waitForRes "pods" "openshift-gitops-applicationset-controller" "openshift-gitops" ""
waitForRes "pods" "openshift-gitops-application-controller" "openshift-gitops" ""

# setup openshift route for argocd
# $KUBECTL_HUB -n argocd create route passthrough argocd-server --service=argocd-server --port=https --insecure-policy=Redirect
# sleep 5

# login using the cli
ARGOCD_PWD=$($KUBECTL_HUB -n openshift-gitops get secret openshift-gitops-cluster -o jsonpath='{.data.admin\.password}' | base64 --decode)
ARGOCD_HOST=$($KUBECTL_HUB get route openshift-gitops-server -n openshift-gitops -o jsonpath='{.spec.host}')

echo "argocd login $ARGOCD_HOST --insecure --username admin --password $ARGOCD_PWD"

retryCommand "argocd login $ARGOCD_HOST --insecure --username admin --password $ARGOCD_PWD"

# Create managedclusterset
$KUBECTL_HUB apply -f $MANAGEDCLUSTERSET_PATH
echo "$(date) managedclusterset created"

# Add all managed clusters to managedclusterset clusterset1
MANAGED_CLUSTERS=( $($KUBECTL_HUB get managedclusters -l local-cluster=true -o name |awk -F/ '{print $2}') )

for element in "${MANAGED_CLUSTERS[@]}"
do
   echo "$(date) Adding ${element} to managed cluster set clusterset1"
   $KUBECTL_HUB label --overwrite managedclusters ${element} cluster.open-cluster-management.io/clusterset=clusterset1
done

# Create ManagedClusterSetBinding
$KUBECTL_HUB apply -f $MANAGEDCLUSTERSETBINDING_PATH
echo "$(date) managedclustersetbinding created"

# Create placement to choose all managed clusters
# sed -i -e "s/__NUM__/${#MANAGED_CLUSTERS[@]}/" $PLACEMENT_PATH
# if [ $? -ne 0 ]; then
#     echo "$(date) failed to substitue __NUM__ in placement.yaml"
#     echo "E2E CANARY TEST - EXIT WITH ERROR"
#     exit 1
# fi
$KUBECTL_HUB apply -f $PLACEMENT_PATH
echo "$(date) placement created"

# Sleep for placement decision
sleep 10

# Create GitOpsCluster for argocdtest1
$KUBECTL_HUB delete -f $GITOPSCLUSTER
$KUBECTL_HUB apply -f $GITOPSCLUSTER
echo "$(date) gitopscluster created"

# Sleep for GitOpsCluster reconcile
sleep 10

# Verify that the managed cluster secrets are added into the first argocd instance
echo "$(date)  ====  verify that the managed cluster secrets are added into the first argocd instance"
for element in "${MANAGED_CLUSTERS[@]}"
do
   verifySecretAdded ${element} "openshift-gitops"
done

sleep 10

echo "==== submitting a argocd application to the ACM managed cluster  ===="
SPOKE_CLUSTER=$($KUBECTL_HUB get managedclusters -l local-cluster=true -o name |head -n 1 |awk -F/ '{print $2}')

echo "SPOKE_CLUSTER: $SPOKE_CLUSTER"
SPOKE_CLUSTER_SERVER=$(argocd cluster list  |grep -w $SPOKE_CLUSTER |awk -F' ' '{print $1}')

$KUBECTL_HUB create namespace argo-test-ns-1
$KUBECTL_HUB create namespace argo-test-ns-2

retryCommand "argocd app create helloworld-argo-app-1 --repo https://github.com/fxiang1/app-samples.git --path helloworld --dest-server $SPOKE_CLUSTER_SERVER --dest-namespace argo-test-ns-1"
retryCommand "argocd app sync helloworld-argo-app-1"
retryCommand "argocd app create helloworld-argo-app-2 --repo https://github.com/fxiang1/app-samples.git --path helloworld --dest-server $SPOKE_CLUSTER_SERVER --dest-namespace argo-test-ns-2"
retryCommand "argocd app sync helloworld-argo-app-2"

waitForRes "deployments" "helloworld-app-deploy" "argo-test-ns-1" ""
waitForRes "deployments" "helloworld-app-deploy" "argo-test-ns-2" ""

exit 0
