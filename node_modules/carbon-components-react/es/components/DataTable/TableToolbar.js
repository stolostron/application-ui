import { settings } from 'carbon-components';
import wrapComponent from '../../tools/wrapComponent';
var prefix = settings.prefix;
var TableToolbar = wrapComponent({
  name: 'TableToolbar',
  type: 'section',
  className: "".concat(prefix, "--table-toolbar")
});
export default TableToolbar;