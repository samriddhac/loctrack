import React, { Component } from 'react';
import {Text, View, StatusBar} from 'react-native';
import { connect } from 'react-redux';

import styles from '../styles/style';
import ViewStateManager from './view-state-manager';
import {getAllContacts} from '../actions/index';

class App extends Component {

	constructor(props) {
		super(props);
	}

	componentDidMount() {
		this.props.getAllContacts();
	}

	render() {
		return (
			<View style={styles.container}>
				<StatusBar
			     backgroundColor="#10003F"
			     barStyle="light-content"
			   />
				<ViewStateManager />
			</View>
		);
	}
}
export default connect(null, {getAllContacts})(App);