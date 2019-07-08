import React, { Component } from 'react';
import {connect} from 'react-redux';
import { Field, reduxForm, Form, SubmissionError, reset } from 'redux-form';
import {Alert} from 'reactstrap';

export class UnconnectedRegister extends Component {
  state = {
    showPass: false,
    visible: false,
    errorMessage: null
  }

  onDismissAlert = () => {
    this.setState({visible: false})
  }
  onShowAlert = () => {
    this.setState({visible: true})
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

  }

  render() {
    const {handleSubmit } = this.props;
    return (
      <div data-test="register" className="register">
        <h1 className="page-title">Family</h1>
        <section className="form-container">
          <h2 className="form-title">Register</h2>
          <div className="form-wrapper">
            <Alert color="danger" isOpen={this.state.visible} toggle={this.onDismissAlert}>
              {this.state.errorMessage}
            </Alert>
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
                <label className="form__form-group-label">Family Password</label>
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
                <button className="btn btn-secondary-left">Login</button>
                <button className="btn btn-success">Register</button>
              </section>
            </Form>
          </div>
        </section>
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
  registerForm: state.form.register
});

export default connect(mapStateToProps)(reduxForm({form: 'register'})(UnconnectedRegister));