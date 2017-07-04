import React, {Component} from 'react';
import {
	TouchableNativeFeedback,
	Image,
	PermissionsAndroid,
	Platform,
  	Dimensions} from 'react-native';
import {connect} from 'react-redux';
import MapView from 'react-native-maps';
import isEqual from 'lodash/isEqual';
import _ from 'lodash';
import Ionicons from 'react-native-vector-icons/Ionicons';
import styles from '../styles/style';
import { VIEW_HOME, ALL_FRIEND, STATUS_APPROVED, STATUS_LIVE } from '../common/constants';
import {changeView} from '../actions/index';
import myLocIcon from '../images/icons/bluecircle.png';
import { createAnimatableComponent, View, Text } from 'react-native-animatable';

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
	}

	componentDidMount() {
		this.mounted = true;
		if (Platform.OS === 'android') {
			PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION)
			.then(granted => {
			  if (granted && this.mounted) {
			  	navigator.geolocation.getCurrentPosition((pos)=>{
			  		let myPosition = {
			  			id:-1,
				      	position: pos.coords,
	      				name: 'Me'
				      };
				    _.remove(this.state.markars, {id:-1});  
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

	componentDidUpdate(){}

	watchLocation() {
	    this.watchID = navigator.geolocation.watchPosition((position) => {
	      let myLastPositionCoord = null;
	      if(this.state.myPosition!==undefined && this.state.myPosition!==null) {
	      	myLastPositionCoord = this.state.myPosition.position;
	      }
	      let myPosition = {
	      	id:-1,
	      	position: position.coords,
	      	name: 'Me'
	      };
	      if (!isEqual(myPosition.position, myLastPositionCoord)) {
	      	_.remove(this.state.markars, {id:-1});
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
		this.addMarkers(nextprops);
	}
	componentWillUnmount() {
		this.mounted = false;
		if (this.watchID) navigator.geolocation.clearWatch(this.watchID);
		if (animationTimeout) {
			clearTimeout(animationTimeout);
		}
	}

	addMarkers(props) {
		let markerArray = [];
		if(props.subscribedTo!==undefined && props.subscribedTo!==null
			&& props.subscribedTo.length>0){
			if(props.selected === ALL_FRIEND) {
				props.subscribedTo.forEach((item)=>{
					if(item!==undefined && item!==null
						&& item.loc!==undefined && item.loc!==null) {
						let m = {
							id: item.recordID,
							position: item.loc,
							color: 'blue',
							name: item.givenName
						};
						markerArray = [m, ...markerArray];
					}
				});
				let me = _.find(this.state.markars, {id: -1});
				if(me!==undefined && me!==null) {
					markerArray = [me, ...markerArray];
				}
				this.setState({ 
		        	...this.state,
		        	markars: [...markerArray]
		        });
			}
			else if(props.selected>=0) {
				let obj = _.find(props.subscribedTo, {recordID: props.selected});
				if(obj!==undefined && obj!==null && obj.status===STATUS_LIVE
					&& obj.loc!==undefined && obj.loc!==null) {
					let m = {
						id: obj.recordID,
						position: obj.loc,
						color: 'blue',
						name: obj.givenName
					};
					markerArray = [m, ...markerArray];
					let region = {
		        		latitude: obj.loc.latitude,
			            longitude: obj.loc.longitude,
			            latitudeDelta: LATITUDE_DELTA,
			            longitudeDelta: LONGITUDE_DELTA,
		        	};
					this.setState({ 
			        	region:region,
			        	markars: [...markerArray]
			        });
			        this.map.animateToRegion(region, timeout);
				}
			}
		}
		if(markerArray!==undefined
			&& markerArray!==null
			&& markerArray.length>0) {
			if(props.selected === ALL_FRIEND) {
				let markerIDs = [];
				markerArray.forEach((item)=>{
					markerIDs.push(item.id.toString());
				});
				animationTimeout = setTimeout(() => {
			      this.focusMap(markerIDs, true);
				}, timeout);
			}
		}
	}

	_goToHome() {
		this.props.changeView(VIEW_HOME);
	}

	focusMap(markers, animated) {
	    console.log('Markers received to populate map: ', markers);
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
				<View animation="fadeInRight" delay={100} style={[styles.mapContainer]}>
					<MapView
					ref={ref => { this.map = ref; }}
					style={styles.map}
					region={this.state.region}
					onRegionChangeComplete={(region)=>{this.onRegionChange(region);}}
					loadingEnabled
			        loadingIndicatorColor="#666666"
					loadingBackgroundColor="#eeeeee"
					>
						{this.state.markars.map((marker, i) => (
						<MapView.Marker
						  key={marker.id}
						  identifier={marker.id.toString()}
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
							<View>
							<Ionicons name="ios-arrow-back" size={45} 
									style={[styles.mapBackButton]} />
							</View>
						</TouchableNativeFeedback>
					</View>
			    </View>
			);
		}
	}
}
function mapStateToProps(state){
	return {
		subscribedTo: state.contactState.subscribedTo,
		selected: state.contactState.selectedRecord
	};
}
export default connect(mapStateToProps, {changeView})(GoogleMap);