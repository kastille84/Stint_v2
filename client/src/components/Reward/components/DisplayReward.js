import React, {Component} from 'react';
import { Field, reduxForm, Form, SubmissionError, reset } from 'redux-form';
import {Alert} from 'reactstrap';
import PropTypes from 'prop-types'

class DisplayReward extends Component {

  state = {
    reward_name: '',
    reward_goal: 10,
    showInput: false,
    visible: false,
    errorMessage: null
  }

  // static getDerivedStateFromProps(props, state) {
  //   return {
  //     reward_name: props.reward.reward_name
  //   }
  // }
  // componentDidUpdate(prevProps) {
  //   debugger;
  //   if(this.props.fetchingReward===false && prevProps.fetchingReward===true ) {
  //     this.setState({reward_name: this.props.reward.reward_name})
  //   }
  // }
  componentDidMount() {
    if((this.props.reward||{}).reward_name !=='') {
      this.setState({
        reward_name: (this.props.reward||{}).reward_name,
        reward_goal: (this.props.reward||{}).reward_goal
      })
    }
  }
  

  setShowInput = (bool) => {
    this.setState({showInput: bool})
  }

  displayRewardOrNoRewardMessage = () => {
    if ((this.props.reward||{}).reward_name !=='' && this.state.showInput===false) {
      return <p onClick={()=>this.setShowInput(true)}>{this.props.reward.reward_name}</p>
    } else {
      return (
        <div>
          <p>There is no reward for this child. </p>
            {!this.state.showInput &&
              <button onClick={()=>this.setShowInput(true)}>Add Reward</button>
            }
        </div>
      )
    }
  }

  addReward = (e) => {
    e.preventDefault();
    let passed =  true;
    let {reward_goal, reward_name} = this.state;
    console.log('reward goal', reward_goal)
    //validate
      //reward_goal
        //cannot be empty
        if(reward_name === '') {
          this.setState({
            visible: true,
            errorMessage: 'Reward cannot be empty'
          })
          passed = false;
        }
      //reward_goal
        //cannot be empty
        if(!reward_goal) {
          this.setState({
            visible: true,
            errorMessage: 'Reward Goal cannot be empty'
          })
          passed = false;
        }

    //make API call
    if (passed) {
      this.props.addReward(
        {reward_name,
          reward_goal
        },
        (visibleVal) => {
          this.setState({visible: visibleVal})
        },
      )
    }
  }

  editReward = (e) => {
    e.preventDefault();
    let passed =  true;
    let {reward_goal, reward_name} = this.state;
    console.log('reward goal', reward_goal)
    //validate
      //reward_goal
        //cannot be empty
        if(reward_name === '') {
          this.setState({
            visible: true,
            errorMessage: 'Reward cannot be empty'
          })
          passed = false;
        }
      //reward_goal
        //cannot be empty
        if(!reward_goal) {
          this.setState({
            visible: true,
            errorMessage: 'Reward Goal cannot be empty'
          })
          passed = false;
        }

    //make API call
    if (passed) {
      this.props.editReward(
        {reward_name,
          reward_goal
        },
        (visibleVal) => {
          this.setState({visible: visibleVal})
        },
      )
    }
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

  displayRewardInput = () => {
    if (this.state.showInput) {
      return (
        <form>
          <div>
            {this.renderAlert()}
            <label>Reward</label>
            <input 
              type="text"
              value={this.state.reward_name}
              onChange={(e)=>this.setState({reward_name: e.target.value})}
              required
            />          
          </div>
          <div>
            <label>Points to Reach Goal (default 10)</label>
            <input 
              type="number"
              value={this.state.reward_goal}
              onChange={(e)=>this.setState({reward_goal: e.target.value})}
              min="1"
              max="100"
              required
            />          
          </div>
          <div>
            {this.props.reward.reward_name===''? 
                <button 
                  onClick={(e)=>this.addReward(e)}
                  type="submit"
                >Add</button>
              :
                <button
                  onClick={(e)=>this.editReward(e)}
                  type="submit"
                >Edit</button>
            }
                     
          </div>
        </form>
      )
    }
  }

  render() {
    return (
      <div>
        {this.displayRewardOrNoRewardMessage()}
        {this.displayRewardInput()}
      </div>
    )
  }
}

DisplayReward.propTypes = {
  reward: PropTypes.object.isRequired,
  addReward: PropTypes.func.isRequired,
  editReward: PropTypes.func.isRequired
}

export default DisplayReward;