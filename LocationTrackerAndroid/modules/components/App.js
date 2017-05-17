import React, { Component } from 'react';
import {Text, View} from 'react-native';
import { connect } from 'react-redux';

import styles from '../styles/style';
import ViewStateManager from './view-state-manager';
import Header from './header';
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
				<Header/>
				<View style={styles.content}>
					<ViewStateManager />
				</View>
			</View>
		);
	}
}
export default connect(null, {getAllContacts})(App);