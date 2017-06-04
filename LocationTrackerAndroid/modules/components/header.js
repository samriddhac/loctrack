import React, { Component } from 'react';
import {Text, View, Image, TouchableOpacity} from 'react-native';
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
					<TouchableOpacity onPress={this._performSearch}>
						<View style={[styles.searchIconContainer]}>
							<OIcon name="search" size={24} 
							style={[styles.headerIcon, styles.headerIconSearch]}/>
						</View>
					</TouchableOpacity>
					<TouchableOpacity>
						<Icon name="dots-three-vertical" size={24} 
						style={[styles.headerIcon,styles.headerIconThreeDots]}/>
					</TouchableOpacity>
				</View>
			</View>
		);
	}
}

export default connect(null, {changeView})(Header);