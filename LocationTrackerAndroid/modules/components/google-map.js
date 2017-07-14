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
import myLocIcon from '../images/icons/map-marker.png';
import { createAnimatableComponent, View, Text } from 'react-native-animatable';
import PinMarker from './pin-marker';

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
			markars: [],
			radius:0
		};
		this.latDelta = LATITUDE_DELTA;
		this.longDelta = LONGITUDE_DELTA;
		this._goToHome = this._goToHome.bind(this);
		this.onRegionChange = this.onRegionChange.bind(this);
	}

	onRegionChange(region) {
		this.latDelta = region.latitudeDelta;
		this.longDelta = region.longitudeDelta;
	}

	componentDidMount() {
		this.mounted = true;
		if (Platform.OS === 'android') {
			PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION)
			.then(granted => {
			  if (granted && this.mounted) {
			  	navigator.geolocation.getCurrentPosition((pos)=>{
			  		this.setState({ 
			        	region: {
			        		latitude: pos.coords.latitude,
				            longitude: pos.coords.longitude,
				            latitudeDelta: this.latDelta,
				            longitudeDelta: this.longDelta,
			        	},
			        	markars: []
			        });
			       	if(this.props.selected === ALL_FRIEND) {
			       		let myPosition = {
				  			id:-1,
					      	position: pos.coords,
		      				name: 'Me',
		      				image: '../images/icons/map-marker-me.png'
					      };
					    _.remove(this.state.markars, {id:-1});  
					    this.setState({ 
				        	...this.state,
				        	markars: [...this.state.markars, myPosition]
				        });
				        this.watchLocation();
			       	}
			       	else {
			       		this.addMarkers(this.props);
			       	}
			  	});
			  }
			});
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
	      	name: 'Me',
		    image: '../images/icons/map-marker-me.png'
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
		      				image: '../images/icons/map-marker.png',
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
						image: '../images/icons/map-marker.png',
						name: obj.givenName
					};
					markerArray = [m, ...markerArray];
					let region = {
		        		latitude: obj.loc.latitude,
			            longitude: obj.loc.longitude,
			            latitudeDelta: this.latDelta,
				        longitudeDelta: this.longDelta,
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

	onDrag(coord, pos) {}

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
					onPanDrag={(coord, pos)=>{this.onDrag(coord, pos)}}
					loadingEnabled
			        loadingIndicatorColor="#666666"
					loadingBackgroundColor="#eeeeee"
					>
						{this.state.markars.map((marker, i) => (
							<MapView.Circle
					            center={marker.position}
					            radius={100}
					            fillColor="rgba(74,68,242, 0.2)"
					            strokeColor="rgba(74,68,242,0.2)"
					            zIndex={1}
					            strokeWidth={1}
					          />
						))}
						{this.state.markars.map((marker, i) => (
						<PinMarker
						  key={marker.id}
						  identifier={marker.id.toString()}
						  coordinate={marker.position}
						  marker={marker}
						/>
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