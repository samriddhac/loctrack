import React, { Component } from 'react';
import { connect } from 'react-redux';
import {KeyboardAvoidingView,
	SectionList,
	TextInput,
	TouchableHighlight,
	TouchableNativeFeedback,
	ToastAndroid} from 'react-native';
import { createAnimatableComponent, View, Text } from 'react-native-animatable';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {changeView, 
	requestLocation, 
	addToPublish,
	addToSelectedReceiver, 
	removeSelectedReceiver,
	addToMap,
	removeSubsContact,
	removePublishContact} from '../actions/index';
import ContactListItem from './contact-list-item';
import _ from 'lodash';
import styles from '../styles/style';
import { VIEW_HOME, 
	STATUS_PENDING,
	STATUS_LIVE, 
	STATUS_APPROVED} from '../common/constants';
import {subscriptionRequest, 
	subscriptionApproveRequest, 
	addDataToPublish,
	removeSubs,
	removePubs} from '../websocket-receiver';
import {sendGeoTrackingNotification, stopGeoTrackingNotification} from '../pushnotification';
import {isServiceRunning, start, stop } from '../geolocation-receiver';


class SearchView extends React.PureComponent {

	constructor(props) {
		super(props);
		this.state = { 
			text: '',
			behavior: 'padding',
			currentList: [],
			selectionCount:0,
			isGeolocationOn: isServiceRunning()
		};

		this.selectedData = [];
		this.listData = [];

		this._backHome = this._backHome.bind(this);
		this._renderHeader = this._renderHeader.bind(this);
		this._renderRow = this._renderRow.bind(this);
		this._renderSections = this._renderSections.bind(this);
		this._setDataOption = this._setDataOption.bind(this);
		this._renderList = this._renderList.bind(this);
		this._onRowPressed = this._onRowPressed.bind(this);
		this._renderBottomBar = this._renderBottomBar.bind(this);
		this._getBottomBarButton = this._getBottomBarButton.bind(this);
		this._getSingleRightCornerButton = this._getSingleRightCornerButton.bind(this);
		this._getDoubleBottombarButton = this._getDoubleBottombarButton.bind(this);
		this._getShareUnshareButton = this._getShareUnshareButton.bind(this);

		this._addToSelectedReceiver = this._addToSelectedReceiver.bind(this);		
		this._removeSelectedReceiver = this._removeSelectedReceiver.bind(this);
		this._goToMap = this._goToMap.bind(this);

		this._requestLocation = this._requestLocation.bind(this);
		this._shareLocation = this._shareLocation.bind(this);
		this._stopShare = this._stopShare.bind(this);
		this._stopReceiving = this._stopReceiving.bind(this);
		this._declineRequest = this._declineRequest.bind(this);
		this._stopAltShare = this._stopAltShare.bind(this);
	}

	componentWillReceiveProps(newProps) {
		if(newProps.selectedReceiver===undefined
			|| newProps.selectedReceiver===null
			|| newProps.selectedReceiver.length===0) {
			let isGeolocationOn = isServiceRunning();
			if(isGeolocationOn === true) {
				stop();
				stopGeoTrackingNotification();
				this.setState({isGeolocationOn: false});
			}
		}
	}

	_addToSelectedReceiver(ph) {
		this.props.addToSelectedReceiver(ph);
	}
	_removeSelectedReceiver(ph) {
		this.props.removeSelectedReceiver(ph);
	}
	_goToMap(data) {
		this.props.addToMap(data);
		this.props.changeView(VIEW_HOME);
	}

	_backHome() {
		this.props.changeView({id:VIEW_HOME, options:{}});
	}

	_renderHeader() {
		let {options} = this.props;
		if(this.state.selectionCount>0) {
			return (
				<Text style={styles.countText}>{this.state.selectionCount}</Text>
			);
		}
		else {
			return (
			<TextInput onChangeText={(text) => this._filterData(text, options)}
				underlineColorAndroid='rgba(0,0,0,0)'
				placeholder='Search...'
				style={[styles.TextInputStyle]} />
			);
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

	_renderRow(data) {
		return(
			<ContactListItem data={data} 
			_onRowPressed={this._onRowPressed}
			_addToSelectedReceiver={this._addToSelectedReceiver}
			_removeSelectedReceiver={this._removeSelectedReceiver}
			_goToMap={this._goToMap}
			options={this.props.options}
			/>
		);
	}

	_renderSections(data) {
		return (
			<SectionList
			  renderItem={this._renderRow}
			  renderSectionHeader={({section}) => {
			  	return (<View style={styles.sectionHeader}><Text>{section.key}</Text></View>);
			  }}
			  sections={data}
			  pagingEnabled={true}
			/>
		);
	}

	_setDataOption(firstList, secondList, firsTtitle, secondTitle) {
		let optionData = [];
		if(firstList!==undefined && firstList!==null
			&& firstList.length>0) {
			let objData = {
				key: firsTtitle,
				data: firstList
			}
			optionData.push(objData);
		}
		if(secondList!==undefined && secondList!==null
			&& secondList.length>0) {
			let objData = {
				key: secondTitle,
				data: secondList
			}
			optionData.push(objData);
		}
		return optionData;
	}

	_renderList(options) {
		let sectionData =[];
		if(this.state.text!==undefined && this.state.text!==null
			&& this.state.text!=='') {
			sectionData = this._setDataOption(this.listData,
			null, 'Search Results', null);
			return this._renderSections(sectionData);
		}
		else {
			switch(options.optionId) {
				case 1:
					sectionData = this._setDataOption(this.props.subscribedTo,
					this.props.contacts, 'Recent Sharers', 'All Contacts');
					return this._renderSections(sectionData);
				case 2:
					sectionData = this._setDataOption(this.props.publishingTo,
					this.props.contacts, 'Recent Recipients', 'All Contacts');
					return this._renderSections(sectionData);
				case 3:
					sectionData = this._setDataOption(this._getSharedList(),
					null, 'My Recipients', null);
					return this._renderSections(sectionData);
				case 4:
					sectionData = this._setDataOption(this._filterByStatus(this.props.subscribedTo, STATUS_LIVE),
					null, 'Location Sharers', null);
					return this._renderSections(sectionData);
				case 5:
					sectionData = this._setDataOption(this._filterByStatus(this.props.subscribedTo, STATUS_PENDING),
					null, 'My Pending Requests', null);
					return this._renderSections(sectionData);
				case 6:
					sectionData = this._setDataOption(this._filterByStatus(this.props.publishingTo, STATUS_PENDING),
					null, 'My Pending Approvals', null);
					return this._renderSections(sectionData);
			}
		}
	}

	_filterByStatus(itemList, statusVal) {
		let results =[];
		if(itemList!==undefined && itemList!==null
			&& itemList.length>0) {
			itemList.forEach((item)=>{
				if(item.status === statusVal) {
					results.push(item);
				}
			});
		}
		return results;
	}

	_getSharedList() {
		let results = [];
		let selections = this.props.selectedReceiver;
		let pubList = this.props.publishingTo;
		if(selections!==undefined && selections!==null
			&& selections.length>0) {
			selections.forEach((ph)=>{
				if(pubList!==undefined && pubList!==null
				&& pubList.length>0) {
					pubList.forEach((data)=>{
						if(data.phno === ph) {
							results.push(data);
						}
					});
				}
			});
		}
		return results;
	}

	_filterData(query, options) {
		this.setState({...this.state, text:query});
		if (query !== '') {
			const { contacts, subscribedTo, publishingTo } = this.props;
			switch(options.optionId) {
				case 1:
					this.listData = this._filterList(contacts, query);
					break;
				case 2:
					this.listData = this._filterList(contacts, query);
					break;
				case 3:
					this.listData = this._filterList(publishingTo, query);
					break;
				case 4:
					this.listData = this._filterList(subscribedTo, query);
					break;
				case 5:
					this.listData = this._filterList(publishingTo, query);
					break;
				case 6:
					this.listData = this._filterList(subscribedTo, query);
					break;
			}
	    }
	}

	_filterList(list, query) {
		const regex = new RegExp(`${query.trim()}`, 'i');
		let data = list.filter(item => item.searchName.search(regex) >= 0);
		return data;
	}

	_getSingleRightCornerButton(func, iconColor, iconName, iconSize, text, customIconStyle) {
		return (
			<View animation="zoomIn" style={[styles.bottomBarRightSingleContainer]}>
				<View style={[styles.bottomBarIconTextGroup]}>
					<View>
						<TouchableNativeFeedback onPress={()=>{
							func();
						}}
						background={TouchableNativeFeedback.Ripple('#CC39C4', true)}>
							<View style={[styles.bottomBarTouchIconContainerStyle, {backgroundColor:iconColor}]}>
								<MaterialCommunityIcons name={iconName} size={iconSize} 
								style={[styles.bottomBarTouchIconStyle, customIconStyle]} />
							</View>
						</TouchableNativeFeedback>
					</View>
					<Text style={styles.bottomBarText}>{text}</Text>
				</View>
			</View>
		);
	}

	_getDoubleBottombarButton(func_1, iconColor_1, iconName_1, iconSize_1, text_1, customIconStyle_1,
		func_2, iconColor_2, iconName_2, iconSize_2, text_2, customIconStyle_2) {
		return (
			<View animation="zoomIn" style={[styles.bottomBarContainer]}>
				<View style={[styles.bottomBarIconTextGroup]}>
					<View>
						<TouchableNativeFeedback onPress={()=>{
							func_1();
						}}
						background={TouchableNativeFeedback.Ripple('#CC39C4', true)}>
							<View style={[styles.bottomBarTouchIconContainerStyle, {backgroundColor:iconColor_1}]}>
								<MaterialCommunityIcons name={iconName_1} size={iconSize_1} 
								style={[styles.bottomBarTouchIconStyle, customIconStyle_1]} />
							</View>
						</TouchableNativeFeedback>
					</View>
					<Text style={styles.bottomBarText}>{text_1}</Text>
				</View>
				<View style={[styles.bottomBarIconTextGroup]}>
					<View>
						<TouchableNativeFeedback onPress={()=>{
							func_2();
						}}
						background={TouchableNativeFeedback.Ripple('#CC39C4', true)}>
							<View style={[styles.bottomBarTouchIconContainerStyle, {backgroundColor:iconColor_2}]}>
								<MaterialCommunityIcons name={iconName_2} size={iconSize_2} 
								style={[styles.bottomBarTouchIconStyle, customIconStyle_2]} />
							</View>
						</TouchableNativeFeedback>
					</View>
					<Text style={styles.bottomBarText}>{text_2}</Text>
				</View>
			</View>
		);
	}

	_getShareUnshareButton() {
		console.log('this.state.isGeolocationOn ',this.state.isGeolocationOn);
		if(this.state.isGeolocationOn === true) {
			return this._getSingleRightCornerButton(this._stopAltShare, '#CC1D23',
			'close-circle', 35, 'Stop Sharing', styles.bottomBarCustomPadding);
		}
		else {
			return this._getSingleRightCornerButton(this._shareLocation, '#4A44F2',
			'share-variant', 35, 'Share Location', styles.bottomBarCustomPadding);
		}
	}

	_getBottomBarButton() {
		let {options} = this.props;
		switch(options.optionId) {
			case 1:
				return this._getSingleRightCornerButton(this._requestLocation, '#4A44F2',
					'share', 35, 'Request Share', {});
			case 2:
				return this._getShareUnshareButton();
			case 3:
				return this._getSingleRightCornerButton(this._stopShare, '#CC1D23',
				'close-circle', 35, 'Stop Sharing', styles.bottomBarCustomPadding);
			case 4:
				return this._getSingleRightCornerButton(this._stopReceiving, '#CC1D23',
				'close-circle', 35, 'Stop Receiving', styles.bottomBarCustomPadding);
			case 5:
				return this._getSingleRightCornerButton(this._requestLocation, '#4A44F2',
					'share', 35, 'Request Share', {});
			case 6:
				return this._getDoubleBottombarButton(this._shareLocation, '#4A44F2',
			'share-variant', 35, 'Share Location', styles.bottomBarCustomPadding, this._declineRequest, '#CC1D23',
				'close-circle', 35, 'Decline Request', styles.bottomBarCustomPadding);
				
		}
	}

	_renderBottomBar() {
		if(this.state.selectionCount>0){
			return (
				<View animation="slideInUp" style={styles.bottomBar}>
					{this._getBottomBarButton()}
				</View>
			);
		}
		else {
			return null;
		}
	}

	render() {
		let {options} = this.props;
		return(
			<View animation="fadeInRight" delay={100} style={styles.searchBoxContainer}>
				<KeyboardAvoidingView style={styles.searchTextBox} behavior={this.state.behavior} >
					<TouchableNativeFeedback onPress={this._backHome}
					background={TouchableNativeFeedback.Ripple('#CC39C4', true)}>
						<View style={[styles.backContainer]}>
							<MaterialCommunityIcons name="arrow-left" size={30} 
							style={[styles.searchBack]}/>
						</View>
					</TouchableNativeFeedback>
					{this._renderHeader()}
				</KeyboardAvoidingView>
				<View style={styles.searchResultContainer}>
					{this._renderList(options)}
				</View>
				{this._renderBottomBar()}
			</View>
		);
	}

	_requestLocation() {
		let serverObjs =[];
		let from = this.props.myContact;
		if(this.selectedData!==undefined && this.selectedData.length>0) {
			this.selectedData.forEach((data)=> {
				let obj = {
					to: data.phno
				};
				serverObjs.push(obj);
				let dObj = JSON.parse(JSON.stringify(data));
				dObj.status = STATUS_PENDING;
				this.props.requestLocation(dObj);
			});
		}
		if(serverObjs!==undefined && serverObjs!==null
			&& serverObjs.length>0) {
			status = subscriptionRequest(from, serverObjs);
			if(status === true)
				ToastAndroid.showWithGravity('Location request sent', ToastAndroid.SHORT, ToastAndroid.TOP);
		}
	}

	_shareLocation() {
		let serverObjs =[];
		let from = this.props.myContact;
		if(this.selectedData!==undefined && this.selectedData.length>0) {
			this.selectedData.forEach((data)=> {
				let obj = {
					to: data.phno
				};
				serverObjs.push(obj);
				let dObj = JSON.parse(JSON.stringify(data));
				dObj.status = STATUS_APPROVED;
				this.props.addToPublish(dObj);
			});
		}
		if(serverObjs!==undefined && serverObjs!==null
			&& serverObjs.length>0) {
			status = addDataToPublish(from, serverObjs);
			if(status === true) {
				if((this.selectedData!==undefined 
				&& this.selectedData.length>0)
				|| (this.props.selectedReceiver!==undefined 
				&& this.props.selectedReceiver.length>0)) {
					let isGeolocationOn = isServiceRunning();
					if(isGeolocationOn===false) {
						start(); 
						sendGeoTrackingNotification();
						console.log('isServiceRunning ',isServiceRunning());
						this.setState({isGeolocationOn: true});
						ToastAndroid.showWithGravity('Started location sharing to approved subscribers', 
						ToastAndroid.SHORT, ToastAndroid.TOP);
					}
				}
			}
		}
	}

	_stopShare() {
		if(this.selectedData!==undefined && this.selectedData.length>0) {
			this.selectedData.forEach((data)=> {
				this.props.removeSelectedReceiver(data.phno);
			});
			this.selectedData = [];
			this.setState({selectionCount:this.selectedData.length});
		}
	}

	_stopAltShare() {
		if(this.selectedData!==undefined && this.selectedData.length>0) {
			this.selectedData.forEach((data)=> {
				this.props.removeSelectedReceiver(data.phno);
			});
		}
	}

	_stopReceiving() {
		if(this.selectedData!==undefined && this.selectedData.length>0) {
			this.selectedData.forEach((data)=> {
				this.props.removeSubsContact(data.phno);
				removeSubs(this.props.myContact, {to:data.phno});
			});
			this.selectedData = [];
			this.setState({selectionCount:this.selectedData.length});
		}
	}

	_declineRequest() {
		if(this.selectedData!==undefined && this.selectedData.length>0) {
			this.selectedData.forEach((data)=> {
				this.props.removePublishContact(data.phno);
				removePubs(this.props.myContact, {to:data.phno});
			});
			this.selectedData = [];
			this.setState({selectionCount:this.selectedData.length});
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
	let pub = [];
	if(state.contactState!==undefined && state.contactState!==null
		&& state.contactState.publishingTo!==undefined 
		&& state.contactState.publishingTo!==null) {
		pub = state.contactState.publishingTo;
	}
	return { 
		contacts: state.contactState.contacts,
		subscribedTo: sub,
		publishingTo: pub,
		myContact: state.contactState.myContact,
		selectedReceiver: state.contactState.selectedReceiver
	};
}
export default connect(mapStateToProps, 
{changeView, requestLocation, addToPublish, addToSelectedReceiver,
	removeSelectedReceiver, addToMap, removeSubsContact,
	removePublishContact})(SearchView);