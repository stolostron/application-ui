/** *****************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2016, 2019. All Rights Reserved.
 *
 * US Government Users Restricted Rights - Use, duplication or disclosure
 * restricted by GSA ADP Schedule Contract with IBM Corp.
 *******************************************************************************/
// Copyright (c) 2020 Red Hat, Inc.
// Copyright Contributors to the Open Cluster Management project

import { mapSingleApplication } from "../../../../src-web/reducers/data-mappers/mapApplicationsSingle";

describe("data-mappers testing for mapSingleApplication no items", () => {
  it("should mold the data properly with no items", () => {
    const application = {
      items: [],
      related: []
    };

    const result = [
      {
        _hubClusterResource: "",
        _rbac: "",
        _uid: "",
        apigroup: "",
        cluster: "",
        created: "",
        dashboard: "",
        kind: "",
        label: "",
        name: "",
        namespace: "",
        related: [],
        selfLink: ""
      }
    ];

    expect(mapSingleApplication(application)).toEqual(result);
  });
});

describe("data-mappers testing for mapSingleApplication", () => {
  it("should mold the data properly", () => {
    const application = {
      items: [
        {
          kind: "application",
          name: "samplebook-gbapp",
          namespace: "sample",
          selfLink:
            "/apis/app.k8s.io/v1beta1/namespaces/sample/applications/samplebook-gbapp"
        }
      ],
      related: [
        {
          kind: "placementrule",
          name: "samplebook-gbapp",
          namespace: "sample",
          selfLink:
            "/apis/app.k8s.io/v1beta1/namespaces/sample/applications/samplebook-gbapp"
        }
      ]
    };

    const result = [
      {
        kind: "application",
        name: "samplebook-gbapp",
        namespace: "sample",
        related: [
          {
            kind: "placementrule",
            name: "samplebook-gbapp",
            namespace: "sample",
            selfLink:
              "/apis/app.k8s.io/v1beta1/namespaces/sample/applications/samplebook-gbapp"
          }
        ],
        selfLink:
          "/apis/app.k8s.io/v1beta1/namespaces/sample/applications/samplebook-gbapp"
      }
    ];

    expect(mapSingleApplication(application)).toEqual(result);
  });

  it("should not break on undefined response", () => {
    const result = [
      {
        name: "",
        namespace: "",
        dashboard: "",
        selfLink: "",
        _uid: "",
        created: "",
        apigroup: "",
        cluster: "",
        kind: "",
        label: "",
        _hubClusterResource: "",
        _rbac: "",
        related: []
      }
    ];

    expect(mapSingleApplication(undefined)).toEqual(result);
  });
});
