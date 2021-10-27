/** *****************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2019. All Rights Reserved.
 *
 * Note to U.S. Government Users Restricted Rights:
 * Use, duplication or disclosure restricted by GSA ADP Schedule
 * Contract with IBM Corp.
 ****************************************************************************** */
// Copyright (c) 2020 Red Hat, Inc.
// Copyright Contributors to the Open Cluster Management project
export const sidePanelPolicies = [
  {
    name: "cluster1",
    metadata: {
      labels: {
        cloud: "IBM",
        environment: "Dev",
        name: "cluster1",
        region: "US"
      },
      name: "cluster1",
      namespace: "cluster1",
      annotations: {
        "mcm.ibm.com/deployer-prefix": "md",
        "mcm.ibm.com/secretRef": "cluster1-federation-secret",
        "mcm.ibm.com/user-group":
          "aGNtOmNsdXN0ZXJzLHN5c3RlbTphdXRoZW50aWNhdGVk",
        "mcm.ibm.com/user-identity": "aGNtOmNsdXN0ZXJzOmNsdXN0ZXIxOmNsdXN0ZXIx"
      },
      uid: "24694bf8-ce79-11e9-bbf4-26cb3fc6476c",
      selfLink:
        "/apis/mcm.ibm.com/v1alpha1/namespaces/cluster1/clusterstatuses/cluster1",
      __typename: "Metadata"
    },
    kind: "Cluster",
    apiVersion: "clusterregistry.k8s.io/v1alpha1",
    spec: {
      consoleURL: "https://9.42.82.160:8443"
    },
    status: {
      conditions: [
        {
          type: "OK",
          status: "",
          lastHeartbeatTime: "2019-09-16T15:10:15Z",
          lastTransitionTime: "2019-09-16T14:25:40Z"
        }
      ]
    },
    total: "1",
    violated: "1",
    policy: {
      apiVersion: "policy.mcm.ibm.com/v1alpha1",
      kind: "Policy",
      metadata: {
        annotations: {
          "policy.mcm.ibm.com/categories": "SystemAndCommunicationsProtections",
          "policy.mcm.ibm.com/controls": "CertManager",
          "policy.mcm.ibm.com/standards": "HIPAA",
          "seed-generation": "2"
        },
        creationTimestamp: "2019-09-15T08:12:48Z",
        finalizers: [
          "policy.finalizer.mcm.ibm.com",
          "sync.finalizer.mcm.ibm.com"
        ],
        generation: 2,
        name: "policy-limitrange",
        namespace: "cluster1",
        resourceVersion: "8412735",
        selfLink:
          "/apis/policy.mcm.ibm.com/v1alpha1/namespaces/cluster1/policies/policy-limitrange",
        uid: "9aa50808-d790-11e9-8a74-005056a04901"
      },
      spec: {
        complianceType: "musthave",
        namespaces: {
          exclude: ["kube-*"],
          include: ["default"]
        },
        "object-templates": [
          {
            complianceType: "musthave",
            objectDefinition: {
              apiVersion: "v1",
              kind: "LimitRange",
              metadata: {
                name: "mem-limit-range"
              },
              spec: {
                limits: [
                  {
                    default: {
                      memory: "512Mi"
                    },
                    defaultRequest: {
                      memory: "256Mi"
                    },
                    type: "Container"
                  }
                ]
              }
            },
            status: {
              Compliant: "NonCompliant",
              Validity: {},
              conditions: [
                {
                  lastTransitionTime: "2019-09-15T08:12:49Z",
                  message:
                    "limitranges `mem-limit-range` is missing, and should be created",
                  reason: "K8s missing a must have object",
                  status: "True",
                  type: "violation"
                }
              ]
            }
          }
        ],
        remediationAction: "inform"
      },
      status: {
        compliant: "NonCompliant"
      }
    },
    __typename: "ClusterInfo"
  },
  {
    name: "clusterhub",
    metadata: {
      labels: {
        cloud: "IBM",
        datacenter: "toronto",
        environment: "Dev",
        name: "clusterhub",
        owner: "marketing",
        region: "US",
        vendor: "ICP"
      },
      name: "clusterhub",
      namespace: "clusterhub",
      annotations: {
        "mcm.ibm.com/deployer-prefix": "md",
        "mcm.ibm.com/secretRef": "clusterhub-federation-secret",
        "mcm.ibm.com/user-group":
          "aGNtOmNsdXN0ZXJzLHN5c3RlbTphdXRoZW50aWNhdGVk",
        "mcm.ibm.com/user-identity":
          "aGNtOmNsdXN0ZXJzOmNsdXN0ZXJodWI6Y2x1c3Rlcmh1Yg=="
      },
      uid: "3fb19cc2-ca8b-11e9-bbf4-26cb3fc6476c",
      selfLink:
        "/apis/mcm.ibm.com/v1alpha1/namespaces/clusterhub/clusterstatuses/clusterhub",
      __typename: "Metadata"
    },
    kind: "Cluster",
    apiVersion: "clusterregistry.k8s.io/v1alpha1",
    spec: {
      consoleURL: "https://9.42.82.240:8443"
    },
    status: {
      conditions: [
        {
          type: "OK",
          status: "",
          lastHeartbeatTime: "2019-09-16T15:10:37Z",
          lastTransitionTime: "2019-09-16T14:25:41Z"
        }
      ]
    },
    total: "1",
    violated: "1",
    policy: {
      apiVersion: "policy.mcm.ibm.com/v1alpha1",
      kind: "Policy",
      metadata: {
        annotations: {
          "policy.mcm.ibm.com/categories": "SystemAndCommunicationsProtections",
          "policy.mcm.ibm.com/controls": "CertManager",
          "policy.mcm.ibm.com/standards": "HIPAA",
          "seed-generation": "2"
        },
        creationTimestamp: "2019-09-15T08:12:48Z",
        finalizers: [
          "propagator.finalizer.mcm.ibm.com",
          "finalizer.policies.ibm.com",
          "policy.finalizer.mcm.ibm.com",
          "sync.finalizer.mcm.ibm.com"
        ],
        generation: 2,
        name: "policy-limitrange",
        namespace: "clusterhub",
        ownerReferences: [
          {
            apiVersion: "policy.mcm.ibm.com/v1alpha1",
            blockOwnerDeletion: true,
            controller: true,
            kind: "Policy",
            name: "policy-limitrange",
            uid: "d358638d-cf30-11e9-a1ed-005056a0b88e"
          }
        ],
        resourceVersion: "5854341",
        selfLink:
          "/apis/policy.mcm.ibm.com/v1alpha1/namespaces/clusterhub/policies/policy-limitrange",
        uid: "9aa3d1ac-d790-11e9-a1ed-005056a0b88e"
      },
      spec: {
        complianceType: "musthave",
        namespaces: {
          exclude: ["kube-*"],
          include: ["default"]
        },
        "object-templates": [
          {
            complianceType: "musthave",
            objectDefinition: {
              apiVersion: "v1",
              kind: "LimitRange",
              metadata: {
                name: "mem-limit-range"
              },
              spec: {
                limits: [
                  {
                    default: {
                      memory: "512Mi"
                    },
                    defaultRequest: {
                      memory: "256Mi"
                    },
                    type: "Container"
                  }
                ]
              }
            },
            status: {
              Compliant: "NonCompliant",
              Validity: {},
              conditions: [
                {
                  lastTransitionTime: "2019-09-15T08:12:54Z",
                  message:
                    "limitranges `mem-limit-range` is missing, and should be created",
                  reason: "K8s missing a must have object",
                  status: "True",
                  type: "violation"
                }
              ]
            }
          }
        ],
        remediationAction: "inform"
      },
      status: {
        compliant: "NonCompliant"
      }
    },
    __typename: "ClusterInfo"
  }
];

export const sidePanelResourceTypePolicies = {
  name: "HCMPolicyPolicy",
  list: "HCMPolicyPolicyList"
};

export const sidePanelClusters = [
  {
    cluster: null,
    metadata: {
      name: "policy-auditpolicy",
      namespace: "clusterhub",
      selfLink:
        "/apis/policy.mcm.ibm.com/v1alpha1/namespaces/clusterhub/policies/policy-auditpolicy",
      creationTimestamp: "2019-09-15T08:12:45Z",
      annotations: {
        "policy.mcm.ibm.com/categories": "SystemAndCommunicationsProtections",
        "policy.mcm.ibm.com/controls": "secretEncryption",
        "policy.mcm.ibm.com/standards": "FISMA",
        "seed-generation": "103"
      },
      resourceVersion: "6127749",
      uid: "98de47f9-d790-11e9-a1ed-005056a0b88e",
      __typename: "Metadata"
    },
    status: "Compliant",
    enforcement: "inform",
    detail: {
      exclude_namespace: ["kube-*"],
      include_namespace: ["default"],
      __typename: "PolicyDetail"
    },
    raw: {
      apiVersion: "policy.mcm.ibm.com/v1alpha1",
      kind: "Policy",
      metadata: {
        annotations: {
          "policy.mcm.ibm.com/categories": "SystemAndCommunicationsProtections",
          "policy.mcm.ibm.com/controls": "secretEncryption",
          "policy.mcm.ibm.com/standards": "FISMA",
          "seed-generation": "103"
        },
        creationTimestamp: "2019-09-15T08:12:45Z",
        finalizers: [
          "finalizer.policies.ibm.com",
          "propagator.finalizer.mcm.ibm.com",
          "policy.finalizer.mcm.ibm.com",
          "sync.finalizer.mcm.ibm.com"
        ],
        generation: 103,
        name: "policy-auditpolicy",
        namespace: "clusterhub",
        ownerReferences: [
          {
            apiVersion: "policy.mcm.ibm.com/v1alpha1",
            blockOwnerDeletion: true,
            controller: true,
            kind: "Policy",
            name: "policy-auditpolicy",
            uid: "786625e5-d307-11e9-a1ed-005056a0b88e"
          }
        ],
        resourceVersion: "6127749",
        selfLink:
          "/apis/policy.mcm.ibm.com/v1alpha1/namespaces/clusterhub/policies/policy-auditpolicy",
        uid: "98de47f9-d790-11e9-a1ed-005056a0b88e"
      },
      spec: {
        complianceType: "musthave",
        namespaces: {
          exclude: ["kube-*"],
          include: ["default"]
        },
        "policy-templates": [
          {
            objectDefinition: {
              apiVersion: "audit.policies.ibm.com/v1alpha1",
              kind: "AuditPolicy",
              metadata: {
                label: {
                  category: "System-Integrity"
                },
                name: "policy-auditpolicy-example"
              },
              spec: {
                clusterAuditPolicy: {
                  auditPolicyRules: {
                    "auth-idp": "validate",
                    helmapi: "validate",
                    kubernetes: "ignore",
                    "platform-api": "validate",
                    "platform-identity-manager": "validate",
                    "platform-identity-provider": "validate",
                    "vulnerability-advisor": "validate"
                  }
                },
                namespaceSelector: {
                  exclude: ["kube-system"],
                  include: ["default", "kube-*"]
                },
                remediationAction: "inform",
                severity: "low"
              }
            },
            status: {
              Compliant: "Compliant",
              Validity: {},
              conditions: [
                {
                  lastTransitionTime: "2019-09-16T13:58:03Z",
                  message:
                    "Compliant; [0 violations, services detected with audit disabled in namespace `default` ]; [0 violations, services detected with audit disabled in namespace `kube-public` ]",
                  reason: "policy: clusterhub/policy-auditpolicy-example",
                  status: "True",
                  type: "completed"
                }
              ]
            }
          }
        ],
        remediationAction: "inform"
      },
      status: {
        compliant: "Compliant"
      }
    },
    __typename: "Policy"
  },
  {
    cluster: null,
    metadata: {
      name: "policy-certificatepolicy",
      namespace: "clusterhub",
      selfLink:
        "/apis/policy.mcm.ibm.com/v1alpha1/namespaces/clusterhub/policies/policy-certificatepolicy",
      creationTimestamp: "2019-09-15T08:13:48Z",
      annotations: {
        "policy.mcm.ibm.com/categories": "SystemAndInformationIntegrity",
        "policy.mcm.ibm.com/controls": "CertManager",
        "policy.mcm.ibm.com/standards": "FISMA, PCI",
        "seed-generation": "2"
      },
      resourceVersion: "5854790",
      uid: "be7f68f7-d790-11e9-a1ed-005056a0b88e",
      __typename: "Metadata"
    },
    status: "Compliant",
    enforcement: "inform",
    detail: {
      exclude_namespace: ["kube-*"],
      include_namespace: ["default"],
      __typename: "PolicyDetail"
    },
    raw: {
      apiVersion: "policy.mcm.ibm.com/v1alpha1",
      kind: "Policy",
      metadata: {
        annotations: {
          "policy.mcm.ibm.com/categories": "SystemAndInformationIntegrity",
          "policy.mcm.ibm.com/controls": "CertManager",
          "policy.mcm.ibm.com/standards": "FISMA, PCI",
          "seed-generation": "2"
        },
        creationTimestamp: "2019-09-15T08:13:48Z",
        finalizers: [
          "finalizer.policies.ibm.com",
          "propagator.finalizer.mcm.ibm.com",
          "sync.finalizer.mcm.ibm.com",
          "policy.finalizer.mcm.ibm.com"
        ],
        generation: 2,
        name: "policy-certificatepolicy",
        namespace: "clusterhub",
        ownerReferences: [
          {
            apiVersion: "policy.mcm.ibm.com/v1alpha1",
            blockOwnerDeletion: true,
            controller: true,
            kind: "Policy",
            name: "policy-certificatepolicy",
            uid: "68d772b1-ce79-11e9-a1ed-005056a0b88e"
          }
        ],
        resourceVersion: "5854790",
        selfLink:
          "/apis/policy.mcm.ibm.com/v1alpha1/namespaces/clusterhub/policies/policy-certificatepolicy",
        uid: "be7f68f7-d790-11e9-a1ed-005056a0b88e"
      },
      spec: {
        complianceType: "musthave",
        namespaces: {
          exclude: ["kube-*"],
          include: ["default"]
        },
        "policy-templates": [
          {
            objectDefinition: {
              apiVersion: "policies.ibm.com/v1alpha1",
              kind: "CertificatePolicy",
              metadata: {
                label: {
                  category: "System-Integrity"
                },
                name: "certificate-policy-example"
              },
              spec: {
                minimumDuration: "300h",
                namespaceSelector: {
                  exclude: [],
                  include: ["default"]
                },
                remediationAction: "inform",
                severity: "low"
              }
            },
            status: {
              Compliant: "Compliant",
              Validity: {},
              conditions: [
                {
                  lastTransitionTime: "2019-09-15T08:14:39Z",
                  message: "Compliant",
                  reason: "policy: clusterhub/certificate-policy-example",
                  status: "True",
                  type: "completed"
                }
              ]
            }
          }
        ],
        remediationAction: "inform"
      },
      status: {
        compliant: "Compliant"
      }
    },
    __typename: "Policy"
  },
  {
    cluster: null,
    metadata: {
      name: "policy-iampolicy",
      namespace: "clusterhub",
      selfLink:
        "/apis/policy.mcm.ibm.com/v1alpha1/namespaces/clusterhub/policies/policy-iampolicy",
      creationTimestamp: "2019-09-11T19:22:19Z",
      annotations: {
        "policy.mcm.ibm.com/categories": "SystemAndCommunicationsProtections",
        "policy.mcm.ibm.com/controls": "MutationAdvisor",
        "policy.mcm.ibm.com/standards": "FISMA",
        "seed-generation": "2"
      },
      resourceVersion: "5071621",
      uid: "790ce871-d4c9-11e9-a1ed-005056a0b88e",
      __typename: "Metadata"
    },
    status: "NonCompliant",
    enforcement: "inform",
    detail: {
      exclude_namespace: ["kube-*"],
      include_namespace: ["default"],
      __typename: "PolicyDetail"
    },
    raw: {
      apiVersion: "policy.mcm.ibm.com/v1alpha1",
      kind: "Policy",
      metadata: {
        annotations: {
          "policy.mcm.ibm.com/categories": "SystemAndCommunicationsProtections",
          "policy.mcm.ibm.com/controls": "MutationAdvisor",
          "policy.mcm.ibm.com/standards": "FISMA",
          "seed-generation": "2"
        },
        creationTimestamp: "2019-09-11T19:22:19Z",
        finalizers: [
          "finalizer.policies.ibm.com",
          "propagator.finalizer.mcm.ibm.com",
          "sync.finalizer.mcm.ibm.com",
          "policy.finalizer.mcm.ibm.com"
        ],
        generation: 2,
        name: "policy-iampolicy",
        namespace: "clusterhub",
        ownerReferences: [
          {
            apiVersion: "policy.mcm.ibm.com/v1alpha1",
            blockOwnerDeletion: true,
            controller: true,
            kind: "Policy",
            name: "policy-iampolicy",
            uid: "a18d825a-cb36-11e9-a1eb-005056a0b88e"
          }
        ],
        resourceVersion: "5071621",
        selfLink:
          "/apis/policy.mcm.ibm.com/v1alpha1/namespaces/clusterhub/policies/policy-iampolicy",
        uid: "790ce871-d4c9-11e9-a1ed-005056a0b88e"
      },
      spec: {
        complianceType: "musthave",
        namespaces: {
          exclude: ["kube-*"],
          include: ["default"]
        },
        "policy-templates": [
          {
            objectDefinition: {
              apiVersion: "iam.policies.ibm.com/v1alpha1",
              kind: "IamPolicy",
              metadata: {
                label: {
                  category: "System-Integrity"
                },
                name: "iam-policy-example"
              },
              spec: {
                maxClusterRoleBindingUsers: 5,
                maxRoleBindingViolationsPerNamespace: 2,
                namespaceSelector: {
                  exclude: ["kube-system"],
                  include: ["default", "kube-*"]
                },
                remediationAction: "inform",
                severity: "medium"
              }
            },
            status: {
              Compliant: "NonCompliant",
              Validity: {},
              conditions: [
                {
                  lastTransitionTime: "2019-09-11T19:22:34Z",
                  message:
                    "NonCompliant; 1 clusterrole admin users violations detected in namespace `cluster-wide`",
                  reason: "policy: clusterhub/iam-policy-example",
                  status: "True",
                  type: "completed"
                }
              ]
            }
          }
        ],
        remediationAction: "inform"
      },
      status: {
        compliant: "NonCompliant"
      }
    },
    __typename: "Policy"
  },
  {
    cluster: null,
    metadata: {
      name: "policy-image",
      namespace: "clusterhub",
      selfLink:
        "/apis/policy.mcm.ibm.com/v1alpha1/namespaces/clusterhub/policies/policy-image",
      creationTimestamp: "2019-09-15T08:13:48Z",
      annotations: {
        "policy.mcm.ibm.com/categories": "SystemAndCommunicationsProtections",
        "policy.mcm.ibm.com/controls": "VA",
        "policy.mcm.ibm.com/standards": "FISMA",
        "seed-generation": "5"
      },
      resourceVersion: "5854643",
      uid: "be8091d5-d790-11e9-a1ed-005056a0b88e",
      __typename: "Metadata"
    },
    status: "NonCompliant",
    enforcement: "inform",
    detail: {
      exclude_namespace: ["kube-*"],
      include_namespace: ["default"],
      __typename: "PolicyDetail"
    },
    raw: {
      apiVersion: "policy.mcm.ibm.com/v1alpha1",
      kind: "Policy",
      metadata: {
        annotations: {
          "policy.mcm.ibm.com/categories": "SystemAndCommunicationsProtections",
          "policy.mcm.ibm.com/controls": "VA",
          "policy.mcm.ibm.com/standards": "FISMA",
          "seed-generation": "5"
        },
        creationTimestamp: "2019-09-15T08:13:48Z",
        finalizers: [
          "finalizer.policies.ibm.com",
          "propagator.finalizer.mcm.ibm.com",
          "policy.finalizer.mcm.ibm.com",
          "sync.finalizer.mcm.ibm.com"
        ],
        generation: 2,
        name: "policy-image",
        namespace: "clusterhub",
        ownerReferences: [
          {
            apiVersion: "policy.mcm.ibm.com/v1alpha1",
            blockOwnerDeletion: true,
            controller: true,
            kind: "Policy",
            name: "policy-image",
            uid: "8be1a627-cb2c-11e9-a1eb-005056a0b88e"
          }
        ],
        resourceVersion: "5854643",
        selfLink:
          "/apis/policy.mcm.ibm.com/v1alpha1/namespaces/clusterhub/policies/policy-image",
        uid: "be8091d5-d790-11e9-a1ed-005056a0b88e"
      },
      spec: {
        complianceType: "musthave",
        namespaces: {
          exclude: ["kube-*"],
          include: ["default"]
        },
        "object-templates": [
          {
            complianceType: "musthave",
            objectDefinition: {
              apiVersion: "securityenforcement.admission.cloud.ibm.com/v1beta1",
              kind: "ClusterImagePolicy",
              metadata: {
                name: "mongo"
              },
              spec: {
                repositories: [
                  {
                    name: "docker.io/mongo"
                  }
                ]
              }
            },
            status: {
              Compliant: "NonCompliant",
              Validity: {},
              conditions: [
                {
                  lastTransitionTime: "2019-09-15T08:13:52Z",
                  message:
                    "clusterimagepolicies `mongo` is missing, and should be created",
                  reason: "K8s missing a must have object",
                  status: "True",
                  type: "violation"
                }
              ]
            }
          }
        ],
        remediationAction: "inform"
      },
      status: {
        compliant: "NonCompliant"
      }
    },
    __typename: "Policy"
  },
  {
    cluster: null,
    metadata: {
      name: "policy-limitrange",
      namespace: "clusterhub",
      selfLink:
        "/apis/policy.mcm.ibm.com/v1alpha1/namespaces/clusterhub/policies/policy-limitrange",
      creationTimestamp: "2019-09-15T08:12:48Z",
      annotations: {
        "policy.mcm.ibm.com/categories": "SystemAndCommunicationsProtections",
        "policy.mcm.ibm.com/controls": "CertManager",
        "policy.mcm.ibm.com/standards": "HIPAA",
        "seed-generation": "2"
      },
      resourceVersion: "5854341",
      uid: "9aa3d1ac-d790-11e9-a1ed-005056a0b88e",
      __typename: "Metadata"
    },
    status: "NonCompliant",
    enforcement: "inform",
    detail: {
      exclude_namespace: ["kube-*"],
      include_namespace: ["default"],
      __typename: "PolicyDetail"
    },
    raw: {
      apiVersion: "policy.mcm.ibm.com/v1alpha1",
      kind: "Policy",
      metadata: {
        annotations: {
          "policy.mcm.ibm.com/categories": "SystemAndCommunicationsProtections",
          "policy.mcm.ibm.com/controls": "CertManager",
          "policy.mcm.ibm.com/standards": "HIPAA",
          "seed-generation": "2"
        },
        creationTimestamp: "2019-09-15T08:12:48Z",
        finalizers: [
          "propagator.finalizer.mcm.ibm.com",
          "finalizer.policies.ibm.com",
          "policy.finalizer.mcm.ibm.com",
          "sync.finalizer.mcm.ibm.com"
        ],
        generation: 2,
        name: "policy-limitrange",
        namespace: "clusterhub",
        ownerReferences: [
          {
            apiVersion: "policy.mcm.ibm.com/v1alpha1",
            blockOwnerDeletion: true,
            controller: true,
            kind: "Policy",
            name: "policy-limitrange",
            uid: "d358638d-cf30-11e9-a1ed-005056a0b88e"
          }
        ],
        resourceVersion: "5854341",
        selfLink:
          "/apis/policy.mcm.ibm.com/v1alpha1/namespaces/clusterhub/policies/policy-limitrange",
        uid: "9aa3d1ac-d790-11e9-a1ed-005056a0b88e"
      },
      spec: {
        complianceType: "musthave",
        namespaces: {
          exclude: ["kube-*"],
          include: ["default"]
        },
        "object-templates": [
          {
            complianceType: "musthave",
            objectDefinition: {
              apiVersion: "v1",
              kind: "LimitRange",
              metadata: {
                name: "mem-limit-range"
              },
              spec: {
                limits: [
                  {
                    default: {
                      memory: "512Mi"
                    },
                    defaultRequest: {
                      memory: "256Mi"
                    },
                    type: "Container"
                  }
                ]
              }
            },
            status: {
              Compliant: "NonCompliant",
              Validity: {},
              conditions: [
                {
                  lastTransitionTime: "2019-09-15T08:12:54Z",
                  message:
                    "limitranges `mem-limit-range` is missing, and should be created",
                  reason: "K8s missing a must have object",
                  status: "True",
                  type: "violation"
                }
              ]
            }
          }
        ],
        remediationAction: "inform"
      },
      status: {
        compliant: "NonCompliant"
      }
    },
    __typename: "Policy"
  },
  {
    cluster: null,
    metadata: {
      name: "policy-namespace",
      namespace: "clusterhub",
      selfLink:
        "/apis/policy.mcm.ibm.com/v1alpha1/namespaces/clusterhub/policies/policy-namespace",
      creationTimestamp: "2019-09-12T23:53:57Z",
      annotations: {
        "policy.mcm.ibm.com/categories":
          "SystemAndCommunicationsProtections,SystemAndInformationIntegrity",
        "policy.mcm.ibm.com/controls": "MutationAdvisor",
        "policy.mcm.ibm.com/standards": "NIST,HIPAA",
        "seed-generation": "1"
      },
      resourceVersion: "5335869",
      uid: "95ff86af-d5b8-11e9-a1ed-005056a0b88e",
      __typename: "Metadata"
    },
    status: "unknown",
    enforcement: "enforce",
    detail: {
      exclude_namespace: ["*"],
      include_namespace: ["*"],
      __typename: "PolicyDetail"
    },
    raw: {
      apiVersion: "policy.mcm.ibm.com/v1alpha1",
      kind: "Policy",
      metadata: {
        annotations: {
          "policy.mcm.ibm.com/categories":
            "SystemAndCommunicationsProtections,SystemAndInformationIntegrity",
          "policy.mcm.ibm.com/controls": "MutationAdvisor",
          "policy.mcm.ibm.com/standards": "NIST,HIPAA",
          "seed-generation": "1"
        },
        creationTimestamp: "2019-09-12T23:53:57Z",
        finalizers: [
          "propagator.finalizer.mcm.ibm.com",
          "finalizer.policies.ibm.com",
          "sync.finalizer.mcm.ibm.com",
          "policy.finalizer.mcm.ibm.com"
        ],
        generation: 1,
        name: "policy-namespace",
        namespace: "clusterhub",
        ownerReferences: [
          {
            apiVersion: "policy.mcm.ibm.com/v1alpha1",
            blockOwnerDeletion: true,
            controller: true,
            kind: "Policy",
            name: "policy-namespace",
            uid: "2516c2c7-d3f4-11e9-a1ed-005056a0b88e"
          }
        ],
        resourceVersion: "5335869",
        selfLink:
          "/apis/policy.mcm.ibm.com/v1alpha1/namespaces/clusterhub/policies/policy-namespace",
        uid: "95ff86af-d5b8-11e9-a1ed-005056a0b88e"
      },
      spec: {
        complianceType: "musthave",
        namespaces: {},
        "object-templates": [
          {
            complianceType: "musthave",
            objectDefinition: {
              apiVersion: "v1",
              kind: "Namespace",
              metadata: {
                name: "dev-will-test"
              }
            },
            status: {
              Validity: {}
            }
          }
        ],
        remediationAction: "enforce"
      },
      status: {}
    },
    __typename: "Policy"
  },
  {
    cluster: null,
    metadata: {
      name: "policy-pod",
      namespace: "clusterhub",
      selfLink:
        "/apis/policy.mcm.ibm.com/v1alpha1/namespaces/clusterhub/policies/policy-pod",
      creationTimestamp: "2019-09-15T08:12:48Z",
      annotations: {
        "policy.mcm.ibm.com/categories": "SystemAndCommunicationsProtections",
        "policy.mcm.ibm.com/controls": "MutationAdvisor",
        "policy.mcm.ibm.com/standards": "FISMA",
        "seed-generation": "2"
      },
      resourceVersion: "5854352",
      uid: "9a919f45-d790-11e9-a1ed-005056a0b88e",
      __typename: "Metadata"
    },
    status: "unknown",
    enforcement: "inform",
    detail: {
      exclude_namespace: ["kube-*"],
      include_namespace: ["default"],
      __typename: "PolicyDetail"
    },
    raw: {
      apiVersion: "policy.mcm.ibm.com/v1alpha1",
      kind: "Policy",
      metadata: {
        annotations: {
          "policy.mcm.ibm.com/categories": "SystemAndCommunicationsProtections",
          "policy.mcm.ibm.com/controls": "MutationAdvisor",
          "policy.mcm.ibm.com/standards": "FISMA",
          "seed-generation": "2"
        },
        creationTimestamp: "2019-09-15T08:12:48Z",
        finalizers: [
          "finalizer.policies.ibm.com",
          "propagator.finalizer.mcm.ibm.com",
          "policy.finalizer.mcm.ibm.com",
          "sync.finalizer.mcm.ibm.com"
        ],
        generation: 7,
        name: "policy-pod",
        namespace: "clusterhub",
        ownerReferences: [
          {
            apiVersion: "policy.mcm.ibm.com/v1alpha1",
            blockOwnerDeletion: true,
            controller: true,
            kind: "Policy",
            name: "policy-pod",
            uid: "48316272-d009-11e9-a1ed-005056a0b88e"
          }
        ],
        resourceVersion: "5854352",
        selfLink:
          "/apis/policy.mcm.ibm.com/v1alpha1/namespaces/clusterhub/policies/policy-pod",
        uid: "9a919f45-d790-11e9-a1ed-005056a0b88e"
      },
      spec: {
        complianceType: "musthave",
        namespaces: {
          exclude: ["kube-*"],
          include: ["default"]
        },
        "object-templates": [
          {
            complianceType: "musthave",
            objectDefinition: {
              apiVersion: "v1",
              kind: "Pod",
              metadata: {
                name: "nginx-pod"
              },
              spec: {
                containers: [
                  {
                    image: "nginx:1.7.9",
                    name: "nginx",
                    ports: [
                      {
                        containerPort: 80
                      }
                    ]
                  }
                ]
              }
            },
            status: {
              Compliant: "NonCompliant",
              Validity: {},
              conditions: [
                {
                  lastTransitionTime: "2019-09-15T08:12:52Z",
                  message: "pods `nginx-pod` is missing, and should be created",
                  reason: "K8s missing a must have object",
                  status: "True",
                  type: "violation"
                }
              ]
            }
          }
        ],
        remediationAction: "inform"
      },
      status: {}
    },
    __typename: "Policy"
  },
  {
    cluster: null,
    metadata: {
      name: "policy-rolebinding-1",
      namespace: "clusterhub",
      selfLink:
        "/apis/policy.mcm.ibm.com/v1alpha1/namespaces/clusterhub/policies/policy-rolebinding-1",
      creationTimestamp: "2019-09-15T08:12:48Z",
      annotations: {
        "policy.mcm.ibm.com/categories": "SystemAndCommunicationsProtections",
        "policy.mcm.ibm.com/controls": "MutationAdvisor",
        "policy.mcm.ibm.com/standards": "FISMA",
        "seed-generation": "2"
      },
      resourceVersion: "5854333",
      uid: "9a9d57f0-d790-11e9-a1ed-005056a0b88e",
      __typename: "Metadata"
    },
    status: "NonCompliant",
    enforcement: "inform",
    detail: {
      exclude_namespace: ["kube-*"],
      include_namespace: ["default"],
      __typename: "PolicyDetail"
    },
    raw: {
      apiVersion: "policy.mcm.ibm.com/v1alpha1",
      kind: "Policy",
      metadata: {
        annotations: {
          "policy.mcm.ibm.com/categories": "SystemAndCommunicationsProtections",
          "policy.mcm.ibm.com/controls": "MutationAdvisor",
          "policy.mcm.ibm.com/standards": "FISMA",
          "seed-generation": "2"
        },
        creationTimestamp: "2019-09-15T08:12:48Z",
        finalizers: [
          "finalizer.policies.ibm.com",
          "propagator.finalizer.mcm.ibm.com",
          "policy.finalizer.mcm.ibm.com",
          "sync.finalizer.mcm.ibm.com"
        ],
        generation: 2,
        name: "policy-rolebinding-1",
        namespace: "clusterhub",
        ownerReferences: [
          {
            apiVersion: "policy.mcm.ibm.com/v1alpha1",
            blockOwnerDeletion: true,
            controller: true,
            kind: "Policy",
            name: "policy-rolebinding-1",
            uid: "22ac9660-cf15-11e9-a1ed-005056a0b88e"
          }
        ],
        resourceVersion: "5854333",
        selfLink:
          "/apis/policy.mcm.ibm.com/v1alpha1/namespaces/clusterhub/policies/policy-rolebinding-1",
        uid: "9a9d57f0-d790-11e9-a1ed-005056a0b88e"
      },
      spec: {
        complianceType: "musthave",
        namespaces: {
          exclude: ["kube-*"],
          include: ["default"]
        },
        "object-templates": [
          {
            complianceType: "musthave",
            objectDefinition: {
              apiVersion: "rbac.authorization.k8s.io/v1",
              kind: "RoleBinding",
              metadata: {
                name: "operate-pods-rolebinding"
              },
              roleRef: {
                apiGroup: "rbac.authorization.k8s.io",
                kind: "Role",
                name: "operator"
              },
              subjects: [
                {
                  apiGroup: "rbac.authorization.k8s.io",
                  kind: "User",
                  name: "admin"
                }
              ]
            },
            status: {
              Compliant: "NonCompliant",
              Validity: {},
              conditions: [
                {
                  lastTransitionTime: "2019-09-15T08:12:53Z",
                  message:
                    "rolebindings `operate-pods-rolebinding` is missing, and should be created",
                  reason: "K8s missing a must have object",
                  status: "True",
                  type: "violation"
                }
              ]
            }
          }
        ],
        remediationAction: "inform"
      },
      status: {
        compliant: "NonCompliant"
      }
    },
    __typename: "Policy"
  },
  {
    cluster: null,
    metadata: {
      name: "policy-vulnerabilitypolicy",
      namespace: "clusterhub",
      selfLink:
        "/apis/policy.mcm.ibm.com/v1alpha1/namespaces/clusterhub/policies/policy-vulnerabilitypolicy",
      creationTimestamp: "2019-09-15T08:13:48Z",
      annotations: {
        "policy.mcm.ibm.com/categories": "SystemAndInformationIntegrity",
        "policy.mcm.ibm.com/controls": "VA",
        "policy.mcm.ibm.com/standards": "PCI",
        "seed-generation": "2"
      },
      resourceVersion: "5854650",
      uid: "be757224-d790-11e9-a1ed-005056a0b88e",
      __typename: "Metadata"
    },
    status: "NonCompliant",
    enforcement: "inform",
    detail: {
      exclude_namespace: ["kube-*"],
      include_namespace: ["default"],
      __typename: "PolicyDetail"
    },
    raw: {
      apiVersion: "policy.mcm.ibm.com/v1alpha1",
      kind: "Policy",
      metadata: {
        annotations: {
          "policy.mcm.ibm.com/categories": "SystemAndInformationIntegrity",
          "policy.mcm.ibm.com/controls": "VA",
          "policy.mcm.ibm.com/standards": "PCI",
          "seed-generation": "2"
        },
        creationTimestamp: "2019-09-15T08:13:48Z",
        finalizers: [
          "finalizer.policies.ibm.com",
          "propagator.finalizer.mcm.ibm.com",
          "policy.finalizer.mcm.ibm.com",
          "sync.finalizer.mcm.ibm.com"
        ],
        generation: 2,
        name: "policy-vulnerabilitypolicy",
        namespace: "clusterhub",
        ownerReferences: [
          {
            apiVersion: "policy.mcm.ibm.com/v1alpha1",
            blockOwnerDeletion: true,
            controller: true,
            kind: "Policy",
            name: "policy-vulnerabilitypolicy",
            uid: "2767ac02-ce7a-11e9-a1ed-005056a0b88e"
          }
        ],
        resourceVersion: "5854650",
        selfLink:
          "/apis/policy.mcm.ibm.com/v1alpha1/namespaces/clusterhub/policies/policy-vulnerabilitypolicy",
        uid: "be757224-d790-11e9-a1ed-005056a0b88e"
      },
      spec: {
        complianceType: "musthave",
        namespaces: {
          exclude: ["kube-*"],
          include: ["default"]
        },
        "policy-templates": [
          {
            objectDefinition: {
              apiVersion: "policies.ibm.com/v1alpha1",
              kind: "VulnerabilityPolicy",
              metadata: {
                label: {
                  category: "System-Integrity"
                },
                name: "va-policy-example"
              },
              spec: {
                namespaceSelector: {
                  exclude: ["kube-system"],
                  include: ["default", "kube-*"]
                },
                remediationAction: "inform",
                severity: "medium"
              }
            },
            status: {
              Compliant: "NonCompliant",
              Validity: {},
              conditions: [
                {
                  lastTransitionTime: "2019-09-15T08:13:52Z",
                  message:
                    'mapping error from raw object: `no matches for kind "VulnerabilityPolicy" in version "policies.ibm.com/v1alpha1"`',
                  reason: "K8s creation error",
                  status: "False",
                  type: "violation"
                }
              ]
            }
          }
        ],
        remediationAction: "inform"
      },
      status: {
        compliant: "NonCompliant"
      }
    },
    __typename: "Policy"
  }
];

export const sidePanelResourceTypeClusters = {
  name: "HCMPolicyCluster",
  list: "HCMPolicyClusterList"
};

export const sidePanelSecurityFindings = {
  kind: "HCMSecurityFindings",
  name:
    "id-mycluster-account/providers/security-advisor/occurrences/cluster1-policy-8be1a627-cb2c-11e9-a1eb-005056a0b88e",
  shortDescription: "Policy that is not compliant",
  longDescription: "MCM Policy that is not compliant",
  providerId: "security-advisor",
  providerName: "id-mycluster-account/providers/security-advisor",
  remediation: "",
  updateTime: "2019-09-17T03:49:59.072672Z",
  finding: {
    severity: "HIGH",
    certainty: "HIGH",
    networkConnection: null,
    nextSteps: [
      {
        title:
          "View the details for the compliance problem in the occurrence of the findings.",
        url: null
      }
    ],
    dataTransferred: null
  },
  reportedBy: {
    id: "mcm-policy-adapter",
    title: "Security Advisor MCM Policy Findings Adapter",
    url: null
  },
  context: {
    accountId: "id-mycluster-account",
    region: "cluster1",
    resourceType: "Policy",
    resourceName: "policy-image",
    resourceId: "8be1a627-cb2c-11e9-a1eb-005056a0b88e",
    resourceCrn: null,
    serviceName: "icp4mcm-findings",
    serviceCrn: null,
    clusterName: "cluster1",
    namespaceName: "Excludes: [kube-*], Includes: [default]"
  },
  securityClassification: {
    securityStandards: ["FISMA"],
    securityCategories: ["SystemAndCommunicationsProtections"],
    securityControl: "VA"
  },
  __typename: "Occurrence",
  custom: {
    context: "Policy: policy-image",
    "finding.severity": "High",
    "securityClassification.securityStandards": "FISMA",
    "securityClassification.securityControl": "VA",
    "securityClassification.securityCategories":
      "System And Communications Protections",
    updateTime: "-"
  }
};

export const sidePanelResourceTypeSecurityFindings = {
  name: "HCMSecurityFindings",
  list: "HCMSecurityFindingsList"
};

export const sidePanelFindingsClusters = {
  kind: "HCMClusterFindings",
  cluster: "clusterhub",
  severity: "13/15",
  highSeverity: {
    "Policy that is not compliant": 13
  },
  findingsUnderCluster: [
    {
      name:
        "id-mycluster-account/providers/security-advisor/occurrences/clusterhub-policy-8be1a627-cb2c-11e9-a1eb-005056a0b88e",
      shortDescription: "Policy that is not compliant",
      longDescription: "MCM Policy that is not compliant",
      providerId: "security-advisor",
      providerName: "id-mycluster-account/providers/security-advisor",
      remediation:
        "clusterimagepolicies `mongo` is missing, and should be created",
      updateTime: "2019-09-17T03:49:57.992780Z",
      finding: {
        severity: "HIGH",
        certainty: "HIGH",
        networkConnection: null,
        nextSteps: [
          {
            title:
              "View the details for the compliance problem in the occurrence of the findings.",
            url: null
          }
        ],
        dataTransferred: null
      },
      reportedBy: {
        id: "mcm-policy-adapter",
        title: "Security Advisor MCM Policy Findings Adapter",
        url: null
      },
      context: {
        accountId: "id-mycluster-account",
        region: "clusterhub",
        resourceType: "Policy",
        resourceName: "policy-image",
        resourceId: "8be1a627-cb2c-11e9-a1eb-005056a0b88e",
        resourceCrn: null,
        serviceName: "icp4mcm-findings",
        serviceCrn: null,
        clusterName: "clusterhub",
        namespaceName: "Excludes: [kube-*], Includes: [default]"
      },
      securityClassification: {
        securityStandards: ["FISMA"],
        securityCategories: ["SystemAndCommunicationsProtections"],
        securityControl: "VA"
      },
      __typename: "Occurrence"
    },
    {
      name:
        "id-mycluster-account/providers/security-advisor/occurrences/clusterhub-policy-a18d825a-cb36-11e9-a1eb-005056a0b88e",
      shortDescription: "Policy that is not compliant",
      longDescription: "MCM Policy that is not compliant",
      providerId: "security-advisor",
      providerName: "id-mycluster-account/providers/security-advisor",
      remediation:
        "NonCompliant; 1 clusterrole admin users violations detected in namespace `cluster-wide`",
      updateTime: "2019-09-17T03:49:56.896389Z",
      finding: {
        severity: "MEDIUM",
        certainty: "HIGH",
        networkConnection: null,
        nextSteps: [
          {
            title:
              "View the details for the compliance problem in the occurrence of the findings.",
            url: null
          }
        ],
        dataTransferred: null
      },
      reportedBy: {
        id: "mcm-policy-adapter",
        title: "Security Advisor MCM Policy Findings Adapter",
        url: null
      },
      context: {
        accountId: "id-mycluster-account",
        region: "clusterhub",
        resourceType: "Policy",
        resourceName: "policy-iampolicy",
        resourceId: "a18d825a-cb36-11e9-a1eb-005056a0b88e",
        resourceCrn: null,
        serviceName: "icp4mcm-findings",
        serviceCrn: null,
        clusterName: "clusterhub",
        namespaceName: "Excludes: [kube-*], Includes: [default]"
      },
      securityClassification: {
        securityStandards: ["FISMA"],
        securityCategories: ["SystemAndCommunicationsProtections"],
        securityControl: "MutationAdvisor"
      },
      __typename: "Occurrence"
    },
    {
      name:
        "id-mycluster-account/providers/security-advisor/occurrences/clusterhub-policy-48316272-d009-11e9-a1ed-005056a0b88e",
      shortDescription: "Policy that is not compliant",
      longDescription: "MCM Policy that is not compliant",
      providerId: "security-advisor",
      providerName: "id-mycluster-account/providers/security-advisor",
      remediation: "pods `nginx-pod` is missing, and should be created",
      updateTime: "2019-09-17T03:49:54.798180Z",
      finding: {
        severity: "HIGH",
        certainty: "HIGH",
        networkConnection: null,
        nextSteps: [
          {
            title:
              "View the details for the compliance problem in the occurrence of the findings.",
            url: null
          }
        ],
        dataTransferred: null
      },
      reportedBy: {
        id: "mcm-policy-adapter",
        title: "Security Advisor MCM Policy Findings Adapter",
        url: null
      },
      context: {
        accountId: "id-mycluster-account",
        region: "clusterhub",
        resourceType: "Policy",
        resourceName: "policy-pod",
        resourceId: "48316272-d009-11e9-a1ed-005056a0b88e",
        resourceCrn: null,
        serviceName: "icp4mcm-findings",
        serviceCrn: null,
        clusterName: "clusterhub",
        namespaceName: "Excludes: [kube-*], Includes: [default]"
      },
      securityClassification: {
        securityStandards: ["FISMA"],
        securityCategories: ["SystemAndCommunicationsProtections"],
        securityControl: "MutationAdvisor"
      },
      __typename: "Occurrence"
    },
    {
      name:
        "id-mycluster-account/providers/security-advisor/occurrences/clusterhub-policy-d358638d-cf30-11e9-a1ed-005056a0b88e",
      shortDescription: "Policy that is not compliant",
      longDescription: "MCM Policy that is not compliant",
      providerId: "security-advisor",
      providerName: "id-mycluster-account/providers/security-advisor",
      remediation:
        "limitranges `mem-limit-range` is missing, and should be created",
      updateTime: "2019-09-17T03:49:52.077477Z",
      finding: {
        severity: "HIGH",
        certainty: "HIGH",
        networkConnection: null,
        nextSteps: [
          {
            title:
              "View the details for the compliance problem in the occurrence of the findings.",
            url: null
          }
        ],
        dataTransferred: null
      },
      reportedBy: {
        id: "mcm-policy-adapter",
        title: "Security Advisor MCM Policy Findings Adapter",
        url: null
      },
      context: {
        accountId: "id-mycluster-account",
        region: "clusterhub",
        resourceType: "Policy",
        resourceName: "policy-limitrange",
        resourceId: "d358638d-cf30-11e9-a1ed-005056a0b88e",
        resourceCrn: null,
        serviceName: "icp4mcm-findings",
        serviceCrn: null,
        clusterName: "clusterhub",
        namespaceName: "Excludes: [kube-*], Includes: [default]"
      },
      securityClassification: {
        securityStandards: ["HIPAA"],
        securityCategories: ["SystemAndCommunicationsProtections"],
        securityControl: "CertManager"
      },
      __typename: "Occurrence"
    },
    {
      name:
        "id-mycluster-account/providers/security-advisor/occurrences/clusterhub-policy-2767ac02-ce7a-11e9-a1ed-005056a0b88e",
      shortDescription: "Policy that is not compliant",
      longDescription: "MCM Policy that is not compliant",
      providerId: "security-advisor",
      providerName: "id-mycluster-account/providers/security-advisor",
      remediation:
        'mapping error from raw object: `no matches for kind "VulnerabilityPolicy" in version "policies.ibm.com/v1alpha1"`',
      updateTime: "2019-09-17T03:49:49.831270Z",
      finding: {
        severity: "MEDIUM",
        certainty: "HIGH",
        networkConnection: null,
        nextSteps: [
          {
            title:
              "View the details for the compliance problem in the occurrence of the findings.",
            url: null
          }
        ],
        dataTransferred: null
      },
      reportedBy: {
        id: "mcm-policy-adapter",
        title: "Security Advisor MCM Policy Findings Adapter",
        url: null
      },
      context: {
        accountId: "id-mycluster-account",
        region: "clusterhub",
        resourceType: "Policy",
        resourceName: "policy-vulnerabilitypolicy",
        resourceId: "2767ac02-ce7a-11e9-a1ed-005056a0b88e",
        resourceCrn: null,
        serviceName: "icp4mcm-findings",
        serviceCrn: null,
        clusterName: "clusterhub",
        namespaceName: "Excludes: [kube-*], Includes: [default]"
      },
      securityClassification: {
        securityStandards: ["PCI"],
        securityCategories: ["SystemAndInformationIntegrity"],
        securityControl: "VA"
      },
      __typename: "Occurrence"
    },
    {
      name:
        "id-mycluster-account/providers/security-advisor/occurrences/clusterhub-policy-22ac9660-cf15-11e9-a1ed-005056a0b88e",
      shortDescription: "Policy that is not compliant",
      longDescription: "MCM Policy that is not compliant",
      providerId: "security-advisor",
      providerName: "id-mycluster-account/providers/security-advisor",
      remediation:
        "rolebindings `operate-pods-rolebinding` is missing, and should be created",
      updateTime: "2019-09-17T03:49:48.693675Z",
      finding: {
        severity: "HIGH",
        certainty: "HIGH",
        networkConnection: null,
        nextSteps: [
          {
            title:
              "View the details for the compliance problem in the occurrence of the findings.",
            url: null
          }
        ],
        dataTransferred: null
      },
      reportedBy: {
        id: "mcm-policy-adapter",
        title: "Security Advisor MCM Policy Findings Adapter",
        url: null
      },
      context: {
        accountId: "id-mycluster-account",
        region: "clusterhub",
        resourceType: "Policy",
        resourceName: "policy-rolebinding-1",
        resourceId: "22ac9660-cf15-11e9-a1ed-005056a0b88e",
        resourceCrn: null,
        serviceName: "icp4mcm-findings",
        serviceCrn: null,
        clusterName: "clusterhub",
        namespaceName: "Excludes: [kube-*], Includes: [default]"
      },
      securityClassification: {
        securityStandards: ["FISMA"],
        securityCategories: ["SystemAndCommunicationsProtections"],
        securityControl: "MutationAdvisor"
      },
      __typename: "Occurrence"
    },
    {
      name:
        "id-mycluster-account/providers/security-advisor/occurrences/clusterhub-policy-53dc2f7d-d8bb-11e9-a1ed-005056a0b88e",
      shortDescription: "Policy that is not compliant",
      longDescription: "MCM Policy that is not compliant",
      providerId: "security-advisor",
      providerName: "id-mycluster-account/providers/security-advisor",
      remediation: "namespaces `prod` is missing, and should be created",
      updateTime: "2019-09-16T19:51:43.533264Z",
      finding: {
        severity: "HIGH",
        certainty: "HIGH",
        networkConnection: null,
        nextSteps: [
          {
            title:
              "View the details for the compliance problem in the occurrence of the findings.",
            url: null
          }
        ],
        dataTransferred: null
      },
      reportedBy: {
        id: "mcm-policy-adapter",
        title: "Security Advisor MCM Policy Findings Adapter",
        url: null
      },
      context: {
        accountId: "id-mycluster-account",
        region: "clusterhub",
        resourceType: "Policy",
        resourceName: "1568663434469-policy-test",
        resourceId: "53dc2f7d-d8bb-11e9-a1ed-005056a0b88e",
        resourceCrn: null,
        serviceName: "icp4mcm-findings",
        serviceCrn: null,
        clusterName: "clusterhub",
        namespaceName: "Excludes: [kube-*], Includes: [default]"
      },
      securityClassification: {
        securityStandards: ["NIST"],
        securityCategories: ["SystemAndInformationIntegrity"],
        securityControl: "VA"
      },
      __typename: "Occurrence"
    },
    {
      name:
        "id-mycluster-account/providers/security-advisor/occurrences/clusterhub-policy-2ac9374f-d8b8-11e9-a1ed-005056a0b88e",
      shortDescription: "Policy that is not compliant",
      longDescription: "MCM Policy that is not compliant",
      providerId: "security-advisor",
      providerName: "id-mycluster-account/providers/security-advisor",
      remediation: "namespaces `prod` is missing, and should be created",
      updateTime: "2019-09-16T19:29:20.504573Z",
      finding: {
        severity: "HIGH",
        certainty: "HIGH",
        networkConnection: null,
        nextSteps: [
          {
            title:
              "View the details for the compliance problem in the occurrence of the findings.",
            url: null
          }
        ],
        dataTransferred: null
      },
      reportedBy: {
        id: "mcm-policy-adapter",
        title: "Security Advisor MCM Policy Findings Adapter",
        url: null
      },
      context: {
        accountId: "id-mycluster-account",
        region: "clusterhub",
        resourceType: "Policy",
        resourceName: "1568662077785-policy-test",
        resourceId: "2ac9374f-d8b8-11e9-a1ed-005056a0b88e",
        resourceCrn: null,
        serviceName: "icp4mcm-findings",
        serviceCrn: null,
        clusterName: "clusterhub",
        namespaceName: "Excludes: [kube-*], Includes: [default]"
      },
      securityClassification: {
        securityStandards: ["NIST"],
        securityCategories: ["SystemAndInformationIntegrity"],
        securityControl: "VA"
      },
      __typename: "Occurrence"
    },
    {
      name:
        "id-mycluster-account/providers/security-advisor/occurrences/clusterhub-policy-05b5c0ab-d8af-11e9-a1ed-005056a0b88e",
      shortDescription: "Policy that is not compliant",
      longDescription: "MCM Policy that is not compliant",
      providerId: "security-advisor",
      providerName: "id-mycluster-account/providers/security-advisor",
      remediation: "namespaces `prod` is missing, and should be created",
      updateTime: "2019-09-16T18:23:38.538343Z",
      finding: {
        severity: "HIGH",
        certainty: "HIGH",
        networkConnection: null,
        nextSteps: [
          {
            title:
              "View the details for the compliance problem in the occurrence of the findings.",
            url: null
          }
        ],
        dataTransferred: null
      },
      reportedBy: {
        id: "mcm-policy-adapter",
        title: "Security Advisor MCM Policy Findings Adapter",
        url: null
      },
      context: {
        accountId: "id-mycluster-account",
        region: "clusterhub",
        resourceType: "Policy",
        resourceName: "1568658149643-policy-test",
        resourceId: "05b5c0ab-d8af-11e9-a1ed-005056a0b88e",
        resourceCrn: null,
        serviceName: "icp4mcm-findings",
        serviceCrn: null,
        clusterName: "clusterhub",
        namespaceName: "Excludes: [kube-*], Includes: [default]"
      },
      securityClassification: {
        securityStandards: ["NIST"],
        securityCategories: ["SystemAndInformationIntegrity"],
        securityControl: "VA"
      },
      __typename: "Occurrence"
    },
    {
      name:
        "id-mycluster-account/providers/security-advisor/occurrences/clusterhub-policy-c5b7d402-d8aa-11e9-a1ed-005056a0b88e",
      shortDescription: "Policy that is not compliant",
      longDescription: "MCM Policy that is not compliant",
      providerId: "security-advisor",
      providerName: "id-mycluster-account/providers/security-advisor",
      remediation: "namespaces `prod` is missing, and should be created",
      updateTime: "2019-09-16T17:53:02.094098Z",
      finding: {
        severity: "HIGH",
        certainty: "HIGH",
        networkConnection: null,
        nextSteps: [
          {
            title:
              "View the details for the compliance problem in the occurrence of the findings.",
            url: null
          }
        ],
        dataTransferred: null
      },
      reportedBy: {
        id: "mcm-policy-adapter",
        title: "Security Advisor MCM Policy Findings Adapter",
        url: null
      },
      context: {
        accountId: "id-mycluster-account",
        region: "clusterhub",
        resourceType: "Policy",
        resourceName: "1568656322175-policy-test",
        resourceId: "c5b7d402-d8aa-11e9-a1ed-005056a0b88e",
        resourceCrn: null,
        serviceName: "icp4mcm-findings",
        serviceCrn: null,
        clusterName: "clusterhub",
        namespaceName: "Excludes: [kube-*], Includes: [default]"
      },
      securityClassification: {
        securityStandards: ["NIST"],
        securityCategories: ["SystemAndInformationIntegrity"],
        securityControl: "VA"
      },
      __typename: "Occurrence"
    },
    {
      name:
        "id-mycluster-account/providers/security-advisor/occurrences/clusterhub-policy-d99df1cb-d8a5-11e9-a1ed-005056a0b88e",
      shortDescription: "Policy that is not compliant",
      longDescription: "MCM Policy that is not compliant",
      providerId: "security-advisor",
      providerName: "id-mycluster-account/providers/security-advisor",
      remediation: "namespaces `prod` is missing, and should be created",
      updateTime: "2019-09-16T17:18:03.241122Z",
      finding: {
        severity: "HIGH",
        certainty: "HIGH",
        networkConnection: null,
        nextSteps: [
          {
            title:
              "View the details for the compliance problem in the occurrence of the findings.",
            url: null
          }
        ],
        dataTransferred: null
      },
      reportedBy: {
        id: "mcm-policy-adapter",
        title: "Security Advisor MCM Policy Findings Adapter",
        url: null
      },
      context: {
        accountId: "id-mycluster-account",
        region: "clusterhub",
        resourceType: "Policy",
        resourceName: "1568654209539-policy-test",
        resourceId: "d99df1cb-d8a5-11e9-a1ed-005056a0b88e",
        resourceCrn: null,
        serviceName: "icp4mcm-findings",
        serviceCrn: null,
        clusterName: "clusterhub",
        namespaceName: "Excludes: [kube-*], Includes: [default]"
      },
      securityClassification: {
        securityStandards: ["NIST"],
        securityCategories: ["SystemAndInformationIntegrity"],
        securityControl: "VA"
      },
      __typename: "Occurrence"
    },
    {
      name:
        "id-mycluster-account/providers/security-advisor/occurrences/clusterhub-policy-5b4caebf-d341-11e9-a1ed-005056a0b88e",
      shortDescription: "Policy that is not compliant",
      longDescription: "MCM Policy that is not compliant",
      providerId: "security-advisor",
      providerName: "id-mycluster-account/providers/security-advisor",
      remediation: "namespaces `prod` is missing, and should be created",
      updateTime: "2019-09-12T17:49:18.716240Z",
      finding: {
        severity: "HIGH",
        certainty: "HIGH",
        networkConnection: null,
        nextSteps: [
          {
            title:
              "View the details for the compliance problem in the occurrence of the findings.",
            url: null
          }
        ],
        dataTransferred: null
      },
      reportedBy: {
        id: "mcm-policy-adapter",
        title: "Security Advisor MCM Policy Findings Adapter",
        url: null
      },
      context: {
        accountId: "id-mycluster-account",
        region: "clusterhub",
        resourceType: "Policy",
        resourceName: "1568061286260-policy-test",
        resourceId: "5b4caebf-d341-11e9-a1ed-005056a0b88e",
        resourceCrn: null,
        serviceName: "icp4mcm-findings",
        serviceCrn: null,
        clusterName: "clusterhub",
        namespaceName: "Excludes: [kube-*], Includes: [default]"
      },
      securityClassification: {
        securityStandards: ["NIST"],
        securityCategories: ["SystemAndInformationIntegrity"],
        securityControl: "VA"
      },
      __typename: "Occurrence"
    },
    {
      name:
        "id-mycluster-account/providers/security-advisor/occurrences/clusterhub-policy-34c2d5bc-d337-11e9-a1ed-005056a0b88e",
      shortDescription: "Policy that is not compliant",
      longDescription: "MCM Policy that is not compliant",
      providerId: "security-advisor",
      providerName: "id-mycluster-account/providers/security-advisor",
      remediation: "namespaces `prod` is missing, and should be created",
      updateTime: "2019-09-12T17:49:17.093456Z",
      finding: {
        severity: "HIGH",
        certainty: "HIGH",
        networkConnection: null,
        nextSteps: [
          {
            title:
              "View the details for the compliance problem in the occurrence of the findings.",
            url: null
          }
        ],
        dataTransferred: null
      },
      reportedBy: {
        id: "mcm-policy-adapter",
        title: "Security Advisor MCM Policy Findings Adapter",
        url: null
      },
      context: {
        accountId: "id-mycluster-account",
        region: "clusterhub",
        resourceType: "Policy",
        resourceName: "1568056925581-policy-test",
        resourceId: "34c2d5bc-d337-11e9-a1ed-005056a0b88e",
        resourceCrn: null,
        serviceName: "icp4mcm-findings",
        serviceCrn: null,
        clusterName: "clusterhub",
        namespaceName: "Excludes: [kube-*], Includes: [default]"
      },
      securityClassification: {
        securityStandards: ["NIST"],
        securityCategories: ["SystemAndInformationIntegrity"],
        securityControl: "VA"
      },
      __typename: "Occurrence"
    },
    {
      name:
        "id-mycluster-account/providers/security-advisor/occurrences/clusterhub-policy-4fe26689-d302-11e9-a1ed-005056a0b88e",
      shortDescription: "Policy that is not compliant",
      longDescription: "MCM Policy that is not compliant",
      providerId: "security-advisor",
      providerName: "id-mycluster-account/providers/security-advisor",
      remediation: "namespaces `prod` is missing, and should be created",
      updateTime: "2019-09-12T17:49:12.892542Z",
      finding: {
        severity: "HIGH",
        certainty: "HIGH",
        networkConnection: null,
        nextSteps: [
          {
            title:
              "View the details for the compliance problem in the occurrence of the findings.",
            url: null
          }
        ],
        dataTransferred: null
      },
      reportedBy: {
        id: "mcm-policy-adapter",
        title: "Security Advisor MCM Policy Findings Adapter",
        url: null
      },
      context: {
        accountId: "id-mycluster-account",
        region: "clusterhub",
        resourceType: "Policy",
        resourceName: "1568034219566-policy-test",
        resourceId: "4fe26689-d302-11e9-a1ed-005056a0b88e",
        resourceCrn: null,
        serviceName: "icp4mcm-findings",
        serviceCrn: null,
        clusterName: "clusterhub",
        namespaceName: "Excludes: [kube-*], Includes: [default]"
      },
      securityClassification: {
        securityStandards: ["NIST"],
        securityCategories: ["SystemAndInformationIntegrity"],
        securityControl: "VA"
      },
      __typename: "Occurrence"
    },
    {
      name:
        "id-mycluster-account/providers/security-advisor/occurrences/clusterhub-policy-9cc06eb5-d308-11e9-a1ed-005056a0b88e",
      shortDescription: "Policy that is not compliant",
      longDescription: "MCM Policy that is not compliant",
      providerId: "security-advisor",
      providerName: "id-mycluster-account/providers/security-advisor",
      remediation: "namespaces `prod` is missing, and should be created",
      updateTime: "2019-09-12T17:49:01.556249Z",
      finding: {
        severity: "HIGH",
        certainty: "HIGH",
        networkConnection: null,
        nextSteps: [
          {
            title:
              "View the details for the compliance problem in the occurrence of the findings.",
            url: null
          }
        ],
        dataTransferred: null
      },
      reportedBy: {
        id: "mcm-policy-adapter",
        title: "Security Advisor MCM Policy Findings Adapter",
        url: null
      },
      context: {
        accountId: "id-mycluster-account",
        region: "clusterhub",
        resourceType: "Policy",
        resourceName: "1568036913520-policy-test",
        resourceId: "9cc06eb5-d308-11e9-a1ed-005056a0b88e",
        resourceCrn: null,
        serviceName: "icp4mcm-findings",
        serviceCrn: null,
        clusterName: "clusterhub",
        namespaceName: "Excludes: [kube-*], Includes: [default]"
      },
      securityClassification: {
        securityStandards: ["NIST"],
        securityCategories: ["SystemAndInformationIntegrity"],
        securityControl: "VA"
      },
      __typename: "Occurrence"
    }
  ],
  custom: {
    highSeverity: "Policy that is not compliant (13)"
  }
};

export const sidePanelResourceTypeFindingsClusters = {
  name: "HCMClusterFindings",
  list: "HCMClusterFindingsList"
};

export const findingsSidePanelData = {
  kind: "HCMSecurityFindings",
  name:
    "id-mycluster-account/providers/security-advisor/occurrences/clusterhub-policy-bf080cda-e44a-11e9-8895-005056a061f1",
  shortDescription: "Policy that is not compliant",
  longDescription: "MCM Policy that is not compliant",
  providerId: "security-advisor",
  providerName: "id-mycluster-account/providers/security-advisor",
  remediation:
    'mapping error from raw object: `no matches for kind "MutationPolicy" in version "policies.ibm.com/v1alpha1"`',
  updateTime: "2019-10-07T16:33:50.061244Z",
  finding: {
    severity: "MEDIUM",
    certainty: "HIGH",
    networkConnection: null,
    nextSteps: [
      {
        title:
          "View the details for the compliance problem in the occurrence of the findings.",
        url: null
      }
    ],
    dataTransferred: null
  },
  reportedBy: {
    id: "mcm-policy-adapter",
    title: "Security Advisor MCM Policy Findings Adapter",
    url: null
  },
  context: {
    accountId: "id-mycluster-account",
    region: "clusterhub",
    resourceType: "Policy",
    resourceName: "policy-mutationpolicy",
    resourceId: "bf080cda-e44a-11e9-8895-005056a061f1",
    resourceCrn: null,
    serviceName: "icp4mcm-findings",
    serviceCrn: null,
    clusterName: "clusterhub",
    namespaceName: "Excludes: [kube-*], Includes: [default]"
  },
  securityClassification: {
    securityStandards: ["HIPAA", " NIST", " PCI", " FISMA"],
    securityCategories: ["SystemAndInformationIntegrity"],
    securityControl: "MutationAdvisor"
  },
  __typename: "Occurrence",
  custom: {
    context: "Policy: policy-mutationpolicy",
    "finding.severity": "Medium",
    "securityClassification.securityStandards": "HIPAA, NIST, PCI, FISMA",
    "securityClassification.securityControl": "Mutation Advisor",
    "securityClassification.securityCategories":
      "System And Information Integrity",
    updateTime: "-"
  }
};

export const resourceType = {
  name: "HCMSecurityFindings",
  list: "HCMSecurityFindingsList"
};

export const resourceModalLabelsDummy = {
  primaryBtn: "modal.remove-hcmpolicy.heading",
  label: "modal.remove-hcmpolicy.label",
  heading: "modal.remove-hcmpolicy.heading"
};

export const resourceModalLabels = {
  primaryBtn: "modal.remove-queryapplications.heading",
  label: "modal.remove-queryapplications.label",
  heading: "modal.remove-queryapplications.heading"
};

export const availableFilters = {
  standards: {
    name: "Standards",
    availableSet: ["FISMA", "PCI", "HIPAA", "NIST"]
  },
  categories: {
    name: "Categories",
    availableSet: [
      "System And Communications Protections",
      "System And Information Integrity"
    ]
  },
  controls: {
    name: "Controls",
    availableSet: [
      "Secret Encryption",
      "Cert Manager",
      "Mutation Advisor",
      "VA"
    ]
  },
  type: {
    name: "Type",
    availableSet: ["Enforce", "Inform only"]
  },
  severity: {
    availableSet: []
  }
};

export const resourceModalData = {
  kind: "Application",
  apiVersion: "app.k8s.io/v1beta1",
  _uid: "local-cluster/42d4c013-52b9-11ea-bf05-00000a102d26",
  metadata: {
    name: "samplebook-gbap",
    namespace: "sample",
    selfLink:
      "/apis/app.k8s.io/v1beta1/namespaces/sample/applications/samplebook-gbap"
  },
  selfLink:
    "/apis/app.k8s.io/v1beta1/namespaces/sample/applications/samplebook-gbap",
  name: "samplebook-gbap",
  namespace: "sample",
  dashboard: null,
  clusterCount: 0,
  hubSubscriptions: [],
  created: "2019-12-11T01:24:02Z",
  __typename: "Application"
};

export const resourceModalDataDel2 = {
  kind: "Application",
  apiVersion: "app.k8s.io/v1beta1",
  _uid: "local-cluster/42d4c013-52b9-11ea-bf05-00000a102d26",
  selfLink:
    "/apis/app.k8s.io/v1beta1/namespaces/sample/applications/samplebook-gbap",
  name: "samplebook-gbap",
  namespace: "sample",
  dashboard: null,
  clusterCount: 0,
  hubSubscriptions: [],
  created: "2019-12-11T01:24:02Z",
  __typename: "Application",
  selected: [{ id: "1" }, { id: 2 }]
};

export const resourceModalDataChildApp = {
  kind: "Application",
  apiVersion: "app.k8s.io/v1beta1",
  selfLink: "/apis/app.k8s.io/v1beta1/namespaces/sample/applications/childApp",
  name: "childApp",
  namespace: "sample"
};

export const resourceModalDataMultiLevelApp = {
  kind: "Application",
  apiVersion: "app.k8s.io/v1beta1",
  selfLink:
    "/apis/app.k8s.io/v1beta1/namespaces/sample/applications/multiLevelApp",
  name: "multiLevelApp",
  namespace: "sample"
};

export const resourceModalDataSimpleApp = {
  apiVersion: "app.k8s.io/v1beta1",
  name: "helloworld-simple-ns",
  namespace: "helloworld-simple-ns",
  _uid: "local-cluster/7e2f0485-9109-4d39-b25b-529c57c20b0a",
  kind: "Application",
  __typename: "ModalData"
};

export const resourceModalYAML =
  "apiVersion: app.k8s.io/v1beta1\nkind: Application\nmetadata:\n  name: samplebook-gbapp\n  namespace: sample\n  generation: 2\n  labels:\n    app: gbapp\n    chart: gbapp-0.1.0\n    heritage: Tiller\n    release: samplebook\n  resourceVersion: '6277488'\nspec:\n  componentKinds:\n    - group: apps.open-cluster-management.io\n      kind: Subscription\n  descriptor: {}\n  selector:\n    matchExpressions:\n      - key: release\n        operator: In\n        values:\n          - samplebook\nstatus: {}";
