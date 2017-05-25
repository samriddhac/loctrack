import React, {Component} from 'react';
import {View, TouchableOpacity, Text} from 'react-native';
import {connect} from 'react-redux';
import MapView from 'react-native-maps';
import Ionicons from 'react-native-vector-icons/Ionicons';
import styles from '../styles/style';
import { VIEW_HOME } from '../common/constants';
import {changeView} from '../actions/index';

class GoogleMap extends Component {

	constructor(props) {
		super(props);
		this.state = {
			region: {
		      latitude: 37.78825,
		      longitude: -122.4324,
		      latitudeDelta: 0.0922,
		      longitudeDelta: 0.0421,
		    }
		};
		this._goToHome = this._goToHome.bind(this);
		this.onRegionChange = this.onRegionChange.bind(this);
	}

	onRegionChange(region) {
	  this.setState({ region });
	}

	_goToHome() {
		this.props.changeView(VIEW_HOME);
	}

	render() {
		return(
			<View style={[styles.mapContainer]}>
				<MapView style={[styles.map]}
			      region={this.state.region}
			      onRegionChange={this.onRegionChange}
			    />
			    <View style={[styles.mapButtonContainer]}>
					<TouchableOpacity onPress={()=>{
							this._goToHome();
						}}>
						<Ionicons name="ios-arrow-back" size={40} 
								style={[styles.mapBackButton]} />
					</TouchableOpacity>
				</View>
		    </View>
		);
	}
}
function mapStateToProps(state){
	return {
		subscribedTo: state.contactState.subscribedTo
	};
}
export default connect(mapStateToProps, {changeView})(GoogleMap);