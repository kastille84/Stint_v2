import React, { Component } from 'react';

class AddChild extends Component {

  render() {
    return  (
      <div className={`add-person ${this.props.disabled? 'add-person--disabled':''}`}>
        <section></section>
        <section className="add-person__plus">+</section>
        <section>Child</section>
      </div>
    )
  }
}

export default AddChild;