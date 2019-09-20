import React, { Component } from "react";

class AddParent extends Component {
  state = {
    display: null
  };

  render() {
    return (
      <div className={`add-person`}>
        <div
          onClick={() => this.props.setSelectedBox("addParent")}
          className={`front ${(this.props.selectedBox !== "addParent" ||
            this.props.selectedBox === null) &&
            " show "} ${this.props.selectedBox === "addParent" && " hide "}`}
        >
          <section />
          <section className="add-person__plus">+</section>
          <section>Parent</section>
        </div>
        <div
          className={`back ${this.props.selectedBox === "addParent" &&
            " show "} ${this.props.selectedBox !== "addParent" && " hide "}`}
        >
          <div>
            <span
              className="add-person__close"
              onClick={() => this.props.setSelectedBox(null)}
            >
              x
            </span>
          </div>
          {this.props.children}
        </div>
      </div>
    );
  }
}

export default AddParent;
