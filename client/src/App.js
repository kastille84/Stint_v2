import React, {Component} from 'react';
import {connect} from 'react-redux';
import './scss/app.scss';
import api from './api';
import {
  REGISTER_FAMILY,
  REGISTER_FAMILY_DONE
} from './constants';

const mapStateToProps = (state) => ({
  user: state.user
});

const mapDispatchToProps = (dispatch) => ({
  // registerFam: (data) => {
  //   api.Family.registerFam(data)
  //   .then(res => {
  //     console.log('res', res);
  //   })
  //   dispatch({type: REGISTER_FAMILY})
  // }
})

export class App extends Component {
  componentDidMount() {
  //   console.log("testing redux",this.props);
  //   this.props.registerFam({
  //     name: 'martini claz',
  //     email: 'kastille84@gmail.com',
  //     password: '123tetstst'
  //   });
  // }

  render() {
    return (
      <div className="App">
  
      </div>
    );

  }
}



export default connect(mapStateToProps, mapDispatchToProps)(App);
