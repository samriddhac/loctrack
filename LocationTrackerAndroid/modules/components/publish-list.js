import React, {Component} from 'react';
import {Text, View, TextInput, TouchableHighlight, 
	TouchableNativeFeedback, TouchableOpacity, ListView, Image} from 'react-native';
import {connect} from 'react-redux';
import Octicons from 'react-native-vector-icons/Octicons';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import Foundation from 'react-native-vector-icons/Foundation';
import styles from '../styles/style';
import {addToPublishContact} from '../actions/index';
import {subscriptionApproveRequest} from '../websocket-receiver';
import {isServiceRunning, start, stop} from '../geolocation-receiver';
import { STATUS_PENDING, STATUS_APPROVED} from '../common/constants';

class PublishList extends Component {

	constructor(props) {
		super(props);

		this._renderRow = this._renderRow.bind(this);
		this._startPublish = this._startPublish.bind(this);
		this._stopPublish = this._stopPublish.bind(this);
		this._stopLocationPublish = this._stopLocationPublish.bind(this);
	}
	componentWillMount() {
		this.setDataSource(this.props);
	}
	componentWillReceiveProps(nextProps){
		this.setDataSource(nextProps);
	}
	setDataSource(props) {
		let pubdataSource = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
		this.setState({
			pubdataSource:pubdataSource.cloneWithRows(props.publishingTo)
		});
	}
	_startPublish(data) {
		addToPublishContact(data.phno, STATUS_APPROVED);
		subscriptionApproveRequest(this.props.myContact, {to:data.phno});
		let isPublish = isServiceRunning();
		if(isPublish === false) {
			start();
		}
	}
	_stopPublish(data) {
		if(this.props.publishingTo===undefined ||
			this.props.publishingTo===null ||
			this.props.publishingTo.length===0) {
			this._stopService();
		}
		else {
			let approvedCount = 0;
			this.props.publishingTo.forEach((pub)=>{
				if(pub.status===STATUS_APPROVED){
					approvedCount++;
				}
			});
			if(approvedCount === 0) {
				this._stopService();
			}
		}
		
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
					<TouchableOpacity onPress={()=>{
							this._startPublish(data);
						}}>
						<EvilIcons name="check" size={50} 
							style={[styles.checkButton]} />
					</TouchableOpacity>
					<TouchableOpacity onPress={()=>{
							this._stopLocationPublish();
						}}>
						<Octicons name="stop" size={35} 
							style={[styles.stopButton]} />
					</TouchableOpacity>
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
					<TouchableOpacity onPress={()=>{
						
						}}>
						<Foundation name="share" size={40} 
						style={[styles.globalShareBackButton]} />
					</TouchableOpacity>
				</View>
				<View style={[styles.globalStopButtonContainer]}>
					<TouchableOpacity onPress={()=>{
							this._stopLocationPublish();
						}}>
						<Octicons name="stop" size={40} 
						style={[styles.globalStopButton]} />
					</TouchableOpacity>
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
export default connect(mapStateToProps, {addToPublishContact})(PublishList);