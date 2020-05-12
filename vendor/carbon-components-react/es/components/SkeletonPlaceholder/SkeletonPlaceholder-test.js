import React from 'react';
import SkeletonPlaceholder from '../SkeletonPlaceholder';
import { shallow } from 'enzyme';
describe('SkeletonPlaceholder', function () {
  var wrapper = shallow(React.createElement(SkeletonPlaceholder, null));
  it('Has the expected classes', function () {
    expect(wrapper.hasClass('bx--skeleton__placeholder')).toEqual(true);
  });
});