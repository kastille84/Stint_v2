import React, { Component } from 'react';
import {connect} from 'react-redux';
import { Field, reduxForm, Form, SubmissionError, reset } from 'redux-form';
import {Alert} from 'reactstrap';
import {
  ADD_CHORE,
  ADD_CHORE_DONE
} from '../../../constants';
import api from '../../../api';

const mapStateToProps = (state) => ({
  addChoreForm: state.form.addChore,
  family: state.family
});
const mapDispatchToProps = (dispatch) => ({
  // registerFamily: (data, cbPush, cbVisible) => {
  //   dispatch({type: REGISTER_FAMILY});
  //   api.Family.registerFam(data)
  //     .then(payload => {
  //       dispatch({type: REGISTER_FAMILY_DONE, payload: payload});
  //       //localStorage.setItem('family_jwt', payload.token);
  //       api.agent.setSession('family_jwt',payload.token );
  //       //redirect to SelectUser page
  //       cbPush('/which-user');
  //     })
  //     .catch(err => {
  //       dispatch({type: REGISTER_FAMILY_DONE, error: err});
  //       cbVisible(true)
  //     })
  //}

  addChore: (data, cbReset, cbVisible) => {
    dispatch({type: ADD_CHORE});
    api.Family.addChore(data)
      .then(payload => {
        dispatch({type: ADD_CHORE_DONE, payload: payload});
      })
      .catch(err => {
        dispatch({type: ADD_CHORE_DONE, error: err});
        cbVisible(true)
      });
  },
  resetForm: () => {
    //clear form
    dispatch(reset('addChore'));
  }
});

class AddChore extends Component {

  state = {
    visible: false,
    errorMessage: null
  }

  onDismissAlert = () => {
    this.setState({visible: false})
  }

  handleSubmit = (values) => {
    //validate
    if(values.chore.length > 30) {
      this.setState({
        visible: true,
        errorMessage: "Cannot be more than 30 Characters"
      })
    }
    if(/[!#$%()*+,\-./:;<=>?@[\\\]^_`{|}~]/.test(values.chore)) {
      this.setState({
        visible: true,
        errorMessage: "Cannot use Special Characters"
      })
    }

    //make api call
    this.props.addChore(
      values.chore,
      ()=> {
        this.props.resetForm();
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
    // if(this.props.family.apiError) {
    //   return (
    //     <Alert color="danger" isOpen={this.state.visible} toggle={this.onDismissAlert}>
    //       Error: Please Try again later.
    //   </Alert>
    //   )
    // }
  }

  render() {
    let {handleSubmit} = this.props;
    return(
      <div>
        <Form className="regsiter-form" onSubmit={handleSubmit(this.handleSubmit)}>
          <section className="form__form-group">
            <label className="form__form-group-label">Add Chore</label>
            <div className="form__form-group-field">
              <Field  
                name="chore"
                component="input"
                type="text"
                placeholder="Dishes, Mop, Vacuum, etc.."
                required
              />
              <button className="btn btn-success" type="submit">Add</button>
            </div>
          </section>
        </Form>
      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(reduxForm({form: 'addChore'})(AddChore));