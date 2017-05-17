import React, { Component } from 'react';
import {Text, View, TextInput} from 'react-native';
import {connect} from 'react-redux';
import styles from '../styles/style';

class Search extends Component {
	render() {
		return (
		<View style={styles.searchContainer}>
			<View style={styles.searchBox}>
				<TextInput style={{height: 40, borderColor: 'gray', borderWidth: 1}}/>
			</View>
	        <View style={styles.searchResult}/>
      	</View>
		);
	}
}
function mapStateToProps(state) {
	return { contacts: state.contactState.contacts};
}
export default connect()(Search);