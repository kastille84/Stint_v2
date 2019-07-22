import React, { Component } from 'react';
import {connect} from 'react-redux';

const mapStateToProps = state => ({
  family: state.family
})

class WhichUser extends Component {
  render() {
    return (
      <div data-test="which-user" className="which-user">
        <h1 className="page-title">Who are you?</h1>
        <section>
          {/* PARENT */}
          <article className="parent-side">
            
          </article>
          {/* CHILDREN */}
          <article className="children-side">
          </article>
        </section>
      </div>
    )
  }
}

export default connect(mapStateToProps)(WhichUser);