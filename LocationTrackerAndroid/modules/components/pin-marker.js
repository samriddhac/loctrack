import React, {Component} from 'react';
import {Image, Animated, Easing} from 'react-native';
import { createAnimatableComponent, View, Text } from 'react-native-animatable';
import * as Animatable from 'react-native-animatable';
import MapView from 'react-native-maps';
import Ionicons from 'react-native-vector-icons/Ionicons';
import styles from '../styles/style';

var markerAnimation = null;
export default class PinMarker extends Component {
	constructor(props) {
		super(props);
		this.spinValue = new Animated.Value(0);
		this.state = {
			initialRender: true,
			spinValue: new Animated.Value(0),
			rotation: 0
		};
		this.updateInitialRender = this.updateInitialRender.bind(this);
	}

	componentDidMount() {
		markerAnimation = setInterval(()=>{
			this.spin();
		}, 5000);
	}

	componentWillUnmount() {
		if (markerAnimation) {
			clearInterval(markerAnimation);
		}
	}

	spin() {
		this.refs.arrow.transitionTo({rotate: '90deg'});
		let newVal = this.state.rotation + 90
		this.setState({...this.state, rotation:newVal});
	}

	updateInitialRender() {
		let newState = {
			...this.state,
			initialRender: false
		};
		this.setState(newState);
	}

	render() {
		let imageSource = require('../images/icons/map-marker.png');
		let downArrowSource = require('../images/icons/blue-arrow.png');

		let thumbnail = require('../images/icons/default.jpg');
		if(this.props.marker.thumbnailPath!==undefined && this.props.marker.thumbnailPath!==null 
			&& this.props.marker.thumbnailPath!=='') {
			thumbnail = {uri:this.props.marker.thumbnailPath};
		}
		return (
			<MapView.Marker 
			coordinate={this.props.coordinate}
			identifier={this.props.identifier}
			key={this.props.key}
			>
				<View style={styles.markerContainer}>
					<Image source={imageSource} 
					style={styles.mapMarker}
					onLayout={this.updateInitialRender}
					key={`${this.state.initialRender}${this.props.marker.id}`}
					/>
					<View style={[styles.mapMarkerArrow ]}>
						<Ionicons name="md-arrow-dropdown" size={30} style={styles.markArrow}/>
					</View>
				</View>
				<MapView.Callout style={styles.plainView}>
	              <View>
	              	<View style={[styles.markerCalloutContainer]}>
						<Image style={styles.thumbCallout}
						source={thumbnail}/>
			            <View style={styles.rowTextCallout}>
				            <Text style={[styles.defaultFont]}>
				              {this.props.marker.name}
				            </Text>
				            <Text></Text>
			            </View>
					</View>
	              </View>
	            </MapView.Callout>
			</MapView.Marker>
		);
	}
}