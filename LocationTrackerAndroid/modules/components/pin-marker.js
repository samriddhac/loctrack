import React, {Component} from 'react';
import {Image, Animated, Easing} from 'react-native';
import { createAnimatableComponent, View, Text } from 'react-native-animatable';
import MapView from 'react-native-maps';
import Ionicons from 'react-native-vector-icons/Ionicons';
import styles from '../styles/style';

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
		this.spin();
	}

	spin() {
		this.spinValue.setValue(0);
		Animated.timing(
		  this.spinValue,
		  {
		    toValue: 1,
		    duration: 1500,
		    easing: Easing.linear
		  }
		).start(() => {
		    console.log('spinned');
		});
	}

	updateInitialRender() {
		let newState = {
			...this.state,
			initialRender: false
		};
		this.setState(newState);
	}

	render() {
		const spin = this.state.spinValue.interpolate({
		  inputRange: [0, 1],
		  outputRange: ['90deg', '180deg']
		});
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
					<Animated.View style={[styles.mapMarkerArrow, {transform: [{rotate: spin}]}]}>
						<Ionicons name="md-arrow-dropdown" size={30} style={styles.markArrow}/>
					</Animated.View>
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