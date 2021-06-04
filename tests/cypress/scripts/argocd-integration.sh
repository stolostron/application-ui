#! /bin/bash
echo "e2e TEST - ArgoCD integration"

# KUBECONFIG_HUB="tests/cypress/config/hub-kubeconfig/kubeconfig"
# KUBECONFIG_SPOKE="tests/cypress/config/import-kubeconfig/kubeconfig"
ARGOCD_OPERATOR_PATH="cypress/templates/argocd_yaml/argocd-operator.yaml"
ARGOCD_RESOURCE_PATH="cypress/templates/argocd_yaml/argocd-resource.yaml"

KUBECTL_HUB="oc"
# KUBECTL_SPOKE="kubectl --kubeconfig $KUBECONFIG_SPOKE"

waitForRes() {
    FOUND=1
    MINUTE=0
    resKinds=$1
    resName=$2
    resNamespace=$3
    ignore=$4
    running="\([0-9]\+\)\/\1"
    printf "\n#####\nWait for ${resNamespace}/${resName} to reach running state (4min).\n"
    while [ ${FOUND} -eq 1 ]; do
        # Wait up to 4min, should only take about 20-30s
        if [ $MINUTE -gt 240 ]; then
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
        (( MINUTE = MINUTE + 3 ))
    done
}

echo "==== Validating hub and spoke cluster access ===="
$KUBECTL_HUB cluster-info
if [ $? -ne 0 ]; then
    echo "hub cluster Not accessed."
    exit 1
fi

# $KUBECTL_SPOKE cluster-info
# if [ $? -ne 0 ]; then
#     echo "spoke cluster Not accessed."
#     exit 1
# fi

echo "==== Installing ArgoCd server ===="
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

# install argocd cli
ARGO_VERSION=$(curl --silent "https://api.github.com/repos/argoproj/argo-cd/releases/latest" | grep '"tag_name"' | sed -E 's/.*"([^"]+)".*/\1/')

LOCAL_OS=$(uname)

echo "$LOCAL_OS, $ARGO_VERSION"

rm -fr /usr/local/bin/argocd

if [[ "$LOCAL_OS" == "Linux" ]]; then
    curl -sSL -o /usr/local/bin/argocd https://github.com/argoproj/argo-cd/releases/download/$ARGO_VERSION/argocd-linux-amd64
elif [[ "$LOCAL_OS" == "Darwin" ]]; then
    curl -sSL -o /usr/local/bin/argocd https://github.com/argoproj/argo-cd/releases/download/$ARGO_VERSION/argocd-darwin-amd64
fi

chmod +x /usr/local/bin/argocd

# login using the cli
ARGOCD_PWD=$($KUBECTL_HUB -n openshift-gitops get secret openshift-gitops-cluster -o jsonpath='{.data.admin\.password}' | base64 --decode)
ARGOCD_HOST=$($KUBECTL_HUB get route openshift-gitops-server -n openshift-gitops -o jsonpath='{.spec.host}')

echo "argocd login $ARGOCD_HOST --insecure --username admin --password $ARGOCD_PWD"

MINUTE=0
while [ true ]; do
    # Wait up to 5min, should only take about 1-2 min
    if [ $MINUTE -gt 300 ]; then
        echo "Timeout waiting for argocd cli login."
        exit 1
    fi
    argocd login $ARGOCD_HOST --insecure --username admin --password $ARGOCD_PWD
    if [ $? -eq 0 ]; then
        break
    fi
    echo "* STATUS: ArgoCD host NOT ready. Retry in 10 sec"
    sleep 10
    (( MINUTE = MINUTE + 10 ))
done

echo "==== Enabling ArgoCd cluster collection for the managed local-cluster ===="
SPOKE_CLUSTER=$($KUBECTL_HUB get managedclusters -l local-cluster=true -o name |head -n 1 |awk -F/ '{print $2}')

echo "SPOKE_CLUSTER: $SPOKE_CLUSTER"

$KUBECTL_HUB patch klusterletaddonconfig -n $SPOKE_CLUSTER $SPOKE_CLUSTER --type merge -p '{"spec":{"applicationManager":{"argocdCluster":true}}}'

MINUTE=0
while [ true ]; do
    # Wait up to 5min, should only take about 1-2 min
    if [ $MINUTE -gt 300 ]; then
        echo "Timeout waiting for the spoke cluster token being imported to the argocd Namespace."
        exit 1
    fi
    $KUBECTL_HUB get secrets -n openshift-gitops "$SPOKE_CLUSTER-cluster-secret"
    if [ $? -eq 0 ]; then
        break
    fi
    echo "* STATUS: The spoke cluster token is NOT in the argocd Namespace. Re-check in 10 sec"
    sleep 10
    (( MINUTE = MINUTE + 10 ))
done

echo "$SPOKE_CLUSTER cluster secrets imported to the argocd namespace successfully."

sleep 10

echo "==== verifying the the managed cluster secret in argocd cluster list ===="
argocd cluster list  |grep -w $SPOKE_CLUSTER 
if [ $? -ne 0 ]; then
    echo "Managed cluster $SPOKE_CLUSTER is NOT in the ArgoCD cluster list"
    exit 1
fi

echo "==== submitting a argocd application to the ACM managed cluster  ===="
SPOKE_CLUSTER_SERVER=$(argocd cluster list  |grep -w $SPOKE_CLUSTER |awk -F' ' '{print $1}')

$KUBECTL_HUB create namespace argo-test-ns-1
$KUBECTL_HUB create namespace argo-test-ns-2

argocd app create helloworld-argo-app-1 --repo https://github.com/fxiang1/app-samples.git --path helloworld --dest-server $SPOKE_CLUSTER_SERVER --dest-namespace argo-test-ns-1
argocd app sync helloworld-argo-app-1
argocd app create helloworld-argo-app-2 --repo https://github.com/fxiang1/app-samples.git --path helloworld --dest-server $SPOKE_CLUSTER_SERVER --dest-namespace argo-test-ns-2
argocd app sync helloworld-argo-app-2

waitForRes "deployments" "helloworld-app-deploy" "argo-test-ns-1" ""
waitForRes "deployments" "helloworld-app-deploy" "argo-test-ns-2" ""

exit 0
