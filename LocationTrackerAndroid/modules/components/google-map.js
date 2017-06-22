import React, {Component} from 'react';
import {View, 
	TouchableNativeFeedback,
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
const timeout = 4000;
let animationTimeout;

class GoogleMap extends Component {

	constructor(props) {
		super(props);
		this.state = {
			region: null,
			markars: []
		};
		this._goToHome = this._goToHome.bind(this);
		this.onRegionChange = this.onRegionChange.bind(this);
	}

	onRegionChange(region) {
	  this.setState({ region });
	}

	componentDidMount() {
		console.log('component mounted');
		this.mounted = true;
		if (Platform.OS === 'android') {
			PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION)
			.then(granted => {
			  if (granted && this.mounted) {
			  	navigator.geolocation.getCurrentPosition((pos)=>{
			  		let myPosition = {
				      	position: pos.coords,
				      	icon: '../../modules/images/icons/bluecircle.png'
				      };
			  		this.setState({ 
			        	region: {
			        		latitude: pos.coords.latitude,
				            longitude: pos.coords.longitude,
				            latitudeDelta: LATITUDE_DELTA,
				            longitudeDelta: LONGITUDE_DELTA,
			        	},
			        	markars: [...this.state.markars, myPosition]
			        });
			        this.watchLocation();
			  	});
			  }
			});
		} else {
			this.watchLocation();
		}
	}

	componentDidUpdate(){
		console.log('component updated');
		
	}

	watchLocation() {
	    this.watchID = navigator.geolocation.watchPosition((position) => {
	      let myLastPositionCoord = null;
	      if(this.state.myPosition!==undefined && this.state.myPosition!==null) {
	      	myLastPositionCoord = this.state.myPosition.position;
	      }
	      let myPosition = {
	      	position: position.coords,
	      	icon: '../../modules/images/icons/bluecircle.png',
	      	name: 'Me'
	      };
	      if (!isEqual(myPosition.position, myLastPositionCoord)) {
	        this.setState({ 
	        	...this.state,
	        	markars: [...this.state.markars, myPosition]
	        });
	      }
	    }, (err)=>{
	    	console.log('[ERROR]: Geolocation error ',err);
	    }, null);
	}

	componentWillReceiveProps(nextprops) {
		console.log('Component will receive props');
		this.addMarkers(nextprops);
	}
	componentWillUnmount() {
		console.log('component unmounted');
		this.mounted = false;
		if (this.watchID) navigator.geolocation.clearWatch(this.watchID);
		if (animationTimeout) {
			clearTimeout(animationTimeout);
		}
	}

	addMarkers(props) {
		if(props.subscribedTo!==undefined && props.subscribedTo!==null
			&& props.subscribedTo.length>0){
			let markerArray = [];
			props.subscribedTo.forEach((item)=>{
				if(item!==undefined && item!==null
					&& item.loc!==undefined && item.loc!==null) {
					let m = {
						position: item.loc,
						icon: '../../modules/images/icons/bluecircle.png',
						color: 'blue',
						name: item.givenName
					};
					markerArray = [m, ...markerArray];
					console.log('markerArray ',markerArray);
					this.setState({ 
			        	...this.state,
			        	markars: [...this.state.markars, ...markerArray]
			        });
				}
			});
		}
		console.log('this.state.markers ',this.state.markers);
		if(this.state.markers!==undefined
			&& this.state.markers!==null
			&& this.state.markers.length>0) {
			animationTimeout = setTimeout(() => {
		      this.focusMap([...this.state.markers], false);
			}, timeout);
		}
	}

	_goToHome() {
		this.props.changeView(VIEW_HOME);
	}

	focusMap(markers, animated) {
	    console.log(`Markers received to populate map: ${markers}`);
	    this.map.fitToSuppliedMarkers(markers, animated);
	}

	render() {
		if(this.state.region === undefined) {
			return (
				<View style={[styles.loaderContainer]}>
					<Image source={require('../../modules/images/icons/loader.gif')} />
				</View>
			);
		}
		else {
			return(
				<View style={[styles.mapContainer]}>
					<MapView
					ref={ref => { this.map = ref; }}
					style={styles.map}
					region={this.state.region}
					loadingEnabled
			        loadingIndicatorColor="#666666"
					loadingBackgroundColor="#eeeeee"
					>
						{this.state.markars.map((marker, i) => (
						<MapView.Marker
						  key={i}
						  coordinate={marker.position}
						  pinColor={marker.color}
						>
							<MapView.Callout style={styles.plainView}>
				              <View>
				                <Text>{marker.name}</Text>
				              </View>
				            </MapView.Callout>
						</MapView.Marker>
						))}
					</MapView>
				    <View style={[styles.mapButtonContainer]}>
						<TouchableNativeFeedback onPress={()=>{
								this._goToHome();
							}}
							background={TouchableNativeFeedback.Ripple('#CC39C4', true)}>
							<Ionicons name="ios-arrow-back" size={40} 
									style={[styles.mapBackButton]} />
						</TouchableNativeFeedback>
					</View>
			    </View>
			);
		}
	}
}
function mapStateToProps(state){
	return {
		subscribedTo: state.contactState.subscribedTo
	};
}
export default connect(mapStateToProps, {changeView})(GoogleMap);