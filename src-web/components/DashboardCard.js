import React from 'react'
import PropTypes from 'prop-types'
import config from '../../lib/shared/config'
import { Module, ModuleHeader, ModuleBody, Table, TableBody, TableRow, TableData } from 'carbon-components-react'

const DashboardOrb = ({ status = 'healthy', value, className = '' }) => (
  <div className={`dashboard-count ${className}`}>
    <div className="dashboard-orb">
      <div className={`dashboard-orb dashboard-orb__inner dashboard-orb__${status}`}>{value}</div>
    </div>
    <p>{status}</p>
  </div>
)

const OrbPropType = {
  className: PropTypes.string,
  status: PropTypes.string,
  value: PropTypes.number,
}

DashboardOrb.propTypes = OrbPropType

const DashboardTableRow = ({ link, percentage, resourceName, status, ...rest }) => (
  <TableRow {...rest}>
    <TableData className='dashboard-status'>
      <img src={`${config.contextPath}/graphics/${status}.svg`} alt='Row Status' />
      {link ? <a href={link}>{resourceName}</a> : <p>{resourceName}</p> }
    </TableData>
    <TableData>{`${percentage}%`}</TableData>
  </TableRow>
)

const TableRowPropType = {
  link: PropTypes.string,
  percentage: PropTypes.number,
  resourceName: PropTypes.string,
  status: PropTypes.string,
}

DashboardTableRow.propTypes = TableRowPropType

const DashboardTable = ({ table, ...rest }) => (
  <Table className='dashboard-table' {...rest}>
    <TableBody>
      {table.map((row, ind) => <DashboardTableRow even={!(ind % 2)} {...row} key={row.resourceName} />)}
    </TableBody>
  </Table>
)

DashboardTable.propTypes = {
  table: PropTypes.arrayOf(PropTypes.shape(TableRowPropType))
}

const getTableStatus = overview => {
  switch (true) {
  case overview.find(({ status }) => status === 'critical').value > 0:
    return 'critical'

  case overview.find(({ status }) => status === 'warning').value > 0:
    return 'warning'

  default:
    return 'healthy'
  }
}

const DashboardCard = ({ title, data: { overview, table }, ...rest }) => (
  <Module className={`dashboard-card dashboard-card__${getTableStatus(overview)}`} size="single" {...rest}>
    <ModuleHeader>{title}</ModuleHeader>
    <ModuleBody>
      <div className="dashboard-overview">
        {overview.map(stat => <DashboardOrb {...stat} key={stat.status} />)}
      </div>
      <DashboardTable table={table} />
    </ModuleBody>
  </Module>
)

DashboardCard.propTypes = {
  data: PropTypes.shape({
    overview: PropTypes.arrayOf(PropTypes.shape(OrbPropType)),
    table: PropTypes.arrayOf(PropTypes.shape(TableRowPropType))
  }),
  title: PropTypes.string
}

export default DashboardCard
