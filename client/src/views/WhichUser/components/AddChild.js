import React, { Component } from 'react';

class AddChild extends Component {
  state = {
    display: null
  };

  _changeSideToDisplay = side => {
    this.setState({ display: side });
  };
  _toggleSide = () => {
    switch (this.state.display) {
      case null:
      case "front":
        this.setState({ display: "back" });
        return;
      case "back":
        this.setState({ display: "front" });
        return;
      default:
        return;
    }
  };



  render() {
    let display = this.state.display;
    return  (
      <div className={`add-person ${this.props.disabled? 'add-person--disabled':''}`}>
        <div
          className={`front ${display === "front" && "show"} ${display ===
            "back" && "hide"}`}            
            onClick={()=>this._toggleSide()}
        >
          <section />
          <section className="add-person__plus">+</section>
          <section>Child</section>
        </div>
        <div
          className={`back  ${(display === "front" || display === null) &&
            "hide"} ${display === "back" && "show"}`}
        >          
          <div>
            <span className="add-person__close" onClick={()=>this._toggleSide()}>x</span>
          </div>
          {this.props.children}
        </div>
      </div>
    )
  }
}

export default AddChild;