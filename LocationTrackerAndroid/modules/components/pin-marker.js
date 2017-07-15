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
			initialThumbRender: true
		};
	}

	componentDidMount() {
		
	}

	render() {
		let imageSource = require('../images/icons/map-marker.png');
		
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
				<View>
					<Image source={imageSource} 
					style={styles.mapMarker}
					onLayout={() => this.setState({ initialRender: false })}
					/>
				</View>
				<MapView.Callout style={styles.plainView}>
	              <View>
	              	<View style={[styles.markerCalloutContainer]}>
						<Image style={styles.thumbCallout} 
						onLayout={() => this.setState({...this.state, initialThumbRender: false })}
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