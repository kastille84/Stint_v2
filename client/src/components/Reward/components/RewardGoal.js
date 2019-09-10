import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Progress, Alert} from 'reactstrap';

class RewardGoal extends Component {
  state = {
    val:0,
    visible: false,
    errorMessage: null
  }

  setVal = (num) => {
    this.setState({val: num})
  }

  onDismissAlert = () => {
    this.setState({visible: false})
  }

  renderAlert = (type) => {
    if (this.state.errorMessage) {
      return (
        <Alert color="danger" isOpen={this.state.visible} toggle={this.onDismissAlert}>
          {this.state.errorMessage}
        </Alert>
      )
    }
    // if(this.props.family.apiError) {
    //   return (
    //     <Alert color="danger" isOpen={this.state.visible} toggle={this.onDismissAlert}>
    //       {this.props.family.apiError.response.data.message}
    //   </Alert>
    //   )
    // }
  }

  setGoal = (type) => {
    let passed = true;
    //validate
    if (this.state.val >100) {
      this.setState({
        visible: true,
        errorMessage: "Value cannot be more than 100"
      });
      passed = false;
    }
    if (this.state.val <0) {
      this.setState({
        visible: true,
        errorMessage: "Value cannot be negative"
      });
      passed = false;
    }
    if (passed) {
      this.props.addSubtractGoal(
        type,
        this.state.val,
        (bool) => {
          this.setState({visible: true})
        }
      )
    }
  }

  render() {
    return (
      <section className="reward-goal">
        <div className="reward-goal__progress-wrapper">
          <div>{this.props.reward.reward_currently} of {this.props.reward.reward_goal}</div>
          <Progress value={this.props.reward.reward_status.toFixed(2)} />
        </div>
        <div className="reward-goal__controls">
          {this.renderAlert()}
          <div onClick={()=>this.setGoal('subtract')}>- Subtract</div>
          <div>
            <input 
              type="number"
              value={this.state.val}
              onChange={(e)=>this.setState({val:e.target.value})}
            />
          </div>
          <div onClick={()=>this.setGoal('add')}>+ Add</div>
        </div>
      </section>
    )
  }
}

RewardGoal.propTypes = {
  reward: PropTypes.object.isRequired,
  addSubtractGoal: PropTypes.func.isRequired
}

export default RewardGoal;