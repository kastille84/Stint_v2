import React, { Component } from 'react';

class AddChild extends Component {
  state = {
    display: null
  };


  render() {
    let display = this.state.display;
    return  (
      <div className={`add-person ${this.props.disabled? 'add-person--disabled':''}`}>
        <div
        onClick={()=>this.props.setSelectedBox('addChild')}
        className={`front ${(this.props.selectedBox!=="addChild"||this.props.selectedBox===null) && " show "} ${this.props.selectedBox==="addChild" && " hide "}`}
        >
          <section />
          <section className="add-person__plus">+</section>
          <section>Child</section>
        </div>
        <div
          className={`back ${(this.props.selectedBox==="addChild") && " show "} ${this.props.selectedBox!=="addChild" && " hide "}`}
        >          
          <div>
            <span className="add-person__close" onClick={()=>this.props.setSelectedBox(null)}>x</span>
          </div>
          {this.props.children}
        </div>
      </div>
    )
  }
}

export default AddChild;