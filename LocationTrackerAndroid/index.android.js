/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import { AppRegistry } from 'react-native';
import styles from './modules/styles/style';
import App from './modules/components/App';

export default class LocationTrackerAndroid extends Component {
  render() {
    return (
      <App />
    );
  }
}

AppRegistry.registerComponent('LocationTrackerAndroid', () => LocationTrackerAndroid);
