import React, { Component } from 'react';
import PropTypes from 'prop-types';
import * as firebase from 'firebase';
import { FILLUPS_COLLECTION } from './utils/constants';
import '@firebase/firestore';
import './App.css';
import './firebase_config.js';

const db = firebase.firestore();

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

  totalConsumption = fillups => {
    let totalKilometers = 0;
    let totalLitres = 0;
    fillups.map(fillup => {
      const litres = Math.round(fillup.litres * 100) / 100;
      const kilometers = Math.round(fillup.kilometers * 100) / 100;
      totalKilometers += kilometers;
      totalLitres += litres;
    });

    return this.consumption(totalLitres, totalKilometers);
  };

  render() {
    const { fillups } = this.state;

    return (
      <div>
        {fillups.length > 0 && (
          <div>
            <p>
              <b>Total average consumption:</b> {this.totalConsumption(fillups)}
            </p>
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
          </div>
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
