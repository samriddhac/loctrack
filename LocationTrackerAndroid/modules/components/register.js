import React, {Component} from 'react';
import {Text, View, TextInput, Button, 
	KeyboardAvoidingView, AsyncStorage,
	ToastAndroid} from 'react-native';
import { connect } from 'react-redux';
import styles from '../styles/style';
import {setMyContact, changeView} from '../actions/index';
import {VIEW_HOME, STATE} from '../common/constants';
import {initConnection, initAuth} from '../websocket-receiver';
import {trimNo} from '../utils/utilities';


class RegisterView extends Component {

	constructor(props) {
		super(props);
		this.state = {
			no:'',
			behavior: 'padding'
		};
		this.onButtonPress = this.onButtonPress.bind(this);
	}

	onButtonPress() {
		if(this.state.no!=='') {
			let cn = trimNo(this.state.no);
			let updatedState = {subscribedTo:this.props.contactState.subscribedTo,
				publishingTo:this.props.contactState.publishingTo, myContact:cn};
			let serializedState = JSON.stringify(updatedState);
			AsyncStorage.setItem(STATE, serializedState).then((result)=>{
				this.props.setMyContact(cn);
				this.props.changeView(VIEW_HOME);
				let from = cn;
				initConnection(from);
				initAuth(from);
				ToastAndroid.showWithGravity('Registered Successfully!!', ToastAndroid.SHORT, ToastAndroid.TOP);
			});
			
		}
	}

	render() {
		return(
			<View style={styles.homeContainer}>
				<View style={styles.header}>
					<View style={styles.headerContent}>
						<Text style={[styles.headerText, styles.defaultFont]}>WhereApp</Text>
					</View>
				</View>
				<View style={[styles.registerContainer]}>
					<View style={[styles.regItems]}>
						<Text style={[styles.welcomeStyle]}>
							Welcome to WhereApp!! Please provide your phone number for registration.
						</Text>
						<KeyboardAvoidingView style={[styles.regItemsTextInput]} behavior={this.state.behavior}>
							<TextInput onChangeText={(text) => {this.setState({no:text});}}
	        				keyboardType = 'numeric'
	        				placeholder="Please enter your number!"
	        				style={[styles.TextInputStyleReg]} />
						</KeyboardAvoidingView>
	        			<View style={[styles.regItemsButton]}>
	        				<Button
	        					style= {[styles.roundBtn]}
					            onPress={this.onButtonPress}
					            title="Enter!"
					            color="#4A44F2"
					            accessibilityLabel="Enter!"
					          />
	        			</View>
			          </View>
				</View>
			</View>
		);
	}
}
function mapStateToProps(state) {
	return { contactState:state.contactState};
}
export default connect(mapStateToProps,{setMyContact, changeView})(RegisterView);