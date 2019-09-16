import React, { Component } from 'react';
import {connect} from 'react-redux';
import {Link} from 'react-router-dom';
import { Field, reduxForm, Form, SubmissionError, reset } from 'redux-form';
import {Alert} from 'reactstrap';
import api from '../../api';
import {haveJWTNotProtected} from '../../util/utils';
import {
  REGISTER_FAMILY,
  REGISTER_FAMILY_DONE
} from '../../constants';

const mapStateToProps = (state) => ({
  registerForm: state.form.register,
  family: state.family
});
const mapDispatchToProps = (dispatch) => ({
  registerFamily: (data, cbPush, cbVisible) => {
    dispatch({type: REGISTER_FAMILY});
    api.Family.registerFam(data)
      .then(payload => {
        dispatch({type: REGISTER_FAMILY_DONE, payload: payload});
        //localStorage.setItem('family_jwt', payload.token);
        api.agent.setSession('family_jwt',payload.token );
        //redirect to SelectUser page
        cbPush('/which-user');
      })
      .catch(err => {
        dispatch({type: REGISTER_FAMILY_DONE, error: err});
        cbVisible(true)
      })
  }
});

export class UnconnectedFamilyRegister extends Component {
  state = {
    showPass: false,
    visible: false,
    errorMessage: null
  }

  componentDidMount() {
    haveJWTNotProtected(this.props.history.push)
  }

  onDismissAlert = () => {
    this.setState({visible: false})
  }
 
  toggleShowPass = () => {
    this.setState({showPass: !this.state.showPass});
  }

  handleSubmit = (values) => {
    
    const requiredSp = /[!#$%()*+,\-./:;<=>?@[\\\]^_`{|}~]/;
    const requiredNum = /[0-9]/;
    const requiredAlph = /[a-zA-Z]/;
    //validate values

    //password > 8 characters
    if(values.family_password.length <= 8) {
      this.setState({
        visible: true,
        errorMessage: "Password should be more than 8 characters."
      })
      return;
    }
    //password has at least one alphabet letter
    if(!requiredAlph.test(values.family_password)) {
      this.setState({
        visible: true,
        errorMessage: "Password must contain at least one alphabet."
      })
      return;
    }
    //password has at least one special character
    if(!requiredSp.test(values.family_password)) {
      this.setState({
        visible: true,
        errorMessage: `Password must contain at least one special character except the following: & ' "`
      })
      return;
    }

    //at this point, validation passed. Make API call
    this.props.registerFamily(
      values, 
      (url) => {
        this.props.history.push(url);
      },
      (visibleVal) => {
        this.setState({visible: visibleVal})
      },
    )
  }

  renderAlert = (type) => {
    if (this.state.errorMessage) {
      return (
        <Alert color="danger" isOpen={this.state.visible} toggle={this.onDismissAlert}>
          {this.state.errorMessage}
        </Alert>
      )
    }
    if(this.props.family.apiError) {
      return (
        <Alert color="danger" isOpen={this.state.visible} toggle={this.onDismissAlert}>
          Error: Please Try again later.
      </Alert>
      )
    }
  }

  render() {
    const {handleSubmit } = this.props;
    return (
      <div data-test="family-register" className="family-register">
        <section className="form-container">
          <h2 className="form-title">Family Register</h2>
          <div className="form-wrapper register-form-wrapper">
          {this.props.family && this.renderAlert('danger')}
          <Form className="regsiter-form" onSubmit={handleSubmit(this.handleSubmit)}>
              <section className="form__form-group">
                <label className="form__form-group-label">Family Email</label>
                <div className="form__form-group-field">
                  <Field  
                    name="family_email"
                    component="input"
                    type="text"
                    placeholder="Enter Email (can be same as primary parent's email)"
                    required
                  />
                </div>
              </section>
              <section className="form__form-group">
                <label className="form__form-group-label">Family Nickname</label>
                <div className="form__form-group-field">
                  <Field  
                    name="family_nickname"
                    component="input"
                    type="text"
                    placeholder="Enter Nickname of family"
                    required
                  />
                </div>
              </section>
              <section className="form__form-group">
                <label className="form__form-group-label d-flex justify-content-between"><span>Family Password</span><span onClick={()=>this.toggleShowPass()}>{this.state.showPass?'hide':'show'}</span></label>
                <div className="form__form-group-field">
                  <Field  
                    name="family_password"
                    component="input"
                    type={this.state.showPass?"text":"password"}
                    placeholder="Enter password of family email"
                    required
                  />
                </div>
              </section>
              <section className="form__button-toolbar">
                <Link className="btn btn-secondary-left" to="/family-login">Login</Link>
                <button className="btn btn-success" type="submit">Register</button>
              </section>
            </Form>
          </div>
        </section>
      </div>
    )
  }
}


export default connect(mapStateToProps, mapDispatchToProps)(reduxForm({form: 'register'})(UnconnectedFamilyRegister));