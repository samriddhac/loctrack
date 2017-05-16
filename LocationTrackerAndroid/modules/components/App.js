import React, { Component } from 'react';
import {Text, View} from 'react-native';
import styles from '../styles/style';
import ViewStateManager from './view-state-manager';
import Search from './search';
import Header from './header';

export default class App extends Component {
	render() {
		return (
			<View style={styles.container}>
				<Header/>
				<ViewStateManager />
			</View>
		);
	}
}