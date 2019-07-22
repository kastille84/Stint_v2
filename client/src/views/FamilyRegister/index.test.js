import React from 'react';
import {shallow} from 'enzyme';
import Register, {UnconnectedRegister} from './Register';

import {findByTestAttr, storeFactory} from '../../util/testUtils';

const setup = (state={}) => {
  const store = storeFactory(state);
  const wrapper = shallow(<Register store={store} />).dive().dive().dive();
  console.debug('wrapper', wrapper)
  return wrapper;
}

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

describe('Redux Props', () => {
  test('has form piece of state', () => {
    const wrapper = setup(initialState);
    const registerFormProp = wrapper.instance().props.registerForm;
    expect(registerFormProp.values).toEqual(initialState.form.register.values);
  });
});

describe('API', () => {
  let registerFamMock
  let wrapper;
  beforeEach(() => {
    const props = initialState;
    registerFamMock = jest.fn();
    wrapper = shallow(<UnconnectedRegister {...props} />)
    const registerButton = findByTestAttr(wrapper,'register-button');
    registerButton.simulate("click", {preventDefault(){} });
  })

  test('registerFam gets called with correct data', () => {
    const registerFamCallCount = registerFamMock.mock.calls.length;
    expect(registerFamCallCount).toBe(1);
  });
});