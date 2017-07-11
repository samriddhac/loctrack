import React from 'react';
import {Image,
	TouchableHighlight,
	TouchableNativeFeedback} from 'react-native';
import _ from 'lodash';
import Octicons from 'react-native-vector-icons/Octicons';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import Foundation from 'react-native-vector-icons/Foundation';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { createAnimatableComponent, View, Text } from 'react-native-animatable';
import styles from '../styles/style';
import { STATUS_PENDING, STATUS_APPROVED} from '../common/constants';

export default class PublishListItem extends React.PureComponent {

	constructor(props) {
		super(props);
		this.state = {
			selected: this._getSelectionStatus(props),
			status: props.data.status
		};
	}

	componentWillReceiveProps(nextProps){
		this.setState({
			selected: this._getSelectionStatus(nextProps),
			status: nextProps.data.status
		});
	}
	_getSelectionStatus(props) {
		if(props.data!==undefined && props.data!==null
		&& props.data.phno!==undefined && props.data.phno!==null
		&& props.data.phno!=='' && props.selected!==undefined
		&& props.data.selected!==null && props.data.selected.length>0) {
			let index = _.indexOf(props.data.selected, props.data.phno);
			if(index>=0) {
				return true;
			}
		}
		return false
	}

	_onPressRow() {
		let data = this.props.data;
		if(this.state.status === STATUS_APPROVED) {
			if(this.state.selected === true) {
				data.selected = false;
				this.props._removeSelectedReceiver(data.phno);
			}
			else {
				data.selected = true;
				this.props._addToSelectedReceiver(data.phno);
			}
			this.setState({ selected: data.selected });
		}
	}

	_onCheckPress() {
		let data = this.props.data;
		data.status = STATUS_APPROVED;
		this.props._startPublish(data);
		this.setState({status:STATUS_APPROVED});
	}

	_renderApprove() {
		let data = this.props.data;
		if(this.state.status !== STATUS_APPROVED) {
			return (
				<View style={[styles.subRightBtnContainer]}>
					<TouchableNativeFeedback onPress={()=>{
							this._onCheckPress();
						}}
						background={TouchableNativeFeedback.Ripple('#CC39C4', true)}>
						<EvilIcons name="check" size={50} 
							style={[styles.checkButton]} />
					</TouchableNativeFeedback>
					<TouchableNativeFeedback onPress={()=>{
							this.props._stopPublish(data);
						}}
						background={TouchableNativeFeedback.Ripple('#CC39C4', true)}>
						<EvilIcons name="close-o" size={50} 
							style={[styles.stopButton]} />
					</TouchableNativeFeedback>
				</View>
			);
		}
		else {
			return (
				<View style={[styles.subRightStopBtnContainer]}>
					<TouchableNativeFeedback onPress={()=>{
							this.props._stopPublish(data);
						}}
						background={TouchableNativeFeedback.Ripple('#CC39C4', true)}>
						<EvilIcons name="close-o" size={50} 
							style={[styles.stopButtonSingle]} />
					</TouchableNativeFeedback>
				</View>
			);
		}
	}

	_renderSelection() {
		if(this.state.selected === true &&
			this.state.status === STATUS_APPROVED) {
			return (
				<View animation="zoomIn" style={styles.selectedPubBtnContainer}>
					<MaterialCommunityIcons name="check-circle" size={20} 
					style={[styles.selectedPubBtn]} />
				</View>
			);
		}
		else {
			return null;
		}
	}

	render() {
		let data = this.props.data;
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
			<TouchableHighlight onLongPress={() => {this._onPressRow();}} 
			underlayColor='#d6d5f2'>
				<View style={[styles.row, this.state.selected ? styles.selected :  styles.unselected]}>
					<View style={[styles.contactContainer]}>
						<Image style={styles.thumb} source={thumbnail}
			            defaultSource={require('../../modules/images/icons/default.jpg')} />
			            <Text style={[styles.rowText, , styles.defaultFont]}>
			              {name}
			            </Text>
					</View>
					{this._renderApprove()}
					{this._renderSelection()}
	          	</View>          	
          	</TouchableHighlight>
		);
	}
}