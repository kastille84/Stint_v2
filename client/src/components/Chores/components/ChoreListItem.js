import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import {Alert} from 'reactstrap';
import { 
  EDIT_CHORE, 
  EDIT_CHORE_DONE, 
  DELETE_CHORE, 
  DELETE_CHORE_DONE 
} from '../../../constants';
import api from '../../../api';

const mapStateToProps = state => ({
  family: state.family
})
const mapDispatchToProps = (dispatch) => ({
  editChore: (data, cbVisible) => {
    dispatch({type: EDIT_CHORE})
    api.Chore.editChore(data)
      .then(payload => {
        dispatch({type:EDIT_CHORE_DONE, payload: payload})
      })
      .catch(err=> {
        dispatch({type:EDIT_CHORE_DONE, error: err})
        cbVisible(true)
      })
  },
  deleteChore: (data, cbVisible) => {
    dispatch({type: DELETE_CHORE});
    api.Chore.deleteChore(data)
      .then(payload => {
        dispatch({type:DELETE_CHORE_DONE, payload: payload})
      })
      .catch(err => {
        dispatch({type:DELETE_CHORE_DONE, error: err})
        cbVisible(true);
      })
  }
})

class ChoreListItem extends Component {
  static propTypes = {
    selected: PropTypes.bool,
    chore: PropTypes.string
  };

  state={
    chore:'',
    visible:false,
    errorMessage:null
  }

  componentDidMount() {
    this.setState({chore: this.props.chore})
  }

  componentDidUpdate(prevProps ) {
    if(prevProps.selected === true && this.props.selected === false) {
      this.setState({chore: this.props.chore})
    }
  }

  onDismissAlert = () => {
    this.setState({visible: false})
  }

  handleEditSubmit = () => {
    //validate
    let valPass=true;
    //validate
    if(this.state.chore.length > 30) {
      this.setState({
        visible: true,
        errorMessage: "Cannot be more than 30 Characters"
      })
      valPass= false;
      this.setState({chore: this.props.chore})
    }
    if(/[!#$%()*+,\-./:;<=>?@[\\\]^_`{|}~]/.test(this.state.chore)) {
      this.setState({
        visible: true,
        errorMessage: "Cannot use Special Characters"
      })
      valPass=false;
      this.setState({chore: this.props.chore})
    }
    
    //make api call, if validation passed
    if(valPass) {
      this.props.editChore(
        {
          oldChore: this.props.chore,
          newChore:this.state.chore
        }
        ,
        (visibleVal) => {
          this.setState({visible: visibleVal})
        },
      )
    }

  }

  handleDeleteSubmit = () => {
    this.props.deleteChore(
      this.props.chore,
      (visibleVal) => {
        this.setState({visible: visibleVal})
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
          {this.props.family.apiError.response.data.message}
      </Alert>
      )
    }
  }

  changeInput = (e) => {
    this.setState({chore: e.target.value})
  }

  renderEditForm = () => {
    return (
      <form className="chore-list-item__form" >
        <section className="form__form-group">
          {this.renderAlert()}
          <div className="form__form-group-field">
            <input 
              type="text" 
              name="chore" 
              value={this.state.chore} 
              onChange={(e)=>this.changeInput(e)} 
              required
              maxLength="30"
              autoFocus
            />
            <button className="btn btn-sm btn-success" type="button" onClick={this.handleEditSubmit}>Edit</button>
            <button className="btn btn-sm btn-danger" type="button" onClick={this.handleDeleteSubmit} >X</button>
          </div>
        </section>
      </form>
    )
  }

  render() {
    return (
      <div className="chore-list-item" onClick={()=>this.props.setSelected(this.props.chore)} >
        {this.props.selected?
          this.renderEditForm()
          :
          <p className="chore-list-item--not-selected">{this.props.chore}</p>
        }
      </div>
    )
  }
}

export  default connect(mapStateToProps, mapDispatchToProps)(ChoreListItem);