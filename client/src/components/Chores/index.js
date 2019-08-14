import React, { Component } from 'react';

import AddChore from './components/AddChore';
import ChoreList from './components/ChoreList';

class Chore extends Component {

  render() {
    return(
      <section className="chores">
        {/*Form for Adding Chores */}
        <AddChore />
        {/*List of Chores */}
        <ChoreList />
      </section>
    )
  }
}

export default Chore;