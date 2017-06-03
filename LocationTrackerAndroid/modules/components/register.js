import React, {Component} from 'react';
import {Text, View, TextInput, Button, KeyboardAvoidingView} from 'react-native';
import { connect } from 'react-redux';

import styles from '../styles/style';
import {setMyContact, changeView} from '../actions/index';
import {VIEW_HOME} from '../common/constants';

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
			this.props.setMyContact(this.state.no, this.props.contactState);
			this.props.changeView(VIEW_HOME);
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
					            color="#841584"
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