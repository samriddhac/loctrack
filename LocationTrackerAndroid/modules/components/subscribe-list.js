import React, {Component} from 'react';
import {Text, View, TextInput, TouchableHighlight, 
	TouchableNativeFeedback, TouchableOpacity, ListView, Image} from 'react-native';
import Octicons from 'react-native-vector-icons/Octicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {connect} from 'react-redux';
import styles from '../styles/style';
import { VIEW_MAP } from '../common/constants';
import {changeView} from '../actions/index';

class SubscribeList extends Component {

	constructor(props) {
		super(props);
		this._renderRow = this._renderRow.bind(this);
		this._goToMap = this._goToMap.bind(this);
	}

	componentWillMount() {
		let subdataSource = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
		this.setState({ 
			subdataSource:subdataSource.cloneWithRows(this.props.subscribedTo)
		});
	}
	_goToMap() {
		this.props.changeView(VIEW_MAP);
	}

	_stopSubscription() {

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
				<TouchableOpacity onPress={()=>{
						this._goToMap(data);
					}}>
					<MaterialCommunityIcons name="map-marker-multiple" size={35} 
						style={[styles.mapButton]} />
				</TouchableOpacity>
				<TouchableOpacity onPress={()=>{
						this._stopSubscription(data);
					}}>
					<Octicons name="stop" size={30} 
						style={[styles.stopButton]} />
				</TouchableOpacity>
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
	return {
		subscribedTo: state.contactState.subscribedTo
	};
}
export default connect(mapStateToProps, {changeView})(SubscribeList);