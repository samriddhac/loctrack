import React, { Component } from 'react';
import {Text, View} from 'react-native';
import styles from '../styles/style';

export default class App extends Component {
	render() {
		return (
		<View style={styles.container}>
	        <Text style={styles.welcome}>
	          Welcome to React Native!
	        </Text>
	        <Text style={styles.instructions}>
	          You are ON
	        </Text>
	        <Text style={styles.instructions}>
	          Double tap R on your keyboard to reload,{'\n'}
	          Shake or press menu button for dev menu
	        </Text>
      	</View>
		);
	}
}