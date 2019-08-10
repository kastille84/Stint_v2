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
  family: state.family,
  
});
const mapDispatchToProps = (dispatch) => ({

  addChore: (data, cbReset, cbVisible) => {
    dispatch({type: ADD_CHORE});
    api.Chore.addChore(data)
      .then(payload => {
        dispatch({type: ADD_CHORE_DONE, payload: payload});
        cbReset();
      })
      .catch(err => {
        dispatch({type: ADD_CHORE_DONE, error: err});
        cbVisible(true)
        cbReset()
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
    let valPass=true;
    //validate
    if(values.chore.length > 30) {
      this.setState({
        visible: true,
        errorMessage: "Cannot be more than 30 Characters"
      })
      valPass= false;
      this.props.resetForm()
    }
    if(/[!#$%()*+,\-./:;<=>?@[\\\]^_`{|}~]/.test(values.chore)) {
      this.setState({
        visible: true,
        errorMessage: "Cannot use Special Characters"
      })
      valPass=false;
      this.props.resetForm()
    }

    //make api call, if validation passed
    if(valPass) {
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
          {this.props.family.apiError.response.data.message}
      </Alert>
      )
    }
  }

  render() {
    let {handleSubmit} = this.props;
    return(
      <div className="mb20">
        <Form className="add-chore-form" onSubmit={handleSubmit(this.handleSubmit)}>
          <section className="form__form-group">
            <label className="form__form-group-label page-widget-title">Add Chore</label>
            {this.renderAlert()}
            <div className="form__form-group-field">
              <Field  
                name="chore"
                component="input"
                type="text"
                placeholder="Dishes, Mop, Vacuum, etc.."
                required
              />
              <button className="btn btn-sm btn-success" type="submit">Add</button>
            </div>
          </section>
        </Form>
      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(reduxForm({form: 'addChore'})(AddChore));