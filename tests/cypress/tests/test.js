import { pageLoader, resourceTable, modal, noResource } from "../views/common";

describe("Application Resources", () => {
  // beforeEach(() => {
  //     cy.visit('/multicloud/applications')
  //     cy.contains('Resources').click()
  // })

  it("test", () => {
    cy.task("getFileList", "subscription").then(list => {
      list.forEach(file => {
        cy.deleteAppResourcesInFileAPI(Cypress.env("token"), file);
      });
    });
    // cy.task('getResourceMetadataInFile','channel-github.yaml').then(data => {
    //     cy.log(data)
    // })
    // cy.task('getFileList','.yaml').then((list) => {
    //     list.forEach((file) => {
    //         cy.task('yaml2json',file).then((data) =>{
    //             let arr = JSON.parse(data)
    //             arr.forEach(element => {
    //                 if (element.kind == 'Namespace') {
    //                     cy.log(element.metadata.name)
    //                     cy.deleteNamespaceAPI(Cypress.env('token'),element.metadata.name)
    //                 }
    //             })
    //         })
  });
});
