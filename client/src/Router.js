import React from 'react';
import {Switch, Route} from 'react-router-dom';

//components import
import Register from './views/Register';

const Router = () => (
  <Switch>
    <Route exact path="/" component={Register} />
    <Route exact path="/register" component={Register} />
  </Switch>
)

export default Router;