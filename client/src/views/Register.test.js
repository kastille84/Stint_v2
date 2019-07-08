import React from 'react';
import {shallow} from 'enzyme';
import Register, {UnconnectedRegister} from './Register';

import {findByTestAttr, storeFactory} from '../util/testUtils';

const setup = (state={}) => {
  const store = storeFactory(state);
  const wrapper = shallow(<Register store={store} />).dive().dive().dive();
  return wrapper;
}

// test('should render Register component', () => {
//   const wrapper = shallow(<UnconnectedRegister />);
//   const component = findByTestAttr(wrapper, 'register');
//   expect(component.length).toBe(1);
// });

describe('Redux Props', () => {
  test('has form piece of state', () => {
    const initialState = {
        form: {
          register: {
            values: {
              email: "kastille84@gmail.com",
              nickname: "martinez clan",
              password: "22test22"
            }  
          }
        }
    }
    const wrapper = setup(initialState);
    const registerFormProp = wrapper.instance().props.registerForm;
    expect(registerFormProp.values).toEqual(initialState.form.register.values);
  });
});