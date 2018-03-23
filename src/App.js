import React, { Component } from 'react';
import * as firebase from 'firebase';
import '@firebase/firestore';
import logo from './logo.svg';
import './App.css';
import './firebase_config.js';

const db = firebase.firestore();
const FILLUPS_COLLECTION = 'fillups';

class App extends Component {
  constructor() {
    super();

    this.state = {
      render: false,
      error: null,
      form: {
        litres: 0,
        kilometers: 0,
        totalMileage: 0,
        userId: null
      },
      fillups: []
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
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
        const userId = Object.assign(this.state.form, {
          userId: user.uid
        });
        this.setState({ render: true, form: userId });
        this.fetchData(user.uid);
      } else {
        this.setState({ render: false, error: 'Logged out' });
      }
    });
  }

  handleChange = e => {
    const update = Object.assign(this.state.form, {
      [e.target.name]: parseInt(e.target.value, 10)
    });
    this.setState({ form: update });
  };

  handleSubmit = e => {
    e.preventDefault();
    db
      .collection(FILLUPS_COLLECTION)
      .add(this.state.form)
      .then(docRef => {
        console.log('Document written with ID: ', docRef.id);
        const resetForm = Object.assign(this.state.form, {
          litres: 0,
          kilometers: 0,
          totalMileage: 0
        });
        this.setState({
          form: resetForm
        });
      })
      .catch(error => {
        console.error('Error adding document: ', error);
      });
  };

  fetchData = userId => {
    db
      .collection(FILLUPS_COLLECTION)
      .where('userId', '==', userId)
      .get()
      .then(querySnapshot => {
        const fillups = [];
        querySnapshot.forEach(doc => {
          // doc.data() is never undefined for query doc snapshots
          console.log(doc.id, ' => ', doc.data());
          fillups.push(doc.data());
        });
        this.setState({ fillups });
      })
      .catch(error => {
        console.log('Error getting documents: ', error);
      });
  };

  render() {
    const { fillups } = this.state;

    return (
      this.state.render && (
        <div className="App">
          <header className="App-header">
            <img src={logo} className="App-logo" alt="logo" />
            <h1 className="App-title">Welcome to GasGuzzler</h1>
          </header>
          <div className="App-intro">
            <form>
              <p>
                <label htmlFor="litres">Litres</label>
                <input
                  id="litres"
                  name="litres"
                  type="number"
                  value={this.state.form.litres}
                  onChange={this.handleChange}
                />
              </p>
              <p>
                <label htmlFor="kilometers">Kilometers</label>
                <input
                  id="kilometers"
                  name="kilometers"
                  type="number"
                  value={this.state.form.kilometers}
                  onChange={this.handleChange}
                />
              </p>
              <p>
                <label htmlFor="totalMileage">Total mileage</label>
                <input
                  id="totalMileage"
                  name="totalMileage"
                  type="number"
                  value={this.state.form.totalMileage}
                  onChange={this.handleChange}
                />
              </p>
              <p>
                <button type="submit" onClick={this.handleSubmit}>
                  Save
                </button>
              </p>
            </form>
            <hr />
            {fillups.length > 0 && (
              <ol>
                {fillups.map((fillup, idx) => (
                  <li key={idx}>
                    <p>Litres: {fillup.litres}</p>
                    <p>Kilometers: {fillup.kilometers}</p>
                    <p>Total mileage: {fillup.totalMileage}</p>
                  </li>
                ))}
              </ol>
            )}
          </div>
        </div>
      )
    );
  }
}

export default App;
