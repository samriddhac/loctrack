import React, { Component } from 'react';
import { connect } from 'react-redux';
import {Text, View, TextInput, 
	ListView, Image, ScrollView, 
	TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/Entypo';
import styles from '../styles/style';
import {changeView, requestLocation} from '../actions/index';
import { VIEW_HOME } from '../common/constants';

class SearchBoxView extends Component {

	constructor(props) {
		super(props);
		this.state = { text: 'Search Contacts...' };
		this._backHome = this._backHome.bind(this);
		this._requestLocation = this._requestLocation.bind(this);
	}

	componentWillMount() {
		let dataSource = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
		this.setState({dataSource:dataSource.cloneWithRows(this.props.contacts)});
	}

	_backHome() {
		console.log('calling back');
		this.props.changeView(VIEW_HOME);
	}

	_requestLocation(data) {
		console.log('calling ',data);
		this.props.requestLocation(data);
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
				<TouchableOpacity>
					<View style={[styles.addButton]} onPress={(e)=>{
						console.log(e);
						this._requestLocation(data);
					}}>
						<Text style={[styles.addBtnText]}>+</Text>
					</View>
				</TouchableOpacity>
          	</View>
		);
	}

	render() {
		return(
			<View style={styles.searchBoxContainer}>
				<View style={styles.searchTextBox}>
					<Icon name="arrow-left" size={40} 
						style={[styles.searchBack]} onPress={this._backHome}/>
					<TextInput onChangeText={(text) => this.setState({text})}
        value={this.state.text} style={[styles.TextInputStyle, styles.defaultFont]} />
				</View>
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
	return { contacts: state.contactState.contacts};
}
export default connect(mapStateToProps, {changeView, requestLocation})(SearchBoxView);