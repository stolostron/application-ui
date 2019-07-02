/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2017, 2019. All Rights Reserved.
 *
 * Note to U.S. Government Users Restricted Rights:
 * Use, duplication or disclosure restricted by GSA ADP Schedule
 * Contract with IBM Corp.
 *******************************************************************************/

import React from 'react';
import msgs from '../../../../../nls/platform.properties';
import { withLocale } from '../../../../providers/LocaleProvider';
import resources from '../../../../../lib/shared/resources';
import { createApplicationRows, createApplicationRowsLookUp } from './utils';
import { Tile, DataTable } from 'carbon-components-react';

const {
  TableBody,
  Table,
  TableExpandRow,
  TableCell,
  TableExpandedRow,
} = DataTable;

resources(() => {
  require('./style.scss');
});

// We would have a headers array like the following
const headerss = [
  {
    // `key` is the name of the field on the row object itself for the header
    key: 'name',
    // `header` will be the name you want rendered in the Table Header
    header: 'Foo',
  },
];

const DisplayDeployables = ({ dList }, { locale }) => {
  return (
    <div className="DisplayDeployablesContainer">
      {dList.map((deployable) => {
        const dName =
          (deployable && deployable.metadata && deployable.metadata.name) || '';
        return <div className="deployableName">{dName}</div>;
      })}
    </div>
  );
};

const PipelineGrid = withLocale(({ deployables, applications, locale }) => {
  const applicationRows = createApplicationRows(applications);
  const applicationRowsLookUp = createApplicationRowsLookUp(applications);
  return (
    <div id="PipelineGrid">
      <div className="tileContainer">
        <Tile className="firstTotalTile">
          <div className="totalApplications">
            {`${applications.length} `}
            {msgs.get('description.title.applications', locale)}
          </div>
          <div className="totalDeployables">
            {`${deployables.length} `}
            {msgs.get('description.title.deployables', locale)}
          </div>
        </Tile>
      </div>
      <div className="horizontalScroll-outer">
        <div className="horizontalScroll-inner">
          <DataTable
            headers={headerss}
            rows={applicationRows}
            render={({ rows, headers, getRowProps, getTableProps }) => (
              <Table {...getTableProps()}>
                <TableBody>
                  {rows.map((row) => {
                    const thisRowId = row.id;
                    const deployablesList =
                      applicationRowsLookUp[thisRowId].deployables || [];
                    return (
                      <React.Fragment key={thisRowId}>
                        <TableExpandRow {...getRowProps({ row })}>
                          {row.cells.map(cell => (
                            <TableCell key={cell.id} className="tableCell">
                              <div className="applicationEntryName">
                                {cell.value}
                              </div>
                              <div>
                                {`${deployablesList.length} ${msgs.get(
                                  'description.title.deployables',
                                  locale,
                                )}`}
                              </div>
                            </TableCell>
                          ))}
                        </TableExpandRow>
                        {/* toggle based off of if the row is expanded. If it is, render TableExpandedRow */}
                        {row.isExpanded && (
                          <TableExpandedRow colSpan={headers.length}>
                            <DisplayDeployables dList={deployablesList} />
                          </TableExpandedRow>
                        )}
                      </React.Fragment>
                    );
                  })}
                </TableBody>
              </Table>
            )}
          />
        </div>
      </div>
    </div>
  );
});
export default withLocale(PipelineGrid);
