import React, {Component} from 'react';
import {TextInput, TouchableHighlight, 
	TouchableNativeFeedback, TouchableOpacity, ListView, Image} from 'react-native';
import Octicons from 'react-native-vector-icons/Octicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import {connect} from 'react-redux';
import styles from '../styles/style';
import { VIEW_MAP, STATUS_APPROVED, ALL_FRIEND } from '../common/constants';
import {changeView, removeSubsContact, addToMap} from '../actions/index';
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
	_goToMap(data) {
		this.props.addToMap(data);
		this.props.changeView(VIEW_MAP);
	}

	_stopSubscription(data) {
		this.props.removeSubsContact(data.phno);
		removeSubs(this.props.myContact, {to:data.phno});
	}
	_renderApprove(data) {
		return (
			<View style={[styles.subRightContainer]}>
				<View style={[styles.subRightBtnContainer]}>
					<TouchableNativeFeedback onPress={()=>{
							this._goToMap(data.recordID);
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
		);
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
				{this._renderApprove(data)}
          	</View>
		);
	}

	render() {
		if(this.props.subscribedTo==undefined || this.props.subscribedTo==null
			|| this.props.subscribedTo.length==0) {
			return (
				<View style={[styles.regItems]}>
					<Text style={[styles.welcomeStyle]}>
						Please search in your contact, and request your friends for location sharing.
					</Text>
				</View>
			);
		}
		else {
			return(
				<View animation="fadeInRight" delay={100} style={styles.searchResultContainer}>
					<View style={styles.listViewContainer}>
						<ListView
				          dataSource={this.state.subdataSource}
				          renderRow={this._renderRow}
				          renderSeparator={(sectionId, rowId) => <View style=
		{styles.separator} />}
				        />
			        </View>
			        <View style={styles.globalButtonContainer}>
			        	<View style={[styles.globalmapButtonTxtContainer]}>
			        		<View>
								<TouchableNativeFeedback onPress={()=>{
										this._goToMap(ALL_FRIEND);
									}}
									background={TouchableNativeFeedback.Ripple('#CC39C4', true)}>
									<View style={[styles.globalmapButtonContainer]}>
									<MaterialCommunityIcons name="map-marker-multiple" size={35} 
									style={[styles.globalmapBackButton]} />
									</View>
								</TouchableNativeFeedback>
							</View>
							<Text style={styles.btnBottomText}>Map</Text>
						</View>
					</View>
				</View>
			);
		}
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
export default connect(mapStateToProps, {changeView, 
	removeSubsContact, addToMap})(SubscribeList);