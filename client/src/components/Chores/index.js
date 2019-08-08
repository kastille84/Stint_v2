import React, { Component } from 'react';
import {connect} from 'react-redux';

import AddChore from './components/AddChore';
import ChoreList from './components/ChoreList';

class Chore extends Component {

  render() {
    return(
      <section className="chore-list">
        {/*Form for Adding Chores */}
        <AddChore />
        {/*List of Chores */}
        <ChoreList />

      </section>
    )
  }
}

export default Chore;