import React, {Component} from 'react';
import {connect} from 'react-redux';
import Options from '../../components/Options';
import {protectRoutes} from '../../util/utils';
import Widget from '../../components/Widget';
import api from '../../api';
import {
  SET_FAMILY_DATA,
  SET_FAMILY_DATA_DONE,
  SET_PERSON_DATA,
  SET_PERSON_DATA_DONE
} from '../../constants';

import Chores from '../../components/Chores';


const mapStateToProps = (state) => ({
  family: state.family,
  user: state.user
})
const mapDispatchToProps = (dispatch) => ({
  getFamilyData: () => {
    dispatch({type: SET_FAMILY_DATA})
    api.Family.getFam()
      .then(payload => {
        dispatch({type: SET_FAMILY_DATA_DONE, payload: payload})
      })
      .catch(err => {
        dispatch({type: SET_FAMILY_DATA_DONE, error: err})
      })
  },
  getPersonData: (type, id) => {
    dispatch({type: SET_PERSON_DATA})
    api.User.getPersonData(type, id)
      .then(payload => {
        dispatch({type: SET_PERSON_DATA_DONE, payload: payload})
      })
      .catch(err=> {
        dispatch({type: SET_PERSON_DATA_DONE, error: err})
      })
  }
})

class DashboardParent extends Component {
  componentDidMount() {
    //redirect if not loggedin
    protectRoutes('parent', (route)=> {
      this.props.history.push(route);
    })
    //on refresh of page, get family and parent info
    if (!(this.props.family||{}).familyData) {
      this.props.getFamilyData();
      this.props.getPersonData('parent', this.props.match.params.id)
    }
  }

  render(){
    return (
      <section className="dashboard-parent">
        <Options />
        <div>Parent Dashboard</div>
        <div className="row mb40">
          {/*CHOREs */}
          <Widget customClasses="col-md-6 ">
            <Chores />
          </Widget>
          <Widget customClasses="col-md-4 offset-md-2">
            <p>Rewards</p>
          </Widget>
        </div>
        <div className="row mb40">
          <Widget customClasses="col-md-12 ">
            <p>Chore Chart</p>
          </Widget>
        </div>
      </section>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(DashboardParent);