import React, { Component } from 'react';
import {Text, View, Image, TouchableNativeFeedback} from 'react-native';
import styles from '../styles/style';
import Icon from 'react-native-vector-icons/Entypo';
import OIcon from 'react-native-vector-icons/Octicons';
import { connect } from 'react-redux';
import {changeView} from '../actions/index';
import { VIEW_SEARCH_BOX } from '../common/constants';

class Header extends Component  {

	constructor(props) {
		super(props);
		this._performSearch = this._performSearch.bind(this);
	}

	_performSearch() {
		this.props.changeView(VIEW_SEARCH_BOX);
	}
	render() {
		return (
			<View style={styles.headerContent}>
				<Text style={[styles.headerText, styles.defaultFont]}>WhereApp</Text>
				<View style={ styles.headerIconBtn }>
					<TouchableNativeFeedback onPress={this._performSearch}
					background={TouchableNativeFeedback.Ripple('#CC39C4', true)}>
						<View style={[styles.searchIconContainer]}>
							<OIcon name="search" size={24} 
							style={[styles.headerIcon, styles.headerIconSearch]}/>
						</View>
					</TouchableNativeFeedback>
					<TouchableNativeFeedback
					background={TouchableNativeFeedback.Ripple('#CC39C4', true)}>
						<Icon name="dots-three-vertical" size={24} 
						style={[styles.headerIcon,styles.headerIconThreeDots]}/>
					</TouchableNativeFeedback>
				</View>
			</View>
		);
	}
}

export default connect(null, {changeView})(Header);