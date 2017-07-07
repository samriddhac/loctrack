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
import { getPendingCount } from '../utils/utilities';

class Home extends Component {

	constructor(props) {
		super(props);
		this.state = {
		    index: 0,
		    routes: [
		      { key: '1', title: 'My Subscriptions' },
		      { key: '2', title: 'My Subcribers' },
		    ],
		    pCount: getPendingCount(props.publishTo)
		  };
	}
	componentWillReceiveProps(nextProps){
		this.setState({pCount:getPendingCount(nextProps.publishTo)});
	}
	_handleChangeTab = index => this.setState({ index });
	_renderHeader = props => <TabBar {...props} style={styles.tabBarContent}
		indicatorStyle={styles.indicatorStyle}
		labelStyle={styles.labelStyle} 
		getLabelText={(scene)=>{
			let title = scene.route.title ? scene.route.title : null;
			if(scene.route.key === '2') {
				if(this.state.pCount>0) {
					title = title +' ('+this.state.pCount+')';
				}
			}
			return title;
		}}/>;

	_renderScene = SceneMap({
		'1': SubscribeList,
		'2': PublishList
	});
	
	render() {
		return (
		<View animation="fadeInRight" delay={100} style={styles.homeContainer}>
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
		publishTo: state.contactState.publishingTo,
		myContact: state.contactState.myContact
	};
}
export default connect(mapStateToProps)(Home);