import React, { Component } from 'react';
import PropTypes from 'prop-types';
import * as firebase from 'firebase';
import '@firebase/firestore';
import './App.css';
import './firebase_config.js';

const db = firebase.firestore();
const FILLUPS_COLLECTION = 'fillups';

class Stats extends Component {
  constructor() {
    super();

    this.state = {
      fillups: []
    };
  }

  componentDidMount() {
    const { userId } = this.context;
    this.fetchData(userId);
  }

  fetchData = userId => {
    db
      .collection(FILLUPS_COLLECTION)
      .where('userId', '==', userId)
      .orderBy('timestamp', 'desc')
      .onSnapshot(querySnapshot => {
        const fillups = [];
        querySnapshot.forEach(doc => {
          fillups.push(doc.data());
        });
        this.setState({ fillups });
      });
  };

  consumption = (litres, kilometers) => {
    return Math.round(litres / (kilometers / 10) * 100) / 100;
  };

  render() {
    const { fillups } = this.state;

    return (
      <div>
        {fillups.length > 0 && (
          <ol>
            {fillups.map((fillup, idx) => (
              <li key={idx}>
                <p>Litres: {fillup.litres}</p>
                <p>Kilometers: {fillup.kilometers}</p>
                <p>Total mileage: {fillup.totalMileage}</p>
                <p>
                  L/10km: {this.consumption(fillup.litres, fillup.kilometers)}
                </p>
              </li>
            ))}
          </ol>
        )}
      </div>
    );
  }
}

Stats.contextTypes = {
  error: PropTypes.bool,
  errorMessage: PropTypes.string,
  userId: PropTypes.string
};

export default Stats;
