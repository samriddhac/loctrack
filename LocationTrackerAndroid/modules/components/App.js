import React, { Component } from 'react';
import {Text, View, StatusBar, AsyncStorage, AppState} from 'react-native';
import { connect } from 'react-redux';

import styles from '../styles/style';
import ViewStateManager from './view-state-manager';
import {getAllContacts, loadPersistedState, changeView} from '../actions/index';
import {VIEW_REGISTER, VIEW_HOME, STATE} from '../common/constants';
import {initConnection} from '../websocket-receiver';
import SplashScreen from 'react-native-splash-screen';
import {sendAppCloseNotification, sendGeoTrackingNotification} from '../pushnotification';
import {configureGeolocation, start, 
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
					 	_parent.props.changeView(VIEW_HOME);
					 	let from = data.contactState.myContact;
					 	_parent.myContact = from;
						initConnection(from);
					}
					else {
						_parent.props.changeView(VIEW_REGISTER);
					}
				 }
				 else {
				 	_parent.props.changeView(VIEW_REGISTER);
				 }
			});
		}
		catch(err){
			console.log(err);
			_parent.props.changeView(VIEW_REGISTER);
		}
	}

	componentDidMount() {
		this.props.getAllContacts();
		SplashScreen.hide();
		AppState.addEventListener('change', this._handleAppStateChange);
	}

	componentWillUnmount() {
		if(isServiceRunning()===true) {
			sendAppCloseNotification();
			setServiceRunning(false);
		}
		AppState.removeEventListener('change', this._handleAppStateChange);
	}

	_handleAppStateChange(nextAppState) {
		if (this.state.appState.match(/inactive|background/) && nextAppState === 'active') {
			console.log('App has come to the foreground!');
		}
		this.setState({...this.state, appState: nextAppState});
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

function mapStateToProps(state) {
	return { myContact: state.contactState.myContact}
}
export default connect(mapStateToProps, {getAllContacts, loadPersistedState, changeView})(App);