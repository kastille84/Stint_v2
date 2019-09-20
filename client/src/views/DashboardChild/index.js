import React, { Component } from "react";
import { connect } from "react-redux";
import Options from "../../components/Options";
import { protectRoutes } from "../../util/utils";
import Widget from "../../components/Widget";
import api from "../../api";
import {
  SET_FAMILY_DATA,
  SET_FAMILY_DATA_DONE,
  SET_PERSON_DATA,
  SET_PERSON_DATA_DONE
} from "../../constants";

import ChoreChart from "../../components/ChoreChart";
import Reward from "../../components/Reward";

const mapStateToProps = state => ({
  family: state.family,
  user: state.user
});
const mapDispatchToProps = dispatch => ({
  getFamilyData: () => {
    dispatch({ type: SET_FAMILY_DATA });
    api.Family.getFam()
      .then(payload => {
        dispatch({ type: SET_FAMILY_DATA_DONE, payload: payload });
      })
      .catch(err => {
        dispatch({ type: SET_FAMILY_DATA_DONE, error: err });
      });
  },
  getPersonData: (type, id) => {
    dispatch({ type: SET_PERSON_DATA });
    api.User.getPersonData(type, id)
      .then(payload => {
        dispatch({ type: SET_PERSON_DATA_DONE, payload: payload });
      })
      .catch(err => {
        dispatch({ type: SET_PERSON_DATA_DONE, error: err });
      });
  }
});

class DashboardChild extends Component {
  componentWillMount() {
    //protect route
    protectRoutes("child", this.props.history.goBack);
  }
  componentDidMount() {
    //on refresh of page, get family and parent info
    if (!(this.props.family || {}).familyData) {
      this.props.getFamilyData();
      this.props.getPersonData("child", this.props.match.params.id);
    }
  }

  render() {
    return (
      <section className="dashboard-parent">
        <Options child_id={this.props.match.params.id} />
        <div>
          {((this.props.user || {}).userData || {}).name
            ? `${this.props.user.userData.name}'s Dashboard`
            : null}
        </div>
        <div className="row mb40">
          <Widget customClasses="col-md-5">
            <Reward />
          </Widget>
        </div>
        <div className="row mb40">
          <Widget customClasses="col-md-12 ">
            <ChoreChart />
          </Widget>
        </div>
      </section>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DashboardChild);
