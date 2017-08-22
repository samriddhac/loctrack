import React from 'react';
import {Image,
	View, 
	Text,
	TouchableHighlight,
	TouchableNativeFeedback} from 'react-native';
import _ from 'lodash';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { STATUS_PENDING, 
	STATUS_LIVE} from '../common/constants';
import styles from '../styles/style';
import { getStatus } from '../utils/utilities';

export default class ContactListItem extends React.PureComponent {

	constructor(props) {
		super(props);
		this.state = {
			selected: false
		};

		this._renderMap = this._renderMap.bind(this);
	}

	_onPressRow() {
		let data = this.props.data.item;
		if(this.state.selected === true) {
			data.selected = false;
			if(this.props.options.optionId==2 ||
				this.props.options.optionId==6) {
				this.props._removeSelectedReceiver(data.phno);
			}
		}
		else {
			data.selected = true;
			if(this.props.options.optionId==2 ||
				this.props.options.optionId==6) {
				this.props._addToSelectedReceiver(data.phno);
			}
		}
		this.setState({ selected: data.selected });
		this.props._onRowPressed(data);
	}
	_renderMap() {
		let data = this.props.data.item;
		if(this.props.options.optionId==1 ||
				this.props.options.optionId==4 ||
				this.props.options.optionId==5) {
			if (data.status == STATUS_LIVE) {
				return (
					<View style={[styles.subRightContainer, this.state.selected ? styles.selected :  styles.unselected]}>
						<View style={[styles.subRightBtnContainer, this.state.selected ? styles.selected :  styles.unselected]}>
							<TouchableNativeFeedback onPress={()=>{
									this.props._goToMap(data.recordID);
								}}
								background={TouchableNativeFeedback.Ripple('#CC39C4', true)}>
								<MaterialCommunityIcons name="map-marker-multiple" size={35} 
									style={[styles.mapButton]} />
							</TouchableNativeFeedback>
						</View>
						<View style={styles.statusContainer}>
							<Text style={styles.statusTextContainer}>{getStatus(data.status)}</Text>
						</View>
					</View>
				);
			}
			else {
				let status = getStatus(data.status);
				if(status!==undefined && status!==null & status!=='') {
					return(
						<View style={[styles.subRightContainer, this.state.selected ? styles.selected :  styles.unselected]}>
							<View style={[styles.subRightBtnContainer, this.state.selected ? styles.selected :  styles.unselected]}>
								<View style={styles.statusContainer}>
									<Text style={styles.statusTextContainer}>{getStatus(data.status)}</Text>
								</View>
							</View>
						</View>
					);
				}
				else {
					return null;
				}
			}
		}
		return null;
	}

	render() {
		let data = this.props.data.item;
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
		return (
			<TouchableHighlight onPress={() => {this._onPressRow();}} 
			underlayColor='#d6d5f2'>
				<View style={[styles.row, this.state.selected ? styles.selected :  styles.unselected]}>
					<View style={[styles.contactContainer]}>
						<Image style={styles.thumb} source={thumbnail}
			            defaultSource={require('../../modules/images/icons/default.jpg')} />
			            <View style={styles.rowText}>
				            <Text style={[styles.defaultFont]}>
				              {name}
				            </Text>
				            <Text>{data.origNo}</Text>
			            </View>
					</View>
					{this._renderMap()}
	          	</View>
          	</TouchableHighlight>
		);
	}
}