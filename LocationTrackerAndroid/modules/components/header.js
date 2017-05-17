import React, { Component } from 'react';
import {Text, View, Image} from 'react-native';
import styles from '../styles/style';
import ToolbarAndroid from 'ToolbarAndroid';

export default class Header extends Component  {
	render() {
		return (
			<View style={styles.header}>
				<View style={styles.headerContent}>
					<Image source={require('../images/icons/maps-icon.png')} style={styles.headerIcon}/>
					<Text style={styles.headerText}>Find my Friends</Text>
				</View>
				<View style={styles.settings}>
					<Image source={require('../images/icons/settings-icon.png')} style={styles.headerIcon}/>
				</View>
			</View>
		);
	}
}