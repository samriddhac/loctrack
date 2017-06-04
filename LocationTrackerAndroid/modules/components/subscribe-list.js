import React, {Component} from 'react';
import {Text, View, TextInput, TouchableHighlight, 
	TouchableNativeFeedback, TouchableOpacity, ListView, Image} from 'react-native';
import Octicons from 'react-native-vector-icons/Octicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {connect} from 'react-redux';
import styles from '../styles/style';
import { VIEW_MAP } from '../common/constants';
import {changeView} from '../actions/index';
import { getStatus } from '../utils/utilities';

class SubscribeList extends Component {

	constructor(props) {
		super(props);
		this._renderRow = this._renderRow.bind(this);
		this._goToMap = this._goToMap.bind(this);
	}

	componentWillMount() {
		this.setDataSource(this.props);
	}

	componentWillReceiveProps(nextProps){
		this.setDataSource(nextProps);
	}

	setDataSource(props) {
		let subdataSource = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
		this.setState({ 
			subdataSource:subdataSource.cloneWithRows(props.subscribedTo)
		});
	}
	_goToMap() {
		this.props.changeView(VIEW_MAP);
	}

	_stopSubscription() {

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
			<View style={styles.rowSub}>
				<View style={[styles.contactContainer]}>
					<Image style={styles.thumb} source={thumbnail}
		            defaultSource={require('../../modules/images/icons/default.jpg')} />
		            <Text style={[styles.rowText, , styles.defaultFont]}>
		              {name}
		            </Text>
				</View>
				<View style={[styles.subRightContainer]}>
					<View style={[styles.subRightBtnContainer]}>
						<TouchableOpacity onPress={()=>{
								this._goToMap(data);
							}}>
							<MaterialCommunityIcons name="map-marker-multiple" size={35} 
								style={[styles.mapButton]} />
						</TouchableOpacity>
						<TouchableOpacity onPress={()=>{
								this._stopSubscription(data);
							}}>
							<Octicons name="stop" size={35} 
								style={[styles.stopButton]} />
						</TouchableOpacity>
					</View>
					<View style={[styles.statusTextContainer]}>
						<Text style={[styles.statusText]}>{getStatus(data.status)}</Text>
					</View>
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
		        <View style={[styles.globalmapButtonContainer]}>
					<TouchableOpacity onPress={()=>{
							this._goToMap(null);
						}}>
						<MaterialCommunityIcons name="map-marker-multiple" size={40} 
						style={[styles.globalmapBackButton]} />
					</TouchableOpacity>
				</View>
			</View>
		);
	}
}

function mapStateToProps(state) {
	let sub = [];
	if(state.contactState!==undefined && state.contactState!==null
		&& state.contactState.subscribedTo!==undefined 
		&& state.contactState.subscribedTo!==null) {
		sub = state.contactState.subscribedTo;
	}
	return {
		subscribedTo: sub
	};
}
export default connect(mapStateToProps, {changeView})(SubscribeList);