import React, { Component } from 'react';
import {Text, View, TextInput, TouchableHighlight, 
	TouchableNativeFeedback, TouchableOpacity, ListView, Image} from 'react-native';
import Autocomplete from 'react-native-autocomplete-input';
import {connect} from 'react-redux';
import styles from '../styles/style';
import Header from './header';

class Home extends Component {

	constructor(props) {
		super(props);
	}

	componentWillMount() {
		let dataSource = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
		this.setState({dataSource:dataSource.cloneWithRows(this.props.recent)});
	}

	_renderRow(data, sectionId, rowId, highlight) {
		let thumbnail = require('../../modules/images/icons/default.jpg');
		if(data.thumbnailPath!==undefined && data.thumbnailPath!==null 
			&& data.thumbnailPath!=='') {
			thumbnail = {uri:data.thumbnailPath};
		}
		let name = '';
		if(data.givenName!==undefined && data.givenName!==null 
			&& data.givenName!=='') {
			name = data.givenName;
		}
		if(data.familyName!==undefined && data.familyName!==null 
			&& data.familyName!=='') {
			name = name + ' ' + data.familyName;
		}
		return(
			<View style={styles.row}>
				<View style={[styles.contactContainer]}>
					<Image style={styles.thumb} source={thumbnail}
		            defaultSource={require('../../modules/images/icons/default.jpg')} />
		            <Text style={[styles.rowText, , styles.defaultFont]}>
		              {name}
		            </Text>
				</View>
          	</View>
		);
	}

	render() {
		return (
		<View style={styles.homeContainer}>
			<View style={styles.header}>
				<Header/>
			</View>
			<View style={styles.content}>
				<View style={styles.searchResultContainer}>
					<ListView
			          dataSource={this.state.dataSource}
			          renderRow={this._renderRow}
			          renderSeparator={(sectionId, rowId) => <View style=
    {styles.separator} />}
			        />
				</View>
			</View>
      	</View>
		);
	}
}
function mapStateToProps(state) {
	return { 
		contacts: state.contactState.contacts,
		recent: state.contactState.recent
	};
}
export default connect(mapStateToProps)(Home);