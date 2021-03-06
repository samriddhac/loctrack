import React, { Component } from 'react';
import {Text, View, StatusBar, AsyncStorage, AppState} from 'react-native';
import { connect } from 'react-redux';

import styles from '../styles/style';
import ViewStateManager from './view-state-manager';
import {getAllContacts, loadPersistedState, changeView} from '../actions/index';
import {VIEW_REGISTER, VIEW_HOME, STATE} from '../common/constants';
import {initConnection, setFcmToken} from '../websocket-receiver';
import SplashScreen from 'react-native-splash-screen';
import { MenuContext } from 'react-native-popup-menu';
import {sendAppCloseNotification, sendGeoTrackingNotification, 
	stopGeoTrackingNotification} from '../pushnotification';
import {configureGeolocation, start, stop, 
	isServiceRunning, setServiceRunning} from '../geolocation-receiver';

class App extends Component {

	constructor(props) {
		super(props);

		this.state = {
			persistedLoaded: false,
			appState: ''
		}
		this.myContact = '';
		this._handleAppStateChange = this._handleAppStateChange.bind(this);
	}

	componentWillMount() {
		let _parent = this;
		try{
			AsyncStorage.getItem(STATE).then((result)=>{
				 let data = JSON.parse(result);
				 if(data!==undefined && data!==null) {
				 	_parent.props.loadPersistedState(data.contactState);
					 if(data.contactState!==undefined && 
					 	data.contactState!==null && 
					 	data.contactState.myContact!==undefined && 
					 	data.contactState.myContact!==null && 
					 	data.contactState.myContact!=='') {
					 	_parent.props.changeView({id:VIEW_HOME, options:{}});
					 	let from = data.contactState.myContact;
					 	_parent.myContact = from;
						initConnection(from);
					}
					else {
						_parent.props.changeView({id:VIEW_REGISTER, options:{}});
					}
				 }
				 else {
				 	_parent.props.changeView({id:VIEW_REGISTER, options:{}});
				 }
			});
		}
		catch(err){
			console.log(err);
			_parent.props.changeView({id:VIEW_REGISTER, options:{}});
		}
	}

	componentDidMount() {
		this.props.getAllContacts();
		SplashScreen.hide();
		AppState.addEventListener('change', this._handleAppStateChange);
		if(isServiceRunning()===true) {
			start();
			sendGeoTrackingNotification();
		}
	}

	componentWillReceiveProps(newProps) {
		if(newProps.selectedReceiver===undefined
			|| newProps.selectedReceiver===null
			|| newProps.selectedReceiver.length===0) {
			let isGeolocationOn = isServiceRunning();
			if(isGeolocationOn === true) {
				stop();
				stopGeoTrackingNotification();
			}
		}
	}

	componentWillUnmount() {
		if(isServiceRunning()===true) {
			sendAppCloseNotification();
		}
		AppState.removeEventListener('change', this._handleAppStateChange);
	}

	_handleAppStateChange(nextAppState) {
		if (this.state.appState.match(/inactive|background/) && nextAppState === 'active') {
			console.log('App has come to the foreground!');
			initConnection(this.props.myContact);
		}
		this.setState({...this.state, appState: nextAppState});
	}

	render() {
		return (
			<MenuContext>
				<View style={styles.container}>
					<StatusBar
				     backgroundColor="#10003F"
				     barStyle="light-content"
				   />
					<ViewStateManager />
				</View>
			</MenuContext>
		);
	}
}

function mapStateToProps(state) {
	return { 
		myContact: state.contactState.myContact,
		fcmToken: state.deviceState.fcmToken,
		selectedReceiver: state.contactState.selectedReceiver
	}
}
export default connect(mapStateToProps, {getAllContacts, loadPersistedState, changeView})(App);