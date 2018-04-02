import React, { Component } from 'react';
import PropTypes from 'prop-types';
import * as firebase from 'firebase';
import { FILLUPS_COLLECTION } from './utils/constants';
import { totalMileage } from './utils/totalMileage';
import '@firebase/firestore';
import './App.css';
import './firebase_config.js';

const db = firebase.firestore();

class Entry extends Component {
  constructor(props, context) {
    super();
    this.totalMileage = this.totalMileage.bind(this);
    this.state = {
      error: null,
      form: {
        litres: '',
        kilometers: '',
        totalMileage: '',
        userId: context.userId,
        timestamp: firebase.firestore.FieldValue.serverTimestamp()
      }
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  totalMileage = () => totalMileage(db, this.context.userId);

  handleChange = e => {
    const update = Object.assign(this.state.form, {
      [e.target.name]: e.target.value
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
          litres: '',
          kilometers: '',
          totalMileage: ''
        });
        this.setState({
          form: resetForm
        });
      })
      .catch(error => {
        console.error('Error adding document: ', error);
      });
  };

  render() {
    this.totalMileage();
    return (
      <div>
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
      </div>
    );
  }
}

Entry.contextTypes = {
  error: PropTypes.bool,
  errorMessage: PropTypes.string,
  userId: PropTypes.string
};

export default Entry;
