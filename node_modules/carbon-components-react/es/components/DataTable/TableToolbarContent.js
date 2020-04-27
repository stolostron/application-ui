import wrapComponent from '../../tools/wrapComponent';
import { settings } from 'carbon-components';
var prefix = settings.prefix;
var TableToolbarContent = wrapComponent({
  name: 'TableToolbarContent',
  type: 'div',
  className: "".concat(prefix, "--toolbar-content")
});
export default TableToolbarContent;