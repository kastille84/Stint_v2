import React, { Component } from 'react';
import {connect} from 'react-redux';
import Loader from "react-loader-spinner";
import ChoreListItem from "./ChoreListItem";

const mapStateToProps = (state) => ({
  addChoreForm: state.form.addChore,
  familyData: state.family.familyData,
  fetching: state.family.fetching
});

class ChoreList extends Component {

  state = {
    selected: null
  }
  _setSelected = (chore) => {
    this.setState({selected: chore})
  }
  _determineSelected = (chore) => {
    if(chore === this.state.selected) {
      return true;
    }
    return false;
  }
  handleSubmit = (values) => {

  }


  renderChoresList = () => {
    if(((this.props.familyData||{}).chorelist||[]).length>0) {
      return this.props.familyData.chorelist.map((c,idx)=> {
        return (
          <ChoreListItem 
            chore={c} 
            selected={this._determineSelected(c)}
            setSelected={this._setSelected}
          />
          );
      }).reverse();
    }
    else if (((this.props.familyData||{}).chorelist||[]).length ===0) {
      return <p>No chores. Please add a chore above.</p>
    }
  }

  render() {
    return(
      <div className="chore-list" onMouseLeave={()=>this._setSelected({selected:null})}>
        <p className="page-widget-title">List of Chores</p>
        {this.props.fetching===true? 
          <Loader
            type="Grid"
            color="#2e40dc"
            height={20}
            width={20}
          />
          :
          this.renderChoresList()
        }
      </div>
    )
  }
}

export default connect(mapStateToProps)(ChoreList);