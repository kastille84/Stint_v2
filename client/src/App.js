import React, {Component} from 'react';
import {connect} from 'react-redux';
import Loader from 'react-loader-spinner';
import Router from './Router';
import './scss/app.scss';
import Nav from './components/Navigation';

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

export class UnconnectedApp extends Component {
  state = {
    loading: true,
    loaded: false
  }
  componentDidMount() {
    window.addEventListener("load", () => {
      this.setState({loading: false});
      setTimeout(()=>this.setState({loaded: true}), 500);
    })
  //   console.log("testing redux",this.props);
  //   this.props.registerFam({
  //     name: 'martini claz',
  //     email: 'kastille84@gmail.com',
  //     password: '123tetstst'
  //   });

  //#TODO - if jwt's are set, decide on redirect
  // if(localStorage.getItem('family_jwt'))
  }

  render() {
    const loaded = this.state.loaded;
    return (
      <div className="App">
        <Nav/>
        <div className="container">
          {!loaded ? (
            <Loader data-test="loader" type="Grid" color="#2e40dc" height={80} width={80} />
          ): null}
          <Router />        
        </div>
      </div>
    );

  }
}



export default connect(mapStateToProps, mapDispatchToProps)(UnconnectedApp);
