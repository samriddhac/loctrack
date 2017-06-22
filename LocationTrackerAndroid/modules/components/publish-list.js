import React, {Component} from 'react';
import {Text, View, TextInput, TouchableHighlight, 
	TouchableNativeFeedback, TouchableOpacity, ListView, Image} from 'react-native';
import {connect} from 'react-redux';
import Octicons from 'react-native-vector-icons/Octicons';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import Foundation from 'react-native-vector-icons/Foundation';
import Ionicons from 'react-native-vector-icons/Ionicons';
import styles from '../styles/style';
import {addToPublishContact, removePublishContact} from '../actions/index';
import {subscriptionApproveRequest, removePubs} from '../websocket-receiver';
import {isServiceRunning, start, stop} from '../geolocation-receiver';
import { STATUS_PENDING, STATUS_APPROVED} from '../common/constants';

class PublishList extends Component {

	constructor(props) {
		super(props);

		this._renderRow = this._renderRow.bind(this);
		this._startPublish = this._startPublish.bind(this);
		this._stopPublish = this._stopPublish.bind(this);
		this._stopLocationPublish = this._stopLocationPublish.bind(this);
		this._shareLocation = this._shareLocation.bind(this);
	}
	componentWillMount() {
		this.setDataSource(this.props);
	}
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
		this.setDataSource(nextProps);
	}
	setDataSource(props) {
		let pubdataSource = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
		this.setState({
			pubdataSource:pubdataSource.cloneWithRows(props.publishingTo)
		});
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
		}
	}
	_stopLocationPublish() {
		this._stopService();
	}
	_shareLocation() {
		let isPublish = isServiceRunning();
		if(isPublish === false) {
			start();
		}
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
				<View style={[styles.subRightBtnContainer]}>
					<TouchableNativeFeedback onPress={()=>{
							this._startPublish(data);
						}}
						background={TouchableNativeFeedback.Ripple('#CC39C4', true)}>
						<EvilIcons name="check" size={50} 
							style={[styles.checkButton]} />
					</TouchableNativeFeedback>
					<TouchableNativeFeedback onPress={()=>{
							this._stopPublish(data);
						}}
						background={TouchableNativeFeedback.Ripple('#CC39C4', true)}>
						<EvilIcons name="close-o" size={50} 
							style={[styles.stopButton]} />
					</TouchableNativeFeedback>
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
		        <View style={[styles.globalShareButtonContainer]}>
					<TouchableNativeFeedback onPress={()=>{
							this._shareLocation();
						}}
						background={TouchableNativeFeedback.Ripple('#CC39C4', true)}>
						<Foundation name="share" size={40} 
						style={[styles.globalShareBackButton]} />
					</TouchableNativeFeedback>
				</View>
				<View style={[styles.globalStopButtonContainer]}>
					<TouchableNativeFeedback onPress={()=>{
							this._stopLocationPublish();
						}}
						background={TouchableNativeFeedback.Ripple('#CC39C4', true)}>
						<Ionicons name="ios-close-circle-outline" size={45} 
						style={[styles.globalStopButton]} />
					</TouchableNativeFeedback>
				</View>
			</View>
		);
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
		myContact: state.contactState.myContact
	};
}
export default connect(mapStateToProps, {addToPublishContact, removePublishContact})(PublishList);