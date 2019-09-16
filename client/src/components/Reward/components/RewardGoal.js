import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Progress, Alert} from 'reactstrap';

class RewardGoal extends Component {
  state = {
    val:null,
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
    if (this.state.val <1) {
      this.setState({
        visible: true,
        errorMessage: "Value cannot be less than 1"
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
        <p className="page-widget-title">Progress of Reward</p>
        <div className="reward-goal__progress-wrapper">
          <div>{this.props.reward.reward_currently} of {this.props.reward.reward_goal}</div>
          <Progress 
            className={`${this.props.reward.reward_status===100? 'progress-complete': ''}`}
            value={this.props.reward.reward_status.toFixed(2)} 
          />
        </div>
        {this.props.personType !=='child' &&
        (
          <div className="reward-goal__controls">
            {this.renderAlert()}
            <div 
              onClick={()=>this.setGoal('subtract')}
              className="reward-goal__controls-sub btn btn-sm btn-danger"
              >Sub</div>
            <div
            className="reward-goal__controls-input"
            >
              <input 
                type="number"
                value={this.state.val}
                onChange={(e)=>this.setState({val:e.target.value})}
                placeholder="Number to Add/Subtract"
              />
            </div>
            <div 
              onClick={()=>this.setGoal('add')}
              className="reward-goal__controls-add btn btn-sm btn-success"
            >Add</div>
          </div>
        )
        }
      </section>
    )
  }
}

RewardGoal.propTypes = {
  reward: PropTypes.object.isRequired,
  addSubtractGoal: PropTypes.func.isRequired,
  personType: PropTypes.string,
  apiError: PropTypes.object
}

export default RewardGoal;