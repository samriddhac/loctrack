import React, { Component } from 'react';
import {Text, View, Image} from 'react-native';
import styles from '../styles/style';
import ToolbarAndroid from 'ToolbarAndroid';

export default class Header extends Component  {
	render() {
		return (
			<View style={styles.header}>
				<View style={styles.headerContent}>
					<Image source={require('../styles/icons/icon3.png')} style={styles.headerIcon}/>
					<Text style={styles.headerText}>Map my friends</Text>
				</View>
				<View
				  style={{
				    borderBottomColor: 'blue',
				    borderBottomWidth: 1,
				  }}
				/>
			</View>
		);
	}
}