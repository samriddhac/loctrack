import React, {Component} from 'react';
import {Text, View, TextInput, TouchableHighlight, 
	TouchableNativeFeedback, TouchableOpacity, ListView, Image} from 'react-native';
import {connect} from 'react-redux';
import styles from '../styles/style';

class PublishList extends Component {

	constructor(props) {
		super(props);
	}
	
	componentWillMount() {
		let pubdataSource = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
		this.setState({
			pubdataSource:pubdataSource.cloneWithRows(this.props.publishingTo)
		});
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
		return(
			<View style={styles.searchResultContainer}>
				<ListView
		          dataSource={this.state.pubdataSource}
		          renderRow={this._renderRow}
		          renderSeparator={(sectionId, rowId) => <View style=
{styles.separator} />}
		        />
			</View>
		);
	}
}

function mapStateToProps(state) {
	let pub = []
	if(state.contactState!==undefined && state.contactState!==null
		&& state.contactState.publishingTo!==undefined 
		&& state.contactState.publishingTo!==null) {
		pub = state.contactState.publishingTo;
	}
	return {
		publishingTo: pub
	};
}
export default connect(mapStateToProps)(PublishList);