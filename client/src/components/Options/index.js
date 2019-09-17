import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Collapse, Button} from 'reactstrap';
import {
  SET_SELECTED_CHILD
} from '../../constants'

const mapStatetoProps = (state) => ({
  family: state.family,
  user: state.user
})

const mapDispatchToPros = (dispatch) => ({
  setSelectedChild: (child) => {
    dispatch({type: SET_SELECTED_CHILD, child: child});
  }
})

class Options extends Component {
  state = {
    collapse: false
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

  render() {
    let {family} = this.props;
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
          </Collapse>
        </div>
      </section>

    )
  }
}

export default connect(mapStatetoProps, mapDispatchToPros)(Options);