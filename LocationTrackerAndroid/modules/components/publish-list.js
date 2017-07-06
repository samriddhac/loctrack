import React, {Component} from 'react';
import {TextInput, TouchableHighlight, 
	TouchableNativeFeedback, 
	TouchableOpacity, 
	ListView, 
	FlatList,
	Image,
	ToastAndroid} from 'react-native';
import {connect} from 'react-redux';
import Octicons from 'react-native-vector-icons/Octicons';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import Foundation from 'react-native-vector-icons/Foundation';
import Ionicons from 'react-native-vector-icons/Ionicons';
import styles from '../styles/style';
import {addToPublishContact, removePublishContact,
		addToSelectedReceiver, removeSelectedReceiver} from '../actions/index';
import {subscriptionApproveRequest, removePubs, stopPublishLocation} from '../websocket-receiver';
import {isServiceRunning, start, stop } from '../geolocation-receiver';
import { STATUS_PENDING, STATUS_APPROVED} from '../common/constants';
import { createAnimatableComponent, View, Text } from 'react-native-animatable';
import {sendGeoTrackingNotification, stopGeoTrackingNotification} from '../pushnotification';
import PublishRow from './publish-row';

class PublishList extends Component {

	constructor(props) {
		super(props);

		this._renderRow = this._renderRow.bind(this);
		this._startPublish = this._startPublish.bind(this);
		this._stopPublish = this._stopPublish.bind(this);
		this._stopLocationPublish = this._stopLocationPublish.bind(this);
		this._shareLocation = this._shareLocation.bind(this);
		this._addToSelectedReceiver = this._addToSelectedReceiver.bind(this);		
		this._removeSelectedReceiver = this._removeSelectedReceiver.bind(this);
	}

	componentWillMount() {}
	componentWillReceiveProps(nextProps){
		if(nextProps.publishingTo===undefined ||
			nextProps.publishingTo===null ||
			nextProps.publishingTo.length===0) {
			this._stopService();
		}
		else {
			let approvedCount = 0;
			nextProps.publishingTo.forEach((pub)=>{
				if(pub.status===STATUS_APPROVED){
					approvedCount++;
				}
			});
			if(approvedCount === 0) {
				this._stopService();
			}
		}
	}
	_startPublish(data) {
		this.props.addToPublishContact(data.phno, STATUS_APPROVED);
		subscriptionApproveRequest(this.props.myContact, {to:data.phno});
	}
	_stopPublish(data) {
		this.props.removePublishContact(data.phno);
		removePubs(this.props.myContact, {to:data.phno});
	}
	_stopService() {
		let isPublish = isServiceRunning();
		if(isPublish === true) {
			stop();
			stopGeoTrackingNotification();
			stopPublishLocation(this.props.myContact, {}, this.props.selected);
		}
	}
	_stopLocationPublish() {
		this._stopService();
		ToastAndroid.showWithGravity('Stopped location sharing', 
			ToastAndroid.SHORT, ToastAndroid.TOP);
	}
	_shareLocation() {
		let isPublish = isServiceRunning();
		if(isPublish === false) {
			start();
			ToastAndroid.showWithGravity('Started location sharing to approved subscribers', 
			ToastAndroid.SHORT, ToastAndroid.TOP);
			sendGeoTrackingNotification();
		}
	}
	_addToSelectedReceiver(ph) {
		this.props.addToSelectedReceiver(ph);
	}
	_removeSelectedReceiver(ph) {
		this.props.removeSelectedReceiver(ph);
	}
	renderSeparator() {
		return (
		  <View
		    style={styles.separator}
		  />
		);
	}
	_renderRow(record) {
		let data = record.item;
		return(
			<PublishRow data={data}
			selected = {this.props.selected} 
			_stopPublish={this._stopPublish}
			_startPublish={this._startPublish}
			_addToSelectedReceiver={this._addToSelectedReceiver}
			_removeSelectedReceiver={this._removeSelectedReceiver}
			/>
		);
	}

	render() {
		if(this.props.publishingTo==undefined || this.props.publishingTo==null
			|| this.props.publishingTo.length==0) {
			return (
				<View style={[styles.regItems]}>
					<Text style={[styles.welcomeStyle]}>
						Please search in your contact, and allow your friends to receive your location.
					</Text>
				</View>
			);
		}
		else {
			return(
				<View animation="fadeInRight" delay={100} style={styles.searchResultContainer}>
					<View style={styles.listViewContainer}>
						<FlatList
				          data={this.props.publishingTo}
				          renderItem={this._renderRow}
				          pagingEnabled={true}
				          ItemSeparatorComponent={this.renderSeparator}
				        />
			        </View>
			        <View style={styles.globalButtonContainer}>
			        	<View style={styles.globalShareButtonTxtContainer}>
				        	<View>
								<TouchableNativeFeedback onPress={()=>{
										this._shareLocation();
									}}
									background={TouchableNativeFeedback.Ripple('#CC39C4', true)}>
									<View style={[styles.globalShareButtonContainer]}>
										<Foundation name="share" size={35} 
										style={[styles.globalShareBackButton]} />
									</View>
								</TouchableNativeFeedback>
							</View>
							<Text style={styles.pubBtnTxtStyle}>Share Location</Text>
						</View>
						<View style={styles.globalStopButtonTxtContainer}>
							<View>
								<TouchableNativeFeedback onPress={()=>{
										this._stopLocationPublish();
									}}
									background={TouchableNativeFeedback.Ripple('#CC39C4', true)}>
									<View style={[styles.globalStopButtonContainer]}>
										<Ionicons name="ios-close-circle-outline" size={35} 
										style={[styles.globalStopButton]} />
									</View>
								</TouchableNativeFeedback>
							</View>
							<Text style={styles.pubBtnTxtStyle}>Stop Sharing</Text>
						</View>
			        </View>
				</View>
			);
		}
	}
}

function mapStateToProps(state) {
	let pub = [];
	if(state.contactState!==undefined && state.contactState!==null
		&& state.contactState.publishingTo!==undefined 
		&& state.contactState.publishingTo!==null) {
		pub = state.contactState.publishingTo;
	}
	return {
		publishingTo: pub,
		myContact: state.contactState.myContact,
		selected: state.contactState.selectedReceiver
	};
}
export default connect(mapStateToProps, {addToPublishContact, 
	removePublishContact, addToSelectedReceiver, 
	removeSelectedReceiver})(PublishList);