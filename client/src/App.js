import React, { Component } from "react";
import { connect } from "react-redux";
import {withRouter} from 'react-router-dom';
import Loader from "react-loader-spinner";
import Router from "./Router";
import "./scss/app.scss";
import Nav from "./components/Navigation";

import { 
  SET_IS_FAM_AUTH ,
  SET_IS_PARENT_AUTH,
  SET_IS_CHILD_AUTH
} from "./constants";

const mapStateToProps = state => ({
  user: state.user,
  family: state.family
});

const mapDispatchToProps = dispatch => ({
  setIsFamAuth: (auth) => {
    dispatch({ type: SET_IS_FAM_AUTH, auth });
  },
  setIsParentAuth: (auth) => {
    dispatch({ type: SET_IS_PARENT_AUTH, auth });
  },
  setIsChildAuth: (auth) => {
    dispatch({ type: SET_IS_CHILD_AUTH, auth });
  }
});

export class App extends Component {
  state = {
    loading: true,
    loaded: false
  };
  componentDidMount() {
    // window.addEventListener("load", () => {
    //   this.setState({ loading: false });
    //   setTimeout(() => this.setState({ loaded: true }), 500);
    // });

    this._checkJWT();
  }

  componentDidUpdate(prevProps) {
    if (this.props.family !== prevProps.family) {
      this._checkJWT();
    }
  }

  _checkJWT = () => {
    if (!this.props.family.isFamAuth) {
      //check family_jwt
      if (localStorage.getItem("family_jwt")) {
        //set isFamAuth
        this.props.setIsFamAuth(true);
        //check parent_jwt
        if (localStorage.getItem("parent_jwt")) {
          this.props.setIsParentAuth(true);
        }
        //check child_jwt
        if (localStorage.getItem("child_jwt")) {
          this.props.setIsChildAuth(true);
        }
      }
    }
  };

  render() {
    const loaded = this.state.loaded;
    return (
      <div className="App">
        <Nav />
        <div className={`${this.props.location.pathname==='/'? "container-full":"container"}`}>
          <Router family={this.props.family} />
        </div>
      </div>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(App));
