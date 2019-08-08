import React, { Component } from 'react';
import {connect} from 'react-redux';

const mapStateToProps = (state) => ({
  addChoreForm: state.form.addChore,
  family: state.family
});

class ChoreList extends Component {

  handleSubmit = (values) => {

  }

  render() {
    return(
      <div>
        {((this.props.family||{}).familyData||{}).chorelist &&
        this.props.family.familyData.chorelist.map(c=> {
          return <p>{c}</p>;
        })
      }
      </div>
    )
  }
}

export default connect(mapStateToProps)(ChoreList);