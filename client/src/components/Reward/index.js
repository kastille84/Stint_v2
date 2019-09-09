import React, {Component} from 'react';
import {connect} from 'react-redux';
import Loader from "react-loader-spinner";

import DisplayReward from './components/DisplayReward';
import RewardGoal from './components/RewardGoal';

import {
ADD_REWARD,
ADD_REWARD_DONE
} from '../../constants';
import api from '../../api';

const mapStateToProps = (state) => ({
  family: state.family,
  fetching: state.family.fetching,
  fetchingReward: state.family.fetchingReward
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
            (
            <div>
              <DisplayReward 
                reward={reward||{}}
                addReward={this.addReward}
                //fetchingReward={this.props.fetchingReward}
              />
              {/*this.getRewardForSelectedChild() &&
                <RewardGoal

                />
              */}
            </div> 
            )
          }
      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Reward);