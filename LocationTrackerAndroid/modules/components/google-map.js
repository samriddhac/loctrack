import React, {Component} from 'react';
import {View, 
	TouchableOpacity,
	Image,
	Text,
	PermissionsAndroid,
	Platform,
  	Dimensions} from 'react-native';
import {connect} from 'react-redux';
import MapView from 'react-native-maps';
import isEqual from 'lodash/isEqual';
import Ionicons from 'react-native-vector-icons/Ionicons';
import styles from '../styles/style';
import { VIEW_HOME } from '../common/constants';
import {changeView} from '../actions/index';
import myLocIcon from '../images/icons/bluecircle.png';

const GEOLOCATION_OPTIONS = { enableHighAccuracy: true };
const ANCHOR = { x: 0.5, y: 0.5 };
const colorOfmyLocationMapMarker = 'blue';
const { width, height } = Dimensions.get('window');

const defaultProps = {
  enableHack: false,
  geolocationOptions: GEOLOCATION_OPTIONS,
};
const ASPECT_RATIO = width / height;
const LATITUDE = 37.78825;
const LONGITUDE = -122.4324;
const LATITUDE_DELTA = 0.03;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;
const SPACE = 0.01;

class GoogleMap extends Component {

	constructor(props) {
		super(props);
		this.state = {
			region: {
				latitude: LATITUDE,
	            longitude: LONGITUDE,
	            latitudeDelta: LATITUDE_DELTA,
	            longitudeDelta: LONGITUDE_DELTA
			},
			markars: []
		};
		this._goToHome = this._goToHome.bind(this);
		this.onRegionChange = this.onRegionChange.bind(this);
	}

	onRegionChange(region) {
	  this.setState({ region });
	}

	componentDidMount() {
		this.mounted = true;
		if (Platform.OS === 'android') {
			PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION)
			.then(granted => {
			  if (granted && this.mounted) this.watchLocation();
			});
		} else {
			this.watchLocation();
		}
	}

	watchLocation() {
	    this.watchID = navigator.geolocation.watchPosition((position) => {
	      const myLastPosition = this.state.myPosition;
	      const myPosition = {
	      	position: position.coords,
	      	icon: '../../modules/images/icons/bluecircle.png'
	      };
	      if (!isEqual(myPosition, myLastPosition)) {
	        this.setState({ 
	        	region: {
	        		latitude: myPosition.position.latitude,
		            longitude: myPosition.position.longitude,
		            latitudeDelta: LATITUDE_DELTA,
		            longitudeDelta: LONGITUDE_DELTA,
	        	},
	        	markars: [...this.state.markars, myPosition]
	        });
	      }
	    }, (err)=>{
	    	console.log('[ERROR]: Geolocation error ',err);
	    }, null);
	}
	componentWillUnmount() {
		this.mounted = false;
		if (this.watchID) navigator.geolocation.clearWatch(this.watchID);
	}

	_goToHome() {
		this.props.changeView(VIEW_HOME);
	}

	render() {
		return(
			<View style={[styles.mapContainer]}>
				<MapView
				ref={ref => { this.map = ref; }}
				style={styles.map}
				region={this.state.region}
				>
					{this.state.markars.map((marker, i) => (
					<MapView.Marker
					  key={i}
					  coordinate={marker.position}
					>
					</MapView.Marker>
					))}
				</MapView>
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