import React, { Component } from 'react';
import * as firebase from 'firebase';
import '@firebase/firestore';
import logo from './logo.svg';
import './App.css';
import firebasConfig from '../firebase_config.js';

const db = firebase.firestore();

class App extends Component {
  componentWillMount() {
    firebase.auth().signInAnonymously().then(() => {
      this.setState({ render: true })
    }).catch((error) => {
      this.setState({ render: false, error})
    });
  }

  state = {
    render: false,
    error: null,
    form: {
      litres: 0,
      kilometers: 0,
      totalMileage: 0
    }
  }

  handleChange = (e) => {
    const update = Object.assign(this.state.form, {
      [e.target.name]: parseInt(e.target.value)
    });
    this.setState({ form: update });
  }

  handleSubmit = (e) => {
    e.preventDefault();
    db.collection("fillups").add(this.state.form)
      .then((docRef) => {
          console.log("Document written with ID: ", docRef.id);
          this.setState({
            form: {
              litres: 0,
              kilometers: 0,
              totalMileage: 0
            }
          })
      })
      .catch((error) => {
          console.error("Error adding document: ", error);
      });

  }

  render() {
    return this.state.render && (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to GasGuzzler</h1>
        </header>
        <div className="App-intro">
          <form>
            <p>
              <label htmlFor="litres">Litres</label>
              <input id="litres" name="litres" type="number" value={this.state.form.litres} onChange={this.handleChange} />
            </p>
            <p>
              <label htmlFor="kilometers">Kilometers</label>
              <input id="kilometers" name="kilometers" type="number" value={this.state.form.kilometers} onChange={this.handleChange} />
            </p>
            <p>
              <label htmlFor="totalMileage">Total mileage</label>
              <input id="totalMileage" name="totalMileage" type="number" value={this.state.form.totalMileage} onChange={this.handleChange} />
            </p>
            <p><button type="submit" onClick={this.handleSubmit}>Save</button></p>
          </form>
        </div>
      </div>
    );
  }
}

export default App;
