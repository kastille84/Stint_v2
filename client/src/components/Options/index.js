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
    if( (this.props.family||{}).familyData ){
      this.props.setSelectedChild(this.props.family.familyData.children[0])
    }
  }

  toggle() {
    this.setState({ collapse: !this.state.collapse });
  }

  _handleChildSelect = (e) => {
    //find child in family based off id
    let filteredChildren=this.props.family.familyData.children.filter(c=> {
      if(c._id===e.target.value) return true;
    })
    //dispatch call
    this.props.setSelectedChild(filteredChildren[0])
  }

  render() {
    let {family} = this.props;
    return (
      <section className="option-control mt40 mb40">
        <div >
          {/* Form Select goes here for switching between children */}
          <span>Child:</span>
          <select
            onChange={(e)=>this._handleChildSelect(e)}
          >
            {(((family||{}).familyData||{}).children||[]).map(c=> {
              return (
                <option value={c._id} selected={(family.selectedChild||{})._id===c._id && 'true'}>
                  {c.name}
                </option>
              )
            })}
          </select>
          <Button color="primary" onClick={()=>this.toggle()}>Options</Button>
        </div>

        <div>
          <Collapse
            isOpen={this.state.collapse}
          >
          <p>set rewards</p>
          <p>edit rewards</p>
          <p>view chore chart</p>
          <p>edit chore chart</p>
          <p>set chores</p>
          <p>edit chores</p>
          </Collapse>
        </div>
      </section>

    )
  }
}

export default connect(mapStatetoProps, mapDispatchToPros)(Options);