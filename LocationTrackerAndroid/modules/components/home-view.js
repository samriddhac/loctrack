import React, { Component } from 'react';
import {TouchableNativeFeedback, DrawerLayoutAndroid} from 'react-native';
import {connect} from 'react-redux';
import { createAnimatableComponent, View, Text } from 'react-native-animatable';
import styles from '../styles/style';
import HeaderView from './header-view';
import GoogleMapView from './google-map-view';
import NavDrawerView from './nav-drawer-view';
import ShareView from './share-view';

export default class HomeView extends Component {

	constructor(props) {
		super(props);
		this.state = {
			showshare: false
		};
		this.openNavDrawer = this.openNavDrawer.bind(this);
		this.closeNavDrawer = this.closeNavDrawer.bind(this);
		this.openShare = this.openShare.bind(this);
		this.closeShare = this.closeShare.bind(this);
	}

	openNavDrawer() {
		this.refs.navDrawer.openDrawer();
	}

	closeNavDrawer() {
		this.refs.navDrawer.closeDrawer();
	}

	openShare() {
		this.setState({showshare:true});
	}

	closeShare() {
		this.setState({showshare:false});
	}

	render() {
		return (
		<DrawerLayoutAndroid
		drawerWidth={270}
		ref='navDrawer'
		drawerPosition={DrawerLayoutAndroid.positions.Left}
		renderNavigationView={() => <NavDrawerView closeNav={this.closeNavDrawer} 
		openShare={this.openShare}
		/>}>
			<View animation="fadeInRight" delay={100} style={styles.homeContainer}>
				<View style={styles.header}>
					<HeaderView openNav={this.openNavDrawer} />
				</View>
				<GoogleMapView />
				<ShareView closeShare={this.closeShare} showshare={this.state.showshare}/>
			</View>
		</DrawerLayoutAndroid>
		);
	}
}