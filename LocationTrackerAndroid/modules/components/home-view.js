import React, { Component } from 'react';
import {TouchableNativeFeedback, DrawerLayoutAndroid} from 'react-native';
import {connect} from 'react-redux';
import { createAnimatableComponent, View, Text } from 'react-native-animatable';
import styles from '../styles/style';
import HeaderView from './header-view';
import GoogleMapView from './google-map-view';
import NavDrawerView from './nav-drawer-view';

export default class HomeView extends Component {

	constructor(props) {
		super(props);
		this.openNavDrawer = this.openNavDrawer.bind(this);
		this.closeNavDrawer = this.closeNavDrawer.bind(this);
	}

	openNavDrawer() {
		this.refs.navDrawer.openDrawer();
	}

	closeNavDrawer() {
		this.refs.navDrawer.closeDrawer();
	}

	render() {
		return (
		<DrawerLayoutAndroid
		drawerWidth={270}
		ref='navDrawer'
		drawerPosition={DrawerLayoutAndroid.positions.Left}
		renderNavigationView={() => <NavDrawerView closeNav={this.closeNavDrawer} />}>
			<View animation="fadeInRight" delay={100} style={styles.homeContainer}>
				<View style={styles.header}>
					<HeaderView openNav={this.openNavDrawer} />
				</View>
				<GoogleMapView />
			</View>
		</DrawerLayoutAndroid>
		);
	}
}