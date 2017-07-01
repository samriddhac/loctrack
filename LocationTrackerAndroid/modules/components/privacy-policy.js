import React, { Component } from 'react';
import {
	TouchableNativeFeedback,
	KeyboardAvoidingView,
	WebView
} from 'react-native';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import { connect } from 'react-redux';
import styles from '../styles/style';
import { createAnimatableComponent, View, Text } from 'react-native-animatable';
import { VIEW_HOME, PRIVACY_LINK } from '../common/constants';
import {changeView} from '../actions/index';

class PrivacyPolicy extends Component {

	constructor(props) {
		super(props);

		this._backHome = this._backHome.bind(this);
	}

	_backHome() {
		this.props.changeView(VIEW_HOME);
	}

	render() {
		return(
			<View animation="fadeInRight" delay={100} style={styles.searchBoxContainer}>
				<View style={styles.searchTextBox} >
					<TouchableNativeFeedback onPress={this._backHome}
					background={TouchableNativeFeedback.Ripple('#CC39C4', true)}>
						<View style={[styles.backContainer]}>
							<EvilIcons name="chevron-left" size={44} 
							style={[styles.searchBack]}/>
						</View>
					</TouchableNativeFeedback>
					<Text style={styles.countText}>Privacy Policy</Text>
				</View>
				<View style={styles.searchResultContainer}>
					<WebView source={{uri: PRIVACY_LINK}} />
				</View>
			</View>
		);
	}
}

export default connect(null, {changeView})(PrivacyPolicy);