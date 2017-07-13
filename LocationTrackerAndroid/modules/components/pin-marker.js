import React, {Component} from 'react';
import {Image} from 'react-native';
import { createAnimatableComponent, View, Text } from 'react-native-animatable';
import MapView from 'react-native-maps';
import styles from '../styles/style';

export default class PinMarker extends Component {
	constructor(props) {
		super(props);
		this.state = {
			initialRender: true
		};
	}
	
	render() {
		
		return (
			<MapView.Marker 
			coordinate={this.props.coordinate}
			identifier={this.props.identifier}
			key={this.props.key}
			>
				<View>
					<Image source={require('../images/icons/map-marker.png')} 
					style={styles.mapMarker}
					onLayout={() => this.setState({ initialRender: false })}
          			key={`${this.state.initialRender}`}
					/>
				</View>
				<MapView.Callout style={styles.plainView}>
	              <View>
	                <Text>{this.props.marker.name}</Text>
	              </View>
	            </MapView.Callout>
			</MapView.Marker>
		);
	}
}