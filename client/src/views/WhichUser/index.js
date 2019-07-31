import React, { Component } from 'react';
import {connect} from 'react-redux';
import AddParent from './components/AddParent';
import AddChild from './components/AddChild';
import { Field, reduxForm, Form, SubmissionError, reset } from 'redux-form';
import {Alert} from 'reactstrap';
import { 
  REGISTER_PERSON,
  REGISTER_PERSON_DONE,
  SET_FAMILY_DATA,
  SET_FAMILY_DATA_DONE
 } from "../../constants";
import api from "../../api";

const mapStateToProps = state => ({
  familyData: state.family.familyData,
  whichUserForm: state.form.which_user
})

const mapDispatchToProps = (dispatch) => ({
  registerPerson: (data, cbVisible) => {
    dispatch({type: REGISTER_PERSON})
    api.Family.registerPerson(data)
      .then(payload => {
        dispatch({type: REGISTER_PERSON_DONE, payload: payload});
        //#set person jwt CONDITIONALLY
        if(payload.parent) {
          api.agent.setSession('parent_jwt', payload.token);
        }
        if(payload.child) {
          api.agent.setSession('child_jwt', payload.token);
        }
        //clear form
        dispatch(reset('which_user'));
      })
      .catch(err => {
        dispatch({type: REGISTER_PERSON_DONE, error: err})
        cbVisible(true);
      })
  },
  getFamilyData: () => {
    dispatch({type: SET_FAMILY_DATA})
    api.Family.getFam()
      .then(payload => {
        dispatch({type: SET_FAMILY_DATA_DONE, payload: payload})
      })
      .catch(err => {
        dispatch({type: SET_FAMILY_DATA_DONE, error: err})
      })
  }
})

class WhichUser extends Component {
  state={
    errorMessage: null,
    visible: false,
    personType: null
  }

  componentDidMount() {
    if(!this.props.familyData) {
      //#TODO get family data
      this.props.getFamilyData()
    }
  }
  handleSubmit = (values) => {
    const requiredNum = /[0-9]/;
    //check maxLength
    if(values.pin > 10) {
      this.setState({
        errorMessage: 'Pin max of 10 chars',
        visible: true
      })
    }
    //remember to add the family_id to the data
    const data = {
      ...values,
      person_type: this.state.personType,
      family_id: this.props.familyData._id
    }

    this.props.registerPerson(
      data,
      (visibleVal) => {
        this.setState({visible:visibleVal})
      }
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

  _determineToDisableChild = () => {
    return ( !( (this.props.familyData||{}).parents||[]).length) ? true: false;
  }

  _setPersonType = (type) => {
    this.setState({personType: type})
  }

  render() {
    let {handleSubmit} = this.props;
    return (
      <div className="which-user">
        <h1 className="page-title mt40">Who are you?</h1>
        {this.props.family && this.renderAlert('danger')}
        <section className="which-user-container mt40">
          {/* PARENT */}
          <article className="parent-side">
            <AddParent>
              <Form className="which-user-form" onSubmit={handleSubmit(this.handleSubmit)}>
              <section className="form__form-group">
                <label className="form__form-group-label">Name</label>
                <div className="form__form-group-field">
                  <Field  
                    name="name"
                    component="input"
                    type="text"
                    placeholder="Parent Name"
                    required
                  />
                </div>
              </section>
              <section className="form__form-group">
                <label className="form__form-group-label">Pin</label>
                <div className="form__form-group-field">
                  <Field  
                    name="pin"
                    component="input"
                    type="text"
                    placeholder="Unique pin"
                    required
                  />
                </div>
              </section>
              <button 
                className="btn btn-success mt5" 
                type="submit" 
                onClick={()=>this._setPersonType('parent')}
              >Add</button>
              </Form>
            </AddParent>
          </article>
          {/* CHILDREN */}
          <article className="children-side">
            <AddChild disabled={this._determineToDisableChild()}>
              <Form className="which-user-form" onSubmit={handleSubmit(this.handleSubmit)}>
              <section className="form__form-group">
                <label className="form__form-group-label">Name</label>
                <div className="form__form-group-field">
                  <Field  
                    name="name"
                    component="input"
                    type="text"
                    placeholder="Child Name"
                    required
                  />
                </div>
              </section>
              <section className="form__form-group">
                <label className="form__form-group-label">Pin</label>
                <div className="form__form-group-field">
                  <Field  
                    name="pin"
                    component="input"
                    type="text"
                    placeholder="Unique pin"
                    required
                  />
                </div>
              </section>
              <button 
                className="btn btn-success mt5" 
                type="submit" 
                onClick={()=>this._setPersonType('child')}
                disabled={this._determineToDisableChild()}
              >Add</button>
              </Form>
            </AddChild>
          </article>
        </section>
      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(reduxForm({form: 'which_user'})(WhichUser));