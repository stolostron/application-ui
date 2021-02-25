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

export const placementControlData = {
  id: "placementrulecombo",
  type: "singleselect",
  groupControlData: [
    {
      id: "selectedRuleName",
      type: "hidden"
    },
    {
      id: "existingrule-checkbox",
      controlId: "existingrule-checkbox",
      type: "checkbox",
      available: [],
      groupControlData: [
        {
          id: "local-cluster-checkbox",
          type: "checkbox"
        },
        {
          id: "placementrulecombo",
          type: "singleselect"
        },
        {
          id: "online-cluster-only-checkbox",
          type: "checkbox"
        },
        {
          id: "selectedRuleName",
          type: "hidden"
        },
        {
          id: "clusterSelector",
          controlId: "clusterSelector",
          type: "hidden",
          active: {}
        }
      ]
    }
  ]
};

export const emptyTemplateObject = {
  Application: [],
  Channel: [],
  PlacementRule: [],
  Subscription: []
};

export const templateObject = {
  Application: [
    {
      $raw: {
        apiVersion: "app.k8s.io/v1beta1",
        kind: "Application",
        metadata: {
          name: null,
          namespace: null
        },
        spec: {
          componentKinds: [
            {
              group: "apps.open-cluster-management.io",
              kind: "Subscription"
            }
          ],
          descriptor: {},
          selector: {
            matchExpressions: [
              {
                key: "app",
                operator: "In",
                values: [null]
              }
            ]
          }
        }
      },
      $yml:
        "apiVersion: app.k8s.io/v1beta1\nkind: Application\nmetadata:\n  name: \n  namespace: \nspec:\n  componentKinds:\n  - group: apps.open-cluster-management.io\n    kind: Subscription\n  descriptor: {}\n  selector:\n    matchExpressions:\n      - key: app\n        operator: In\n        values: \n          -",
      $synced: {
        apiVersion: {
          $r: 0,
          $l: 1,
          $v: "app.k8s.io/v1beta1"
        },
        kind: {
          $r: 1,
          $l: 1,
          $v: "Application"
        },
        metadata: {
          $r: 2,
          $l: 3,
          $v: {
            name: {
              $r: 3,
              $l: 1,
              $v: null
            },
            namespace: {
              $r: 4,
              $l: 1,
              $v: null
            }
          }
        },
        spec: {
          $r: 5,
          $l: 11,
          $v: {
            componentKinds: {
              $r: 6,
              $l: 3,
              $v: [
                {
                  $r: 7,
                  $l: 2,
                  $v: {
                    group: {
                      $r: 7,
                      $l: 1,
                      $v: "apps.open-cluster-management.io"
                    },
                    kind: {
                      $r: 8,
                      $l: 1,
                      $v: "Subscription"
                    }
                  }
                }
              ]
            },
            descriptor: {
              $r: 9,
              $l: 1,
              $v: {}
            },
            selector: {
              $r: 10,
              $l: 6,
              $v: {
                matchExpressions: {
                  $r: 11,
                  $l: 5,
                  $v: [
                    {
                      $r: 12,
                      $l: 4,
                      $v: {
                        key: {
                          $r: 12,
                          $l: 1,
                          $v: "app"
                        },
                        operator: {
                          $r: 13,
                          $l: 1,
                          $v: "In"
                        },
                        values: {
                          $r: 14,
                          $l: 2,
                          $v: [16]
                        }
                      }
                    }
                  ]
                }
              }
            }
          }
        },
        $r: 0,
        $l: 16
      }
    }
  ],
  Channel: [
    {
      $raw: {
        apiVersion: "apps.open-cluster-management.io/v1",
        kind: "Channel",
        metadata: {
          name: null,
          namespace: "-ns"
        },
        spec: {
          type: "Git"
        }
      },
      $yml:
        "apiVersion: apps.open-cluster-management.io/v1\nkind: Channel\nmetadata:\n  name: \n  namespace: -ns\nspec:\n  type: Git",
      $synced: {
        apiVersion: {
          $r: 17,
          $l: 1,
          $v: "apps.open-cluster-management.io/v1"
        },
        kind: {
          $r: 18,
          $l: 1,
          $v: "Channel"
        },
        metadata: {
          $r: 19,
          $l: 3,
          $v: {
            name: {
              $r: 20,
              $l: 1,
              $v: null
            },
            namespace: {
              $r: 21,
              $l: 1,
              $v: "-ns"
            }
          }
        },
        spec: {
          $r: 22,
          $l: 2,
          $v: {
            type: {
              $r: 23,
              $l: 1,
              $v: "Git"
            }
          }
        },
        $r: 17,
        $l: 7
      }
    }
  ],
  Subscription: [
    {
      $raw: {
        apiVersion: "apps.open-cluster-management.io/v1",
        kind: "Subscription",
        metadata: {
          annotations: {
            "apps.open-cluster-management.io/git-branch": null,
            "apps.open-cluster-management.io/git-path": null,
            "apps.open-cluster-management.io/reconcile-option": "merge"
          },
          labels: {
            app: null
          },
          name: "-subscription-1",
          namespace: null
        },
        spec: {
          channel: "-ns/",
          placement: {
            placementRef: {
              kind: "PlacementRule",
              name: "-placement-1"
            }
          }
        }
      },
      $yml:
        "apiVersion: apps.open-cluster-management.io/v1\nkind: Subscription\nmetadata:\n  annotations:\n    apps.open-cluster-management.io/git-branch: \n    apps.open-cluster-management.io/git-path: \n    apps.open-cluster-management.io/reconcile-option: merge\n  labels:\n    app: \n  name: -subscription-1\n  namespace: \nspec:\n  channel: -ns/\n  placement:\n    placementRef:\n      kind: PlacementRule\n      name: -placement-1",
      $synced: {
        apiVersion: {
          $r: 25,
          $l: 1,
          $v: "apps.open-cluster-management.io/v1"
        },
        kind: {
          $r: 26,
          $l: 1,
          $v: "Subscription"
        },
        metadata: {
          $r: 27,
          $l: 9,
          $v: {
            annotations: {
              $r: 28,
              $l: 4,
              $v: {
                "apps.open-cluster-management.io/git-branch": {
                  $r: 29,
                  $l: 1,
                  $v: null
                },
                "apps.open-cluster-management.io/git-path": {
                  $r: 30,
                  $l: 1,
                  $v: null
                },
                "apps.open-cluster-management.io/reconcile-option": {
                  $r: 31,
                  $l: 1,
                  $v: "merge"
                }
              }
            },
            labels: {
              $r: 32,
              $l: 2,
              $v: {
                app: {
                  $r: 33,
                  $l: 1,
                  $v: null
                }
              }
            },
            name: {
              $r: 34,
              $l: 1,
              $v: "-subscription-1"
            },
            namespace: {
              $r: 35,
              $l: 1,
              $v: null
            }
          }
        },
        spec: {
          $r: 36,
          $l: 6,
          $v: {
            channel: {
              $r: 37,
              $l: 1,
              $v: "-ns/"
            },
            placement: {
              $r: 38,
              $l: 4,
              $v: {
                placementRef: {
                  $r: 39,
                  $l: 3,
                  $v: {
                    kind: {
                      $r: 40,
                      $l: 1,
                      $v: "PlacementRule"
                    },
                    name: {
                      $r: 41,
                      $l: 1,
                      $v: "-placement-1"
                    }
                  }
                }
              }
            }
          }
        },
        $r: 25,
        $l: 17
      }
    }
  ],
  PlacementRule: [
    {
      $raw: {
        apiVersion: "apps.open-cluster-management.io/v1",
        kind: "PlacementRule",
        metadata: {
          labels: {
            app: null
          },
          name: "-placement-1",
          namespace: null
        },
        spec: {
          clusterSelector: {
            matchLabels: null
          }
        }
      },
      $yml:
        "apiVersion: apps.open-cluster-management.io/v1\nkind: PlacementRule\nmetadata:\n  labels:\n    app: \n  name: -placement-1\n  namespace: \nspec:\n  clusterSelector:\n    matchLabels:",
      $synced: {
        apiVersion: {
          $r: 43,
          $l: 1,
          $v: "apps.open-cluster-management.io/v1"
        },
        kind: {
          $r: 44,
          $l: 1,
          $v: "PlacementRule"
        },
        metadata: {
          $r: 45,
          $l: 5,
          $v: {
            labels: {
              $r: 46,
              $l: 2,
              $v: {
                app: {
                  $r: 47,
                  $l: 1,
                  $v: null
                }
              }
            },
            name: {
              $r: 48,
              $l: 1,
              $v: "-placement-1"
            },
            namespace: {
              $r: 49,
              $l: 1,
              $v: null
            }
          }
        },
        spec: {
          $r: 50,
          $l: 3,
          $v: {
            clusterSelector: {
              $r: 51,
              $l: 2,
              $v: {
                matchLabels: {
                  $r: 52,
                  $l: 1,
                  $v: null
                }
              }
            }
          }
        },
        $r: 43,
        $l: 10
      }
    }
  ]
};
