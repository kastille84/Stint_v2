import React, {Component} from "react";
import { Switch, Route, Redirect } from "react-router-dom";

//components import
import Home from './views/Home';
import FamilyRegister from "./views/FamilyRegister";
import FamilyLogin from "./views/FamilyLogin";
import WhichUser from "./views/WhichUser";
import DashboardParent from './views/DashboardParent';
import DashboardChild from './views/DashboardChild';


class Router extends Component {
  state = {

  }




  render() {
    return (
      <Switch>
        <Route exact path="/" component={Home} />
        <Route exact path="/family-register" component={FamilyRegister} />
        <Route exact path="/family-login" component={FamilyLogin} />

        <Route exact path="/which-user" component={WhichUser} />

        
        <Route exact path="/dashboard-parent/:id" component={DashboardParent} />
        <Route exact path="/dashboard-child/:id" component={DashboardChild} />


      </Switch>
    );
  }
}

// <Route render={() =>{
//   return <Redirect to={this._determineRedirectRoute()} />
// } } />
export default Router;
