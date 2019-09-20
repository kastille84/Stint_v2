import React, { Component } from "react";

class PersonBox extends Component {
  state = {
    display: null
  };

  render() {
    return (
      <div className={`person-box`}>
        <div
          onClick={() =>
            this.props.setSelectedBox((this.props.person || {})._id)
          }
          className={`front ${(this.props.selectedBox !==
            (this.props.person || {})._id ||
            this.props.selectedBox === null) &&
            " show "} ${this.props.selectedBox ===
            (this.props.person || {})._id && " hide "}`}
        >
          <section />
          <section className="person-box__plus">
            {((this.props.person || {}).name || "").substring(0, 1)}
          </section>
          <section>{(this.props.person || {}).name || ""}</section>
        </div>
        <div
          className={`back ${this.props.selectedBox ===
            (this.props.person || {})._id && " show "} ${this.props
            .selectedBox !== (this.props.person || {})._id && " hide "}`}
        >
          <div>
            <span
              className="person-box__close"
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

export default PersonBox;
