import React, {Component} from 'react';
import {connect} from 'react-redux';
import Loader from "react-loader-spinner";

import DisplayReward from './components/DisplayReward';
import RewardGoal from './components/RewardGoal';

import {
ADD_REWARD,
ADD_REWARD_DONE,
EDIT_REWARD,
EDIT_REWARD_DONE,
ADD_SUBTRACT_TO_REWARD_GOAL,
ADD_SUBTRACT_TO_REWARD_GOAL_DONE
} from '../../constants';
import api from '../../api';

const mapStateToProps = (state) => ({
  family: state.family,
  fetching: state.family.fetching,
  fetchingReward: state.family.fetchingReward,
  personType: state.user.personType
})
const mapDispatchToProps = (dispatch) => ({
  addReward: (child_id,reward, cbVisible) => {
    dispatch({type: ADD_REWARD})
    api.Reward.addReward(child_id,reward)
      .then(payload => {
        dispatch({type: ADD_REWARD_DONE, payload})
      })
      .catch(err => {
        dispatch({type: ADD_REWARD_DONE, error:err});
        cbVisible(true);
      })
  },
  editReward: (child_id, reward, cbVisible) => {
    dispatch({type: EDIT_REWARD});
    api.Reward.editReward(child_id, reward)
      .then(payload => {
        dispatch({type: EDIT_REWARD_DONE, payload})
      })
      .catch(err => {
        dispatch({type: EDIT_REWARD_DONE, error:err});
        cbVisible(true);
      })
  },
  addSubtract:(child_id, type, val, cbVisible) => {
    dispatch({type: ADD_SUBTRACT_TO_REWARD_GOAL})
    api.Reward.addSubtractToGoal(child_id, type, val)
      .then(payload => {
        dispatch({type: ADD_SUBTRACT_TO_REWARD_GOAL_DONE, payload})
      })
      .catch(err => {
        dispatch({type: ADD_SUBTRACT_TO_REWARD_GOAL_DONE, error: err});
        cbVisible(true)
      })
  }
})

class Reward extends Component {

  getRewardForSelectedChild = () => {
    let {family} = this.props;
    if(family.familyData && family.selectedChild) {
      let reward = family.familyData.rewards.filter(r=> r.child_id===family.selectedChild._id)[0]
      console.log('reward', reward);
      return reward;
    }
    return;
  }

  addReward = (reward, cbVisible) => {
    this.props.addReward(
      this.props.family.selectedChild._id,
      reward,
      cbVisible
    )
  }
  editReward = (reward, cbVisible) => {
    this.props.editReward(
      this.props.family.selectedChild._id,
      reward,
      cbVisible
    )
  }
  addSubtractGoal = (type, val, cbVisible) => {

    this.props.addSubtract(
      this.props.family.selectedChild._id,
      type,
      Number(val),
      cbVisible
    )
  }

  render() {
    let reward = this.getRewardForSelectedChild();
    return (
      <div className="reward">
        <p className="page-widget-title">Reward</p>
          { (this.props.fetchingReward || this.props.fetching ) ?
            <Loader 
              type="Grid"
              color="#2e40dc"
              height={20}
              width={20}
            />
            :
            reward?
            (
            <div>
              <DisplayReward 
                reward={reward||{}}
                addReward={this.addReward}
                editReward={this.editReward}
                personType={this.props.personType}
                apiError={this.props.family.apiError}
                //fetchingReward={this.props.fetchingReward}
              />
              <hr />
              {reward.reward_name?
                <RewardGoal
                  reward={reward||{}}
                  addSubtractGoal={this.addSubtractGoal}
                  personType={this.props.personType}
                  apiError={this.props.family.apiError}
                />
                :null
              }
            </div> 
            ):
            (
              <div> 
                <DisplayReward 
                  reward={reward||{}}
                  addReward={this.addReward}
                  editReward={this.editReward}
                  personType={this.props.personType}
                  apiError={this.props.family.apiError}
                  //fetchingReward={this.props.fetchingReward}
                />
              </div>
            )
          }
      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Reward);