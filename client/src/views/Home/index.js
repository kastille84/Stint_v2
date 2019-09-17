import React, {Component} from 'react';
import Navigation from '../../components/Navigation';
import {haveJWTNotProtected} from '../../util/utils';

class Home extends Component {
  componentDidMount() {
    haveJWTNotProtected(this.props.history.push)
  }

  render() {
    return (
      <main className="home">
        <section className="jumbotron jumbotron-fluid">
          <div className="container">
            <h1 className="">Stint Chore Tracker</h1>
            <p className="">Manage Your Children's Chores & Reward Them Handsomely</p>
          </div>
        </section>
        <h1 className="page-h1">Clutter and Mess</h1>
        <section className="home__info-strip">
          <figure className="home__info-img home__info-img--clutter">
 
          </figure>
          <div className="home__info-text">
            <h2 className="page-h2">Adults and children alike, we all make messes in our home. As responsible adults we were taught or learned that we must clean up after ourselves.</h2>
            <h2 className="page-h2">Children must also learn to clean up after themselves. If they start young with minor chores then they will develop a habit of cleaning and feel more responsible.</h2>
          </div>
        </section>
        <h1 className="page-h1">Complete Chores, Get a Reward</h1>
        <section className="home__info-strip">
        <div className="home__info-text">
        <h2 className="page-h2">With Stint, you give a child a set of chores to complete for the week. Each child can login to their account to record each chore they completed.</h2>
        <h2 className="page-h2">You can set a Goal for each child to reach. If the child reaches the goal then you can give your child a Reward!</h2>
        </div>
        <figure className="home__info-img home__info-img--clean">

        </figure>
        </section>
      </main>
    )
  }
}

export default Home