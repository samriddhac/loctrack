import React, {Component} from 'react';
import {Image, Animated} from 'react-native';
import { createAnimatableComponent, View, Text } from 'react-native-animatable';
import MapView from 'react-native-maps';
import styles from '../styles/style';

export default class PinMarker extends Component {
	constructor(props) {
		super(props);
		this.state = {
			initialRender: true,
			initialThumbRender: true,
			initialArrowRender: true
		};

		this.updateInitialRender = this.updateInitialRender.bind(this);
		this.updateInitialThumbRender = this.updateInitialThumbRender.bind(this);
		this.updateInitialRenderArrow = this.updateInitialRenderArrow.bind(this);
	}

	componentDidMount() {
		
	}

	updateInitialRender() {
		let newState = {
			...this.state,
			initialRender: false
		};
		this.setState(newState);
	}

	updateInitialThumbRender() {
		let newState = {
			...this.state,
			initialThumbRender: false
		};
		this.setState(newState);
		this.forceUpdate();
	}

	updateInitialRenderArrow() {
		let newState = {
			...this.state,
			initialArrowRender: false
		};
		this.setState(newState);
	}
	onMarkerSelect() {
		this.updateInitialThumbRender();
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
					<Image source={downArrowSource} 
					style={styles.mapMarkerArrow}
					onLayout={this.updateInitialRenderArrow}
					key={`${this.state.initialArrowRender}${this.props.marker.id}arrow`}
					/>
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