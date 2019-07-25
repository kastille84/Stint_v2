import React, {Component} from "react";
import { Switch, Route, Redirect } from "react-router-dom";

//components import
import FamilyRegister from "./views/FamilyRegister";
import FamilyLogin from "./views/FamilyLogin";
import WhichUser from "./views/WhichUser";


class Router extends Component {
  protectedRoutes = () => {
    return (
      <Switch>
        <Route exact path="/back-routes" component={WhichUser} />
      </Switch>
    )
  }

  _isFamJWTset = () => {
    if (localStorage.getItem('family_jwt')) return true;
  }
  _isParentChildJWTset = () => {
    if (localStorage.getItem('parent_jwt') || localStorage.getItem('child_jwt')) return true;
  }

  _determineRedirectRoute = () => {
    console.log('props', this.props)
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
        { this._isFamJWTset() && (
          <Route exact path="/which-user" component={WhichUser} />
        )}
        {this._isParentChildJWTset() ? this.protectedRoutes() : null}
    
        <Route render={() =>{
          return <Redirect to={this._determineRedirectRoute()} />
        } } />
      </Switch>
    );
  }
}

export default Router;
