import React, { Component } from 'react';
import { connect } from 'react-redux';
import {Text, View, TextInput, 
	ListView, Image, ScrollView, 
	TouchableOpacity,
	TouchableNativeFeedback,
	KeyboardAvoidingView,
	ToastAndroid} from 'react-native';
import Icon from 'react-native-vector-icons/Entypo';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import Octicons from 'react-native-vector-icons/Octicons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import styles from '../styles/style';
import {changeView, requestLocation, addToPublish} from '../actions/index';
import { VIEW_HOME, STATUS_PENDING, STATUS_APPROVED} from '../common/constants';
import {subscriptionRequest} from '../websocket-receiver';

class SearchBoxView extends Component {

	constructor(props) {
		super(props);
		this.state = { 
			text: '',
			behavior: 'padding' 
		};
		this._backHome = this._backHome.bind(this);
		this._renderRow = this._renderRow.bind(this);
		this._requestLocation = this._requestLocation.bind(this);
		this._publishLocation = this._publishLocation.bind(this);
	}

	componentWillMount() {
		let dataSource = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
		this.setState({dataSource:dataSource.cloneWithRows(this.props.contacts)});
	}

	onSegmentChange(segment) {
	    this.setState({...this.state, behavior: segment.toLowerCase()});
	};

	_backHome() {
		this.props.changeView(VIEW_HOME);
	}

	_requestLocation(data) {
		let from = this.props.myContact;
		let obj = {
			to: data.phno
		};
		subscriptionRequest(from, obj);
		data.status = STATUS_PENDING;
		ToastAndroid.showWithGravity('Location request sent!!', ToastAndroid.LONG, ToastAndroid.TOP);
		this.props.requestLocation(data);
	}
	_publishLocation(data) {
		data.status = STATUS_APPROVED;
		this.props.addToPublish(data);
	}

	_filterData(query) {
		let dataSource = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
		if (query === '') {
	      this.setState({...this.state, dataSource:dataSource.cloneWithRows(this.props.contacts)});
	    }
	    else {
	    	this.setState({...this.state, text:query});
			const { contacts } = this.props;
			const regex = new RegExp(`${query.trim()}`, 'i');
			let data = contacts.filter(contact => contact.searchName.search(regex) >= 0);
			this.setState({...this.state, dataSource:dataSource.cloneWithRows(data)});
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
				<TouchableNativeFeedback onPress={()=>{
						this._publishLocation(data);
					}}
					background={TouchableNativeFeedback.Ripple('#CC39C4', true)}>
					<View style={[styles.pubsubButtonContainer]}>
						<Octicons name="broadcast" size={30} 
							style={[styles.pubButton]} />
					</View>
				</TouchableNativeFeedback>
				<TouchableNativeFeedback onPress={()=>{
						this._requestLocation(data);
					}}
					background={TouchableNativeFeedback.Ripple('#CC39C4', true)}>
					<View style={[styles.pubsubButtonContainer]}>
						<Ionicons name="ios-wifi-outline" size={30} 
							style={[styles.subButton]} />
					</View>
				</TouchableNativeFeedback>
          	</View>
		);
	}

	render() {
		return(
			<View style={styles.searchBoxContainer}>
				<KeyboardAvoidingView style={styles.searchTextBox} behavior={this.state.behavior} >
					<TouchableNativeFeedback onPress={this._backHome}
					background={TouchableNativeFeedback.Ripple('#CC39C4', true)}>
						<View style={[styles.backContainer]}>
							<EvilIcons name="chevron-left" size={44} 
							style={[styles.searchBack]}/>
						</View>
					</TouchableNativeFeedback>
					<TextInput onChangeText={(text) => this._filterData(text)}
						underlineColorAndroid='rgba(0,0,0,0)'
        				placeholder='Search Contacts...'
        				style={[styles.TextInputStyle]} />
				</KeyboardAvoidingView>
				<View style={styles.searchResultContainer}>
					<ListView
			          dataSource={this.state.dataSource}
			          renderRow={this._renderRow}
			          renderSeparator={(sectionId, rowId) => <View style=
    {styles.separator} />}
			        />
				</View>
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