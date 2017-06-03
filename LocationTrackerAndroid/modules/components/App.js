import React, { Component } from 'react';
import {Text, View, StatusBar, AsyncStorage} from 'react-native';
import { connect } from 'react-redux';

import styles from '../styles/style';
import ViewStateManager from './view-state-manager';
import {getAllContacts, loadPersistedState, changeView} from '../actions/index';
import {VIEW_REGISTER, VIEW_HOME, STATE} from '../common/constants';

class App extends Component {

	constructor(props) {
		super(props);

		this.state = {
			persistedLoaded: false
		}
	}

	componentWillMount() {
		let _parent = this;
		AsyncStorage.getItem(STATE).then((result)=>{
			 let data = JSON.parse(result);
			 _parent.props.loadPersistedState(data.contactState);
			 if(data.contactState.myContact===undefined || data.contactState.myContact===null
				|| data.contactState.myContact==='') {
				_parent.props.changeView(VIEW_REGISTER);
			}
			else {
				_parent.props.changeView(VIEW_HOME);
			}
		});
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

function mapStateToProps(state) {
	return { myContact: state.contactState.myContact}
}
export default connect(mapStateToProps, {getAllContacts, loadPersistedState, changeView})(App);