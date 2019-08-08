import React, {Component} from "react";
import { Switch, Route, Redirect } from "react-router-dom";

//components import
import FamilyRegister from "./views/FamilyRegister";
import FamilyLogin from "./views/FamilyLogin";
import WhichUser from "./views/WhichUser";
import DashboardParent from './views/DashboardParent';
import DashboardChild from './views/DashboardChild';


class Router extends Component {
  state = {
    famAuth: false,
    personAuth: false
  }

  componentDidMount() {
    if (this._isFamJWTset) {
      this.setState({famAuth: true})
    }
    if (this._isParentChildJWTset()) {
      this.setState({personAuth: true})
    }

  }


  _isFamJWTset = () => {
    if (localStorage.getItem('family_jwt')) return true;
  }
  _isParentChildJWTset = () => {
    if (localStorage.getItem('parent_jwt') || localStorage.getItem('child_jwt')) return true;
  }

  _determineRedirectRoute = () => {
    if (localStorage.getItem('family_jwt')) {
      return '/which-user';
    } else {return '/family-login'}
  }


  render() {
    return (
      <Switch>
        <Route exact path="/" component={FamilyRegister} />
        <Route exact path="/family-register" component={FamilyRegister} />
        <Route exact path="/family-login" component={FamilyLogin} />
        { this.state.famAuth && (
          <Route exact path="/which-user" component={WhichUser} />
        )}
        
        <Route exact path="/dashboard-parent/:id" component={DashboardParent} />
        <Route exact path="/dashboard-child/:id" component={DashboardChild} />

        <Route render={() =>{
          return <Redirect to={this._determineRedirectRoute()} />
        } } />
      </Switch>
    );
  }
}

export default Router;
