import React, { Component } from 'react';
import {connect} from 'react-redux';
import AddParent from './components/AddParent';
import AddChild from './components/AddChild';
import { Field, reduxForm, Form, SubmissionError, reset } from 'redux-form';

const mapStateToProps = state => ({
  familyData: state.family.familyData,
  whichUserForm: state.form.which_user
})

class WhichUser extends Component {
  state={
    errorMessage: null
  }

  handleSubmit = (values) => {

    //remember to add the family_id to the data
  }

  _determineToDisableChild = () => {
    return ( !( (this.props.familyData||{}).parents||[]).length) ? true: false;
  }

  render() {
    let {handleSubmit} = this.props;
    return (
      <div className="which-user">
        <h1 className="page-title mt40">Who are you?</h1>
        <section className="which-user-container mt40">
          {/* PARENT */}
          <article className="parent-side">
            <AddParent>
              <Form className="which-user-form" onSubmit={handleSubmit(this.handleSubmit)}>
              <section className="form__form-group">
                <label className="form__form-group-label">Name</label>
                <div className="form__form-group-field">
                  <Field  
                    name="parent_name"
                    component="input"
                    type="text"
                    placeholder="Parent Name"
                    required
                  />
                </div>
              </section>
              <section className="form__form-group">
                <label className="form__form-group-label">Unique Pin</label>
                <div className="form__form-group-field">
                  <Field  
                    name="parent_pin"
                    component="input"
                    type="text"
                    placeholder="Unique pin"
                    required
                  />
                </div>
              </section>
              <button className="btn btn-success mt5" type="submit" >Add</button>
              </Form>
            </AddParent>
          </article>
          {/* CHILDREN */}
          <article className="children-side">
            <AddChild disabled={this._determineToDisableChild()} />
          </article>
        </section>
      </div>
    )
  }
}

export default connect(mapStateToProps)(reduxForm({form: 'which_user'})(WhichUser));