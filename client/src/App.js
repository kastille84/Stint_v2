import React, { Component } from "react";
import { connect } from "react-redux";
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
  setIsFamAuth: () => {
    dispatch({ type: SET_IS_FAM_AUTH });
  },
  setIsParentAuth: () => {
    dispatch({ type: SET_IS_PARENT_AUTH });
  },
  setIsChildAuth: () => {
    dispatch({ type: SET_IS_CHILD_AUTH });
  }
});

export class UnconnectedApp extends Component {
  state = {
    loading: true,
    loaded: false
  };
  componentDidMount() {
    window.addEventListener("load", () => {
      this.setState({ loading: false });
      setTimeout(() => this.setState({ loaded: true }), 500);
    });

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
        this.props.setIsFamAuth();
        //check parent_jwt
        if (localStorage.getItem("parent_jwt")) {
          this.props.setIsParentAuth();
        }
        //check child_jwt
        if (localStorage.getItem("child_jwt")) {
          this.props.setIsChildAuth();
        }
      }
    }
  };

  render() {
    const loaded = this.state.loaded;
    return (
      <div className="App">
        <Nav />
        <div className="container">
          {!loaded ? (
            <Loader
              type="Grid"
              color="#2e40dc"
              height={80}
              width={80}
            />
          ) : null}
          <Router />
        </div>
      </div>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(UnconnectedApp);
