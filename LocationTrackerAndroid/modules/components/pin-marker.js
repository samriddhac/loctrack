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
		this.state = {
			initialRender: true,
			rotation: 0,
			rotateDeg: '0deg'
		};
		this.updateInitialRender = this.updateInitialRender.bind(this);
	}

	componentDidMount() {
		markerAnimation = setInterval(()=>{			
			let animation = requestAnimationFrame(this.spin.bind(this));
		}, 10000);
	}

	componentWillUnmount() {
		if (markerAnimation) {
			clearInterval(markerAnimation);
		}
	}

	spin() {
		let currentRotation = this.state.rotation;
		if(currentRotation<40) {
			currentRotation = currentRotation + 10;
		}
		else if(currentRotation>=40) {
			currentRotation = 0;
		}
		this.setState({...this.state, 
			rotation:currentRotation,
			rotateDeg:currentRotation+'deg'
		});
	}

	getRotateStyle() {
		return {
			transform: [
				{
					rotate: this.state.rotateDeg
				}
			]
		};
	}

	updateInitialRender() {
		let newState = {
			...this.state,
			initialRender: false
		};
		this.setState(newState);
	}

	render() {
		let imageSource = require('../images/icons/map-marker-me.png');
		let arrowStyle = {
			color: '#CC1D23'
		};
		if(this.props.marker.id !== -1) {
			imageSource = require('../images/icons/map-marker.png');
			arrowStyle = {
				color: '#4A44F2'
			};
		}
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
					onLoad={()=>{this.forceUpdate()}}
					key={`${this.state.initialRender}${this.props.marker.id}`}
					>
						<Text style={{width:0, height:0}}>{Math.random()}</Text>
					</Image>
					<View style={[styles.mapMarkerArrow, this.getRotateStyle() ]}>
						<Ionicons name="md-arrow-dropdown" size={30} style={arrowStyle}/>
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