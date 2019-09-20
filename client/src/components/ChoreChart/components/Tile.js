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
    completed: null,
    rColor: null,
    rCompleted: null
  };

  componentDidMount() {
    if (this.props.currentSchedule) {
      let completed = findCompletedStatus(
        this.props.day,
        this.props.chore,
        this.props.currentSchedule
      );
      if (completed === true) {
        this.setState({
          color: "green",
          completed: true
        });
      } else if (completed === false) {
        this.setState({
          color: "red",
          completed: false
        });
      } else if (completed === null) {
        this.setState({
          color: "white",
          completed: null
        });
      } else {
        this.setState({
          color: "white",
          completed: null
        });
      }
    } else {
      this.setState({
        color: "white",
        completed: null
      });
    }
  }

  componentDidUpdate(prevProps) {
    let prevCompleted = findCompletedStatus(
      prevProps.day,
      prevProps.chore,
      prevProps.currentSchedule
    );
    let completed = findCompletedStatus(
      this.props.day,
      this.props.chore,
      this.props.currentSchedule
    );
    if (prevCompleted !== completed) {
      if (completed === true) {
        this.setState({
          color: "green",
          completed: true
        });
      } else if (completed === false) {
        this.setState({
          color: "red",
          completed: false
        });
      } else if (completed === null) {
        this.setState({
          color: "white",
          completed: null
        });
      } else {
        this.setState({
          color: "white",
          completed: null
        });
      }
    }
  }

  handleClick = () => {
    if (this.props.editable && this.props.editMode) {
      if (this.props.personType === "parent") {
        if (this.state.color === "red") {
          //call parent function to edit child's chore
          this.props.editChoreInSchedule({
            day: this.props.day,
            chore: this.props.chore,
            nextCompletedStatus: true
          });
          this.setState({
            color: "green",
            completed: true
          });
        } else if (this.state.color === "green") {
          //call parent function to edit child's chore
          this.props.editChoreInSchedule({
            day: this.props.day,
            chore: this.props.chore,
            nextCompletedStatus: null
          });
          this.setState({
            color: "white",
            completed: null
          });
        } else if (this.state.color === "white") {
          //call parent function to edit child's chore
          this.props.editChoreInSchedule({
            day: this.props.day,
            chore: this.props.chore,
            nextCompletedStatus: false
          });
          this.setState({
            color: "red",
            completed: false
          });
        }
      } else if (this.props.personType === "child") {
        if (this.state.color === "red") {
          this.props.editChoreInSchedule({
            day: this.props.day,
            chore: this.props.chore,
            nextCompletedStatus: true
          });
          this.setState({
            color: "green",
            completed: true
          });
        } else if (this.state.color === "green") {
          this.props.editChoreInSchedule({
            day: this.props.day,
            chore: this.props.chore,
            nextCompletedStatus: false
          });
          this.setState({
            color: "red",
            completed: false
          });
        }
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
