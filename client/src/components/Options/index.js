import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Collapse, Button} from 'reactstrap';
import Loader from "react-loader-spinner";
import {Alert} from 'reactstrap';
import {withRouter} from 'react-router-dom';
import {
  SET_SELECTED_CHILD,
  DELETE_CHORE_DONE,
  DELETE_CHILD,
  DELETE_CHILD_DONE,
  RESET_USER
} from '../../constants'
import api from '../../api';

const mapStatetoProps = (state) => ({
  family: state.family,
  user: state.user
})

const mapDispatchToPros = (dispatch) => ({
  setSelectedChild: (child) => {
    dispatch({type: SET_SELECTED_CHILD, child: child});
  },
  deleteChild: (child_id, cbPush, cbVisible) => {
    dispatch({type: DELETE_CHILD})
    api.Family.deleteChild(child_id)
      .then(payload => {
        dispatch({type: DELETE_CHILD_DONE, payload})
        dispatch({type: RESET_USER});
        //if successfule deletion, then redirect to whichUser
        cbPush()
      })
      .catch(err=> {
        dispatch({type: DELETE_CHILD_DONE, error: err})
        cbVisible()
      })
  }
})

class Options extends Component {
  state = {
    collapse: false,
    visible: false,
    errorMessage: null
  }
  componentDidMount() {
    //set first child as default selected if none selected
    //dispatch call
    if( (this.props.family||{}).familyData && !this.props.child_id ){
      this.props.setSelectedChild(this.props.family.familyData.children[0])
    } 
    else if( (this.props.family||{}).familyData && this.props.child_id ){
      let foundChild = this.findChild(this.props.child_id);
      this.props.setSelectedChild(foundChild);
    } 

  }
  componentDidUpdate(prevProps) {
    //set first child as default selected if none selected
    //dispatch call
    if (this.props.child_id && prevProps.family.familyData===null && this.props.family.familyData !==null) {
      let foundChild = this.findChild(this.props.child_id);
      this.props.setSelectedChild(foundChild);
    } else  if( prevProps.family.familyData===null && this.props.family.familyData !==null ){
      this.props.setSelectedChild(this.props.family.familyData.children[0])
    }
  }

  onDismissAlert = () => {
    this.setState({visible: false, errorMessage:null})
  }

  toggle() {
    this.setState({ collapse: !this.state.collapse });
  }

  _handleChildSelect = (e) => {
    //find child in family based off id
    let child = this.findChild(e.target.value)
    //dispatch call
    this.props.setSelectedChild(child)
  }

  findChild = (id) => {
    let filteredChildren=this.props.family.familyData.children.filter(c=> {
      if(c._id===id) return true;
    })
    return filteredChildren[0];
  }

  renderAlert = (type) => {
    if (this.state.errorMessage) {
      return (
        <Alert color="danger" isOpen={this.state.visible} toggle={this.onDismissAlert}>
          {this.state.errorMessage}
        </Alert>
      )
    }
  }

  render() {
    let {family, user} = this.props;
    return (
      <section className="option-control mt40 mb20">
        <div className="option-control__top">
          {/* Form Select goes here for switching between children */}
          <div className="option-control__top-child">          
            <span>Child:</span>
            {!this.props.child_id?
              <select
                onChange={(e)=>this._handleChildSelect(e)}
              >
                {(((family||{}).familyData||{}).children||[]).map(c=> {
                  return (
                    <option 
                      value={c._id} 
                      selected={(family.selectedChild||{})._id===c._id && true}
                      key={c._id}
                    >
                      {c.name}
                    </option>
                  )
                })}
              </select>          
              :
              <select
                onChange={(e)=>this._handleChildSelect(e)}
              >
                {(((family||{}).familyData||{}).children||[]).filter(c=>c._id===this.props.child_id).map(c=> {
                  return (
                    <option 
                      value={c._id} 
                      selected={(family.selectedChild||{})._id===c._id && true}
                      key={c._id}
                    >
                      {c.name}
                    </option>
                  )
                })}
              </select>
            }
          </div>

          <Button color="primary" onClick={()=>this.toggle()}>Options</Button>
        </div>

        <div className="option-control__dropdown">
          <Collapse
            isOpen={this.state.collapse}
          >
          <p>Parent/Child Messaging coming soon...</p>
          <p>
            {(user.personType==='parent') && (family||{}).fetchingDeleteChild===true &&
              <Loader
                type="Grid"
                color="#2e40dc"
                height={20}
                width={20}
              />
            }
            {(user.personType==='parent') && (family||{}).fetchingDeleteChild===false &&           
              <button 
                className="btn btn-danger"
                onClick={()=>{
                  this.props.deleteChild((
                    family.selectedChild||{})._id,
                    ()=> {
                      localStorage.removeItem('parent_jwt');
                      this.props.history.push('/which-user')
                    },
                    (visibleVal) => {
                      this.setState({
                        visible: visibleVal,
                        message: "Could not delete child. Try again later."
                      })
                    },
                  )
                }}
                >Delete {(family.selectedChild||{}).name} 
            </button>
            }
          </p>
          </Collapse>
        </div>
      </section>

    )
  }
}

export default connect(mapStatetoProps, mapDispatchToPros)(withRouter(Options));