import React, { Component } from 'react';
import {connect} from 'react-redux';
import { Field, reduxForm, Form, SubmissionError, reset } from 'redux-form';
import {Alert} from 'reactstrap';
import { 
  REGISTER_PERSON,
  REGISTER_PERSON_DONE,
  SET_FAMILY_DATA,
  SET_FAMILY_DATA_DONE,
  LOGIN_PERSON,
  LOGIN_PERSON_DONE
} from "../../constants";
import api from "../../api";
import AddParent from './components/AddParent';
import AddChild from './components/AddChild';
import PersonBox from './components/PersonBox';

const mapStateToProps = state => ({
  familyData: state.family.familyData,
  whichUserForm: state.form.which_user,
  user: state.user
})

const mapDispatchToProps = (dispatch) => ({
  registerPerson: (data, cbVisible) => {
    dispatch({type: REGISTER_PERSON})
    api.Family.registerPerson(data)
      .then(payload => {
        dispatch({type: REGISTER_PERSON_DONE, payload: payload});
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
  },
  loginPerson: (data, cbVisible, cbPush) => {
    dispatch({type: LOGIN_PERSON})
    api.Family.loginPerson(data)
      .then(payload => {
        //#set person jwt CONDITIONALLY
        if(payload.parent) {
          api.agent.setSession('parent_jwt', payload.token);
        }
        if(payload.child) {
          api.agent.setSession('child_jwt', payload.token);
        }

        dispatch({type: LOGIN_PERSON_DONE, payload: payload});
        cbPush();
      })
      .catch(err => {
        dispatch({type: LOGIN_PERSON_DONE, error: err})
        cbVisible(true)
      })
  },
  resetForm: () => {
    //clear form
    dispatch(reset('which_user'));
  }
})

class WhichUser extends Component {
  state={
    errorMessage: null,
    visible: false,
    personType: null,
    person_id: null,
    selectedBox: null
  }

  componentDidMount() {
    if(!this.props.familyData || !this.props.user.userData) {
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

  handlePersonLogin = (values)=> {
    const data = {
      ...values,
      person_type: this.state.personType,
      person_id: this.state.person_id
    }

    this.props.loginPerson(
      data,
      (visibleVal)=> {
        this.setState({visible:visibleVal})
      },
      ()=> {
        
        this.props.history.push(`/dashboard-${this.state.personType==='parent'?`parent/${this.state.person_id}`:`child/${this.state.person_id}`}`)
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
    if((this.props.family||{}).apiError || (this.props.user||{}).apiError) {
      return (
        <Alert color="danger" isOpen={this.state.visible} toggle={this.onDismissAlert}>
          Wrong Pin. Try again later.
      </Alert>
      )
    }
  }
  onDismissAlert = () => {
    this.setState({visible: false})
  }

  _determineToDisableChild = () => {
    return ( !( (this.props.familyData||{}).parents||[]).length) ? true: false;
  }

  _setPersonType = (type) => {
    this.setState({personType: type})
  }
  _setPersonId = (id) => {
    this.setState({person_id: id})
  }
  _setSelectedBox = (box) => {
    this.props.resetForm();
    this.setState({selectedBox: box, errorMessage:null})
  }

  _renderPersonBox = (type) => {
    return this.props.familyData[type].map(p => {
      return (
        <PersonBox person={p} key={p._id} selectedBox={this.state.selectedBox} setSelectedBox={this._setSelectedBox}>
        {this.props.user && this.renderAlert('danger')}
          <Form className="which-user-form" onSubmit={this.props.handleSubmit(this.handlePersonLogin)}>
            <section className="form__form-group">
              <label className="form__form-group-label">Pin</label>
              <div className="form__form-group-field">
                <Field  
                  name="pin"
                  component="input"
                  type="text"
                  placeholder="Unique pin"
                  required
                  autoFocus
                  maxLen={10}
                />
              </div>
            </section>
            <button 
              className="btn btn-success mt5" 
              type="submit" 
              onClick={()=>{
                this._setPersonType(type==='parents'?'parent':'child')
                this._setPersonId(p._id)
              }}
            >Login</button>
          </Form>          
        </PersonBox>
      )
    })
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
            <AddParent selectedBox={this.state.selectedBox} setSelectedBox={this._setSelectedBox}>
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
            {/* List of Parents*/}
            <div className="parent-list mt20">
              {((this.props.familyData||{}).parents||[]).length >0 &&
                this._renderPersonBox('parents')
              }            
            </div>
          </article>
          {/* CHILDREN */}
          <article className="children-side">
            <AddChild disabled={this._determineToDisableChild()}  selectedBox={this.state.selectedBox} setSelectedBox={this._setSelectedBox}>
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
            {/* List of Children*/}
            <div className="parent-list mt20">
            {((this.props.familyData||{}).parents||[]).length >0 &&
              this._renderPersonBox('children')
            }            
          </div>
          </article>
        </section>
      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(reduxForm({form: 'which_user'})(WhichUser));