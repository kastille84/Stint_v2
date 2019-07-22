import React from 'react';
import {Switch, Route} from 'react-router-dom';

//components import
import FamilyRegister from './views/FamilyRegister';
import FamilyLogin from './views/FamilyLogin';
import WhichUser from './views/WhichUser';

const Router = () => (
  <Switch>
    <Route exact path="/" component={FamilyRegister} />
    <Route exact path="/family-register" component={FamilyRegister} />
    <Route exact path="/family-login" component={FamilyLogin} />
    <Route exact path="/which-user" component={WhichUser} />
  </Switch>
)

export default Router;