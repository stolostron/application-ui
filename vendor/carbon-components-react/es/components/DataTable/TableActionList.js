import { settings } from 'carbon-components';
import wrapComponent from '../../tools/wrapComponent';
var prefix = settings.prefix;
var TableActionList = wrapComponent({
  name: 'TableActionList',
  type: 'div',
  className: "".concat(prefix, "--action-list")
});
export default TableActionList;