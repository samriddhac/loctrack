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
import { VIEW_SEARCH_BOX, VIEW_PRIVACY_POLICY } from '../common/constants';

class Header extends Component  {

	constructor(props) {
		super(props);
		this._performSearch = this._performSearch.bind(this);
		this._showPrivacyPolicy = this._showPrivacyPolicy.bind(this);
	}

	_performSearch() {
		this.props.changeView(VIEW_SEARCH_BOX);
	}
	_showPrivacyPolicy() {
		this.props.changeView(VIEW_PRIVACY_POLICY);
	}
	render() {
		return (
			<View style={styles.headerContent}>
				<Text style={[styles.headerText, styles.defaultFont]}>WhereApp</Text>
				<View style={ styles.headerIconBtn }>
					<View>
						<TouchableNativeFeedback onPress={this._performSearch}
						background={TouchableNativeFeedback.Ripple('#CC39C4', true)}>
							<View style={[styles.searchIconContainer]}>
								<OIcon name="search" size={24} 
								style={[styles.headerIcon, styles.headerIconSearch]}/>
							</View>
						</TouchableNativeFeedback>
					</View>
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