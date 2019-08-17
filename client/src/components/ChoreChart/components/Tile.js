import React, { Component } from "react";

const findCompletedStatus = (day, chore, currentSchedule) => {
  let filteredDayArr = (currentSchedule[day] || []).filter(choreObj => {
    if (choreObj.chore === chore) {
      return true;
    }
    return false;
  });
  return (filteredDayArr[0] || {}).completed;
};

class Tile extends Component {
  state = {
    color: null,
    completed: null
  };

  static getDerivedStateFromProps(props) {
    let completed = findCompletedStatus(
      props.day,
      props.chore,
      props.currentSchedule
    );
    if (completed === true) {
      return {
        color: "green",
        completed: true
      };
    } else if (completed === false) {
      return {
        color: "red",
        completed: false
      };
    } else if (completed === null) {
      return {
        color: "white",
        completed: null
      };
    } else {
      return {
        color: "white",
        completed: null
      };
    }
  }

  handleClick = () => {
    if (this.props.editable && this.props.editMode) {
      if (this.state.color === "red") {
        //call parent function to edit child's chore
        this.props.editChoreInSchedule({
          day: this.props.day,
          chore: this.props.chore,
          nextCompletedStatus: true
        });
      } else if (this.state.color === "green") {
        //call parent function to edit child's chore
        this.props.editChoreInSchedule({
          day: this.props.day,
          chore: this.props.chore,
          nextCompletedStatus: null
        });
      } else if (this.state.color === "white") {
        //call parent function to edit child's chore
        this.props.editChoreInSchedule({
          day: this.props.day,
          chore: this.props.chore,
          nextCompletedStatus: false
        });
      }
    }
  };

  render() {
    return (
      <div
        className={`tile tile--${this.state.color} ${
          this.props.editMode ? "tile--edit" : "tile--no-edit"
        }`}
        onClick={() => {
          this.handleClick();
        }}
      />
    );
  }
}

export default Tile;
