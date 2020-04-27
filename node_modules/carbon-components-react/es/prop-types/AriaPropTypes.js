import PropTypes from 'prop-types';
import isRequiredOneOf from './isRequiredOneOf';
export var AriaLabelPropType = isRequiredOneOf({
  'aria-label': PropTypes.string,
  'aria-labelledby': PropTypes.string
});