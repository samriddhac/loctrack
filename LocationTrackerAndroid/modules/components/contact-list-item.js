import React from 'react';
import {Image,
	View, 
	Text,
	TouchableHighlight} from 'react-native';
import _ from 'lodash';
import styles from '../styles/style';

export default class ContactListItem extends React.PureComponent {

	constructor(props) {
		super(props);
		this.state = {
			selected: false
		};
	}

	_onPressRow() {
		let data = this.props.data;
		if(this.state.selected === true) {
			data.selected = false;
		}
		else {
			data.selected = true;
		}
		this.setState({ selected: data.selected });
		this.props._onRowPressed(data);
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
	          	</View>
          	</TouchableHighlight>
		);
	}
}