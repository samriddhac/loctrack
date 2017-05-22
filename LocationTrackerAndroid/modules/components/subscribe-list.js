import React, {Component} from 'react';
import {Text, View, TextInput, TouchableHighlight, 
	TouchableNativeFeedback, TouchableOpacity, ListView, Image} from 'react-native';
import {connect} from 'react-redux';
import styles from '../styles/style';

class SubscribeList extends Component {

	constructor(props) {
		super(props);
	}

	componentWillMount() {
		let subdataSource = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
		this.setState({ 
			subdataSource:subdataSource.cloneWithRows(this.props.subscribedTo)
		});
	}

	_renderRow(data, sectionId, rowId, highlight) {
		console.log('calling rowdata');
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
		          dataSource={this.state.subdataSource}
		          renderRow={this._renderRow}
		          renderSeparator={(sectionId, rowId) => <View style=
{styles.separator} />}
		        />
			</View>
		);
	}
}

function mapStateToProps(state) {
	console.log('pubdataSource ',state);
	return {
		subscribedTo: state.contactState.subscribedTo
	};
}
export default connect(mapStateToProps)(SubscribeList);