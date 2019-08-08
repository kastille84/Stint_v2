import React, {Component} from 'react';
import {protectRoutes} from '../../util/utils';

class DashboardChild extends Component {
  componentDidMount() {
    //redirect if not loggedin
    protectRoutes('child', (route)=> {
      this.props.history.push(route);
    })
  }
  render(){
    return (
      <div>Child Dashboard</div>
    )
  }
}

export default DashboardChild;