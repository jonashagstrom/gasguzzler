import React, { Component } from 'react';
import { BrowserRouter as Router, Route, NavLink } from 'react-router-dom';
import PropTypes from 'prop-types';
import * as firebase from 'firebase';
import '@firebase/firestore';
import Stats from './Stats';
import Entry from './Entry';
import './App.css';
import './firebase_config.js';

class App extends Component {
  constructor() {
    super();

    this.state = {
      error: false,
      errorMessage: null,
      userId: null
    };
  }

  componentWillMount() {
    firebase
      .auth()
      .signInAnonymously()
      .catch(error => {
        this.setState({ error });
      });
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        this.setState({ error: false, userId: user.uid });
      } else {
        this.setState({ error: true, errorMessage: 'Logged out' });
      }
    });
  }

  getChildContext() {
    return this.state;
  }

  render() {
    const { userId } = this.state;
    return (
      userId && (
        <Router>
          <div className="container">
            <header className="App-header">
              <h1>GasGuzzler</h1>
            </header>
            <nav>
              <ul>
                <li>
                  <NavLink exact to="/">
                    Home
                  </NavLink>
                </li>
                <li>
                  <NavLink exact to="/stats">
                    Stats
                  </NavLink>
                </li>
              </ul>
            </nav>
            <Route exact path="/" component={Entry} />
            <Route exact path="/stats" component={Stats} />
          </div>
        </Router>
      )
    );
  }
}

App.childContextTypes = {
  error: PropTypes.bool,
  errorMessage: PropTypes.string,
  userId: PropTypes.string
};

export default App;
