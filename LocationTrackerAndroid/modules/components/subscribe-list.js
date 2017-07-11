import React, {Component} from 'react';
import {TextInput, TouchableHighlight, 
	TouchableNativeFeedback, TouchableOpacity,
	ListView, Image, FlatList} from 'react-native';
import Octicons from 'react-native-vector-icons/Octicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {connect} from 'react-redux';
import _ from 'lodash';
import styles from '../styles/style';
import { VIEW_MAP, STATUS_APPROVED, ALL_FRIEND } from '../common/constants';
import {changeView, removeSubsContact, addToMap} from '../actions/index';
import { getStatus } from '../utils/utilities';
import {removeSubs, shareRequest} from '../websocket-receiver';
import { createAnimatableComponent, View, Text } from 'react-native-animatable';
import SubscribeRow from './subscribe-row';

class SubscribeList extends Component {

	constructor(props) {
		super(props);
		this.state = { 
			selectionCount:0
		};
		this.selectedData = [];
		this._renderRow = this._renderRow.bind(this);
		this._goToMap = this._goToMap.bind(this);
		this._stopSubscription = this._stopSubscription.bind(this);
		this._onRowPressed = this._onRowPressed.bind(this);
		this._requestShare = this._requestShare.bind(this);
	}

	_goToMap(data) {
		this.props.addToMap(data);
		this.props.changeView(VIEW_MAP);
	}

	_stopSubscription(data) {
		this.props.removeSubsContact(data.phno);
		removeSubs(this.props.myContact, {to:data.phno});
	}

	_requestShare() {
		let reData = [];
		if(this.selectedData!==undefined && this.selectedData!==null
			&& this.selectedData.length>0) {
			this.selectedData.forEach((item)=>{
				reData.push({to:item.phno});
			});
			shareRequest(this.props.myContact, reData);
		}
	}
	
	_onRowPressed(data) {
		if(data!==undefined) {
			_.remove(this.selectedData, {recordID:data.recordID});
			if(data.selected !==undefined
			&& data.selected === true) {
				this.selectedData = [data, ...this.selectedData];
			}
		}
		let newCount = this.selectedData.length;
		this.setState({...this.state, selectionCount:newCount});
	}

	_renderRequestShare() {
		if(this.state.selectionCount>0) {
			return (
				<View animation="zoomIn" style={[styles.globalRequestShareButtonTxtContainer]}>
			    	<View>
						<TouchableNativeFeedback onPress={()=>{
								this._requestShare();
							}}
							background={TouchableNativeFeedback.Ripple('#CC39C4', true)}>
							<View style={[styles.globalRequestShareButtonContainer]}>
							<FontAwesome name="share" size={35} 
							style={[styles.globalRequestShareBackButton]} />
							</View>
						</TouchableNativeFeedback>
					</View>
					<Text style={styles.btnBottomShareText}>Request Share</Text>
				</View>
			);
		}
		else {
			return null;
		}
	}

	_renderRow(record) {
		let data = record.item;
		return(
			<SubscribeRow data={data}
			_stopSubscription={this._stopSubscription}
			_goToMap={this._goToMap}
			_onRowPressed={this._onRowPressed}
			/>
		);
	}

	renderSeparator() {
		return (
		  <View
		    style={styles.separator}
		  />
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
						<FlatList
				          data={this.props.subscribedTo}
				          renderItem={this._renderRow}
				          pagingEnabled={true}
				          ItemSeparatorComponent={this.renderSeparator}
				        />
			        </View>
			        <View style={styles.globalButtonContainer}>
			        	{this._renderRequestShare()}
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