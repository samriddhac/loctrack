import React, { Component } from 'react';
import {TextInput, TouchableHighlight, 
	TouchableNativeFeedback, TouchableOpacity, ListView, Image} from 'react-native';
import { TabViewAnimated, TabBar, SceneMap } from 'react-native-tab-view';
import {connect} from 'react-redux';
import styles from '../styles/style';
import Header from './header';
import SubscribeList from './subscribe-list';
import PublishList from './publish-list';
import { createAnimatableComponent, View, Text } from 'react-native-animatable';

class Home extends Component {

	constructor(props) {
		super(props);
		this.state = {
		    index: 0,
		    routes: [
		      { key: '1', title: 'My subscriptions' },
		      { key: '2', title: 'My subcribers' },
		    ]
		  };
	}

	_handleChangeTab = index => this.setState({ index });
	_renderHeader = props => <TabBar  style={{ backgroundColor: '#6918CC' }} />;

	_renderScene = SceneMap({
		'1': SubscribeList,
		'2': PublishList
	});
	
	render() {
		return (
		<View animation="zoomInRight" delay={3000} style={styles.homeContainer}>
			<View style={styles.header}>
				<Header/>
			</View>
			<TabViewAnimated
		        style={styles.content}
		        navigationState={this.state}
		        renderScene={this._renderScene}
		        renderHeader={this._renderHeader}
		        onRequestChangeTab={this._handleChangeTab}
		      />
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
export default connect(mapStateToProps)(Home);