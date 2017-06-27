import React, { Component } from 'react';
import { connect } from 'react-redux';
import {TextInput, 
	Image,
	TouchableOpacity,
	TouchableNativeFeedback,
	KeyboardAvoidingView,
	TouchableHighlight,
	FlatList,
	Button,
	ToastAndroid} from 'react-native';
import Icon from 'react-native-vector-icons/Entypo';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import Octicons from 'react-native-vector-icons/Octicons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import _ from 'lodash';
import styles from '../styles/style';
import {changeView, requestLocation, addToPublish} from '../actions/index';
import { VIEW_HOME, VIEW_SEARCH_BOX, STATUS_PENDING, STATUS_APPROVED} from '../common/constants';
import {subscriptionRequest} from '../websocket-receiver';
import { createAnimatableComponent, View, Text } from 'react-native-animatable';
import ContactListItem from './contact-list-item';

class SearchBoxView extends React.PureComponent {

	constructor(props) {
		super(props);
		this.state = { 
			text: '',
			behavior: 'padding',
			currentList: [],
			selectionCount:0
		};

		this.listData = [];
		this.selectedData = [];

		this._backHome = this._backHome.bind(this);
		this._renderRow = this._renderRow.bind(this);
		this._requestLocation = this._requestLocation.bind(this);
		this._publishLocation = this._publishLocation.bind(this);
		this._onRowPressed = this._onRowPressed.bind(this);
	}

	componentWillMount() {
		this.listData = this.props.contacts;
		this._refreshDataSource(this.listData);
	}

	onSegmentChange(segment) {
	    this.setState({...this.state, behavior: segment.toLowerCase()});
	};

	_backHome() {
		this.props.changeView(VIEW_HOME);
	}

	_requestLocation() {
		if(this.selectedData!==undefined && this.selectedData.length>0) {
			this.selectedData.forEach((data)=> {
				let from = this.props.myContact;
				let obj = {
					to: data.phno
				};
				subscriptionRequest(from, obj);
				let dObj = JSON.parse(JSON.stringify(data));
				dObj.status = STATUS_PENDING;
				this.props.requestLocation(dObj);
			});
			ToastAndroid.showWithGravity('Location request sent', ToastAndroid.LONG, ToastAndroid.TOP);	
		}
		
	}
	_publishLocation() {
		if(this.selectedData!==undefined && this.selectedData.length>0) {
			this.selectedData.forEach((data)=> {
				let dObj = JSON.parse(JSON.stringify(data));
				dObj.status = STATUS_APPROVED;
				this.props.addToPublish(dObj);
			});
			ToastAndroid.showWithGravity('Added as your subscriber', ToastAndroid.LONG, ToastAndroid.TOP);
		}
	}

	_filterData(query) {
		if (query === '') {
		  this.listData = this.props.contacts;
	      this._refreshDataSource(this.listData);
	    }
	    else {
	    	this.setState({...this.state, text:query});
			const { contacts } = this.props;
			const regex = new RegExp(`${query.trim()}`, 'i');
			let data = contacts.filter(contact => contact.searchName.search(regex) >= 0);
			this.listData = data;
			this._refreshDataSource(this.listData);
	    }
	}

	_refreshDataSource(listData) {
		let newList = [...listData];
		this.setState({...this.state, currentList:newList});
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

	_renderRow(record) {
		let data = record.item;
		return(
			<ContactListItem data={data} _onRowPressed={this._onRowPressed}/>
		);
	}

	_renderHeader() {
		if(this.state.selectionCount>0) {
			return (
				<Text style={styles.countText}>{this.state.selectionCount}</Text>
			);
		}
		else {
			return (
			<TextInput onChangeText={(text) => this._filterData(text)}
				underlineColorAndroid='rgba(0,0,0,0)'
				placeholder='Search Contacts...'
				style={[styles.TextInputStyle]} />
			);
		}
	}

	renderSeparator() {
		return (
		  <View
		    style={styles.separator}
		  />
		);
	}

	_renderBottomBar() {
		if(this.state.selectionCount>0){
			return (
				<View animation="slideInUp" style={styles.bottomBar}>
					<TouchableHighlight onPress={() => {this._requestLocation();}} 
					underlayColor='#CC62BA'>
						<View style={[styles.bottombarBtn, styles.green]}>
							<Text style={[styles.bottomText, styles.bottomTextBlue]}>
								Request Location
							</Text>
						</View>
					</TouchableHighlight>
					<TouchableHighlight onPress={() => {this._publishLocation();}} 
					underlayColor='#CC62BA'>
						<View style={[styles.bottombarBtn, styles.violet]}>
							<Text style={[styles.bottomText, styles.bottomTextWhite]}>
								Allow Location Access
							</Text>
						</View>
					</TouchableHighlight>
				</View>
			);
		}
		else {
			return null;
		}
	}

	render() {
		return(
			<View animation="fadeInRight" delay={100} style={styles.searchBoxContainer}>
				<KeyboardAvoidingView style={styles.searchTextBox} behavior={this.state.behavior} >
					<TouchableNativeFeedback onPress={this._backHome}
					background={TouchableNativeFeedback.Ripple('#CC39C4', true)}>
						<View style={[styles.backContainer]}>
							<EvilIcons name="chevron-left" size={44} 
							style={[styles.searchBack]}/>
						</View>
					</TouchableNativeFeedback>
					{this._renderHeader()}
				</KeyboardAvoidingView>
				<View style={styles.searchResultContainer}>
					<FlatList
			          data={this.state.currentList}
			          renderItem={this._renderRow}
			          pagingEnabled={true}
			          ItemSeparatorComponent={this.renderSeparator}
			        />
				</View>
				{this._renderBottomBar()}
			</View>
		);
	}
}

function mapStateToProps(state) {
	return { 
		contacts: state.contactState.contacts,
		myContact: state.contactState.myContact
	};
}
export default connect(mapStateToProps, {changeView, requestLocation, addToPublish})(SearchBoxView);