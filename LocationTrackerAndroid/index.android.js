/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import { AppRegistry } from 'react-native';
import { Provider } from 'react-redux';

import styles from './modules/styles/style';
import store from './modules/store';
import App from './modules/components/App';
import {startWebSocketReceiving} from './modules/websocket-receiver';

export default class LocationTrackerAndroid extends Component {
  render() {
    return (
      <Provider store={ store }>
        <App />
      </Provider>
    );
  }
}


startWebSocketReceiving(store);
AppRegistry.registerComponent('LocationTrackerAndroid', () => LocationTrackerAndroid);
