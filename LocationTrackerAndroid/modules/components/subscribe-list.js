import React, {Component} from 'react';
import {TextInput, TouchableHighlight, 
	TouchableNativeFeedback, TouchableOpacity, ListView, Image} from 'react-native';
import Octicons from 'react-native-vector-icons/Octicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import {connect} from 'react-redux';
import styles from '../styles/style';
import { VIEW_MAP } from '../common/constants';
import {changeView, removeSubsContact} from '../actions/index';
import { getStatus } from '../utils/utilities';
import {removeSubs} from '../websocket-receiver';
import { createAnimatableComponent, View, Text } from 'react-native-animatable';

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

	_stopSubscription(data) {
		this.props.removeSubsContact(data.phno);
		removeSubs(this.props.myContact, {to:data.phno});
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
						<TouchableNativeFeedback onPress={()=>{
								this._goToMap(data);
							}}
							background={TouchableNativeFeedback.Ripple('#CC39C4', true)}>
							<MaterialCommunityIcons name="map-marker-multiple" size={35} 
								style={[styles.mapButton]} />
						</TouchableNativeFeedback>
						<TouchableNativeFeedback onPress={()=>{
								this._stopSubscription(data);
							}}
							background={TouchableNativeFeedback.Ripple('#CC39C4', true)}>
							<EvilIcons name="close-o" size={45} 
								style={[styles.stopButton]} />
						</TouchableNativeFeedback>
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
			<View animation="zoomInRight" delay={3000} style={styles.searchResultContainer}>
				<ListView
		          dataSource={this.state.subdataSource}
		          renderRow={this._renderRow}
		          renderSeparator={(sectionId, rowId) => <View style=
{styles.separator} />}
		        />
		        <View style={[styles.globalmapButtonContainer]}>
					<TouchableNativeFeedback onPress={()=>{
							this._goToMap(null);
						}}
						background={TouchableNativeFeedback.Ripple('#CC39C4', true)}>
						<MaterialCommunityIcons name="map-marker-multiple" size={40} 
						style={[styles.globalmapBackButton]} />
					</TouchableNativeFeedback>
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
		subscribedTo: sub,
		myContact: state.contactState.myContact
	};
}
export default connect(mapStateToProps, {changeView, removeSubsContact})(SubscribeList);