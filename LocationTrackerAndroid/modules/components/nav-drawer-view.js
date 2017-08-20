import React, { Component } from 'react';
import {View, 
	Text, 
	Image,
	TouchableHighlight,
	FlatList} from 'react-native';
import { connect } from 'react-redux';
import _ from 'lodash';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import styles from '../styles/style';
import {changeView, addToMap} from '../actions/index';
import { VIEW_HOME, VIEW_SEARCH_BOX, ME,
	STATUS_PENDING, STATUS_LIVE  } from '../common/constants';

class NavDrawerView extends Component {

	constructor(props) {
		super(props);

		this.state = {
			option_3_count: 0,
			option_4_count: 0,
			option_5_count: 0,
			option_6_count: 0
		};

		this._renderRow = this._renderRow.bind(this);
		this._onPressRow = this._onPressRow.bind(this);
	}

	componentWillMount(){
		this.setCountState(this.props);
	}

	componentWillReceiveProps(nextProps) {
		this.setCountState(nextProps);
	}

	setCountState(props) {
		let option_3_count = props.selectedReceiver.length;
		let option_4_count = this._filterByStatus(props.subscribedTo, STATUS_LIVE).length;
		let option_5_count = this._filterByStatus(props.subscribedTo, STATUS_PENDING).length;
		let option_6_count = this._filterByStatus(props.publishingTo, STATUS_PENDING).length;
		this.setState({
			option_3_count,
			option_4_count,
			option_5_count,
			option_6_count
		});
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

	_onPressRow(id) {
		try {
			switch(id) {
				case 0:
					this.props.closeNav();
					this.props.addToMap(ME);
					this.props.changeView({id:VIEW_HOME, options:{optionId: id}});
					break;
				case 1:
					this.props.closeNav();
					this.props.changeView({id:VIEW_SEARCH_BOX, options:{optionId: id}});
					break;
				case 2:
					this.props.closeNav();
					this.props.changeView({id:VIEW_SEARCH_BOX, options:{optionId: id}});
					break;
				case 3:
					this.props.closeNav();
					this.props.changeView({id:VIEW_SEARCH_BOX, options:{optionId: id}});
					break;
				case 4:
					this.props.closeNav();
					this.props.changeView({id:VIEW_SEARCH_BOX, options:{optionId: id}});
					break;
				case 5:
					this.props.closeNav();
					this.props.changeView({id:VIEW_SEARCH_BOX, options:{optionId: id}});
					break;
				case 6:
					this.props.closeNav();
					this.props.changeView({id:VIEW_SEARCH_BOX, options:{optionId: id}});
					break;
			}
		}
		catch(e) {
			console.log(e);
		}
	}
	_renderRow(record) {
		let data = record.item;
		return(
			<TouchableHighlight onPress={() => {this._onPressRow(data.id);}} 
			underlayColor='#4b45f2'>
				<View style={[styles.row]}>
					<View style={[styles.navItemContainer]}>
						<MaterialCommunityIcons name={data.icon} size={25} 
							style={[styles.navRowIcon]} />
			            <View style={styles.rowText}>
				            <Text style={[styles.defaultFont]}>
				              {data.label}
				            </Text>
			            </View>
					</View>
	          	</View>
          	</TouchableHighlight>
		);
	}

	render() {
		let thumbnail = require('../../modules/images/icons/default.jpg');
		let drawerOption = [
			{ 
				id: 0,
				key: 0,
				label: 'My Location',
				icon: 'home-map-marker'
			},
			{ 
				id: 1,
				key: 1,
				label: 'Request Location',
				icon: 'share'
			},
			{ 
				id: 2,
				key: 2,
				label: 'Share Location',
				icon: 'share-variant'
			},
			{ 
				id: 3,
				key: 3,
				label: 'My Recipients',
				icon: 'human-handsdown'
			},
			{ 
				id: 4,
				key: 4,
				label: 'Location Sharers',
				icon: 'human-handsup'
			},
			{ 
				id: 5,
				key: 5,
				label: 'My Pending Requests',
				icon: 'human-greeting'
			},
			{ 
				id: 6,
				key: 6,
				label: 'My Pending Approvals',
				icon: 'account-plus'
			}
		];

		return (
			<View style={styles.navContainer}>
				<View style={styles.navHeader}>
					<Image style={styles.navThumb} source={thumbnail}
			            defaultSource={require('../../modules/images/icons/default.jpg')} />
			    	<View style={styles.navTextContainer}>
			    		<Text style= {styles.navNameText}>Me</Text>
			    		<Text style= {styles.navNoText}>{this.props.myContact}</Text>
			    	</View>
				</View>
				<View style={styles.navListContainer}>
					<FlatList
			          data={drawerOption}
			          renderItem={this._renderRow}
			          pagingEnabled={true}
			        />
				</View>
			</View>
		);
	}
}
function mapStateToProps(state) {
	let sub = [];
	let pub = [];
	if(state.contactState!==undefined && state.contactState!==null
		&& state.contactState.subscribedTo!==undefined 
		&& state.contactState.subscribedTo!==null) {
		sub = state.contactState.subscribedTo;
	}
	if(state.contactState!==undefined && state.contactState!==null
		&& state.contactState.publishedTo!==undefined 
		&& state.contactState.publishedTo!==null) {
		pub = state.contactState.publishedTo;
	}
	return {
		subscribedTo: sub,
		publishedTo: pub,
		myContact: state.contactState.myContact,
		selectedReceiver: state.contactState.selectedReceiver
	};
}
export default connect(mapStateToProps, {changeView, addToMap})(NavDrawerView);
