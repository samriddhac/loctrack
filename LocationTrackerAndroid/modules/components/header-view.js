import React, { Component } from 'react';
import {Text, View, 
	Image, TouchableNativeFeedback
} from 'react-native';
import styles from '../styles/style';
import Icon from 'react-native-vector-icons/Entypo';
import OIcon from 'react-native-vector-icons/Octicons';
import { connect } from 'react-redux';
import {
  Menu,
  MenuOptions,
  MenuOption,
  MenuTrigger,
} from 'react-native-popup-menu';
import {changeView} from '../actions/index';
import { VIEW_PRIVACY_POLICY } from '../common/constants';

class Header extends Component  {

	constructor(props) {
		super(props);
		this._showPrivacyPolicy = this._showPrivacyPolicy.bind(this);
	}

	_showPrivacyPolicy() {
		this.props.changeView({id:VIEW_PRIVACY_POLICY, options:{}});
	}
	render() {
		return (
			<View style={styles.headerContent}>
				<View style={ styles.headerMenuBtn }>
					<View>
						<TouchableNativeFeedback onPress={()=> { this.props.openNav(); }}
						background={TouchableNativeFeedback.Ripple('#CC39C4', true)}>
							<View style={[styles.searchIconContainer]}>
								<Icon name="menu" size={30} 
								style={[styles.headerIcon, styles.headerIconSearch]}/>
							</View>
						</TouchableNativeFeedback>
					</View>
				</View>
				<Text style={[styles.headerText, styles.defaultFont]}>WhereApp</Text>
				<View style={ styles.headerIconBtn }>
					<View>
						<Menu>
					      <MenuTrigger>
					      	<Icon name="dots-three-vertical" size={24} 
								style={[styles.headerIcon,styles.headerIconThreeDots]}/>
					      </MenuTrigger>
					      <MenuOptions>
					        <MenuOption onSelect={() => this._showPrivacyPolicy()} 
					        customStyle={styles.optionStyles}>
					          <Text style={styles.menuOptionTextStyle}>Privacy Policy</Text>
					        </MenuOption>
					      </MenuOptions>
					    </Menu>
					</View>
				</View>
			</View>
		);
	}
}

export default connect(null, {changeView})(Header);