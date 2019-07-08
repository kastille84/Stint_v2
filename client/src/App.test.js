import React from 'react';
import App, {UnconnectedApp} from './App';

import {findByTestAttr} from './util/testUtils';
import {shallow} from 'enzyme';



test('renders loader when content is not loaded', () => {
  // const wrapper = shallow(<UnconnectedApp />);
  // wrapper.instance().setState({loading: false, loaded: true});
  // const loader = findByTestAttr(wrapper,'loader');
  // console.log('loader', loader)
  // expect(loader.length).toBe(1);
})
