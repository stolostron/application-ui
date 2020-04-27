import { settings } from 'carbon-components';
import wrapComponent from '../../tools/wrapComponent';
var prefix = settings.prefix;
/**
 * Generic container for `HeaderGlobalAction` components
 */

export default wrapComponent({
  name: 'HeaderGlobalBar',
  className: "".concat(prefix, "--header__global"),
  type: 'div'
});