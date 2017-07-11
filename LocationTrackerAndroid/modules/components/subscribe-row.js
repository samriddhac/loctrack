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
import { getStatus } from '../utils/utilities';

export default class SubscribeListItem extends React.PureComponent {

	constructor(props) {
		super(props);
		this.state = {
			status: props.data.status
		};
	}

	componentWillReceiveProps(nextProps){
		this.setState({
			status: nextProps.data.status
		});
	}

	_onPressRow() {
		let data = this.props.data;
		if(this.state.status === STATUS_APPROVED) {
			if(this.state.selected === true) {
				data.selected = false;
			}
			else {
				data.selected = true;
			}
			this.setState({ selected: data.selected });
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
				<View style={[styles.rowSub, this.state.selected ? styles.selected :  styles.unselected]}>
					<View style={[styles.contactContainer]}>
						<Image style={styles.thumb} source={thumbnail}
			            defaultSource={require('../../modules/images/icons/default.jpg')} />
			            <Text style={[styles.rowText, , styles.defaultFont]}>
			              {name}
			            </Text>
					</View>
					<View style={[styles.subRightContainer, this.state.selected ? styles.selected :  styles.unselected]}>
						<View style={[styles.subRightBtnContainer, this.state.selected ? styles.selected :  styles.unselected]}>
							<TouchableNativeFeedback onPress={()=>{
									this.props._goToMap(data.recordID);
								}}
								background={TouchableNativeFeedback.Ripple('#CC39C4', true)}>
								<MaterialCommunityIcons name="map-marker-multiple" size={35} 
									style={[styles.mapButton]} />
							</TouchableNativeFeedback>
							<TouchableNativeFeedback onPress={()=>{
									this.props._stopSubscription(data);
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
					{this._renderSelection()}
	          	</View>
          	</TouchableHighlight>
		);
	}
}