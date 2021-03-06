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
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import styles from '../styles/style';
import { VIEW_HOME, ALL_FRIEND, ME, STATUS_APPROVED, STATUS_LIVE,
	WELCOME_SPEECH, CLOSE_SPEECH } from '../common/constants';
import myLocIcon from '../images/icons/map-marker.png';
import { createAnimatableComponent, View, Text } from 'react-native-animatable';
import PinMarker from './pin-marker';
import {speak, stopSpeaking} from '../tts-handler';
import {getAddress} from '../geocoder-receiver';
import {getRoute} from '../geo-direction';

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
const distnce_timeout = 2000;
let animationTimeout;

class GoogleMapView extends Component {

	constructor(props) {
		super(props);
		this.state = {
			region: null,
			markars: [],
			radius:0,
			ttsEnabled: false,
			myAddress: '',
			selAddress: '',
			showRoute: false,
			routes: []
		};
		this.latDelta = LATITUDE_DELTA;
		this.longDelta = LONGITUDE_DELTA;
		this.onRegionChange = this.onRegionChange.bind(this);
		this._renderBottomBar = this._renderBottomBar.bind(this);
		this._getStrokeColor = this._getStrokeColor.bind(this);
		this._renderTime = this._renderTime.bind(this);
		this._renderSpeak = this._renderSpeak.bind(this);
		this._enableSpeech = this._enableSpeech.bind(this);
		this._disableSpeech = this._disableSpeech.bind(this);
		this._renderAddress = this._renderAddress.bind(this);
		this._renderRoute = this._renderRoute.bind(this);
		this._enableRoute = this._enableRoute.bind(this);
		this._disableRoute = this._disableRoute.bind(this);
		this._renderRouteLine = this._renderRouteLine.bind(this);
	}

	onRegionChange(region) {
		this.latDelta = region.latitudeDelta;
		this.longDelta = region.longitudeDelta;
	}

	componentDidMount() {
		this.mounted = true;
		this.setLocation(this.props, false);
	}

	componentWillReceiveProps(nextprops) {
		this.setLocation(nextprops, true);
	}

	componentWillUnmount() {
		this.mounted = false;
		if (this.watchID) navigator.geolocation.clearWatch(this.watchID);
		if (animationTimeout) {
			clearTimeout(animationTimeout);
		}
	}

	setLocation(props, mapLoaded) {
		if(props.selected === ME || props.selected === ALL_FRIEND) {
			if (Platform.OS === 'android') {
				PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION)
				.then(granted => {
				  if (granted && this.mounted) {
				  	navigator.geolocation.getCurrentPosition((pos)=>{
				  		this.setState({ 
				        	region: {
				        		latitude: pos.coords.latitude,
					            longitude: pos.coords.longitude,
					            latitudeDelta: LATITUDE_DELTA,
					            longitudeDelta: LONGITUDE_DELTA,
				        	},
				        	markars: []
				        });
				        this._setMyAddress({lat:pos.coords.latitude, lng:pos.coords.longitude});
				       	if(props.selected === ALL_FRIEND) {
				       		let myPosition = {
					  			id:-1,
						      	position: pos.coords,
			      				name: 'Me',
			    				thumbnailPath: ''
						      };
						    _.remove(this.state.markars, {id:-1});  
						    this.setState({ 
					        	...this.state,
					        	markars: [...this.state.markars, myPosition]
					        });
					        this.watchLocation();
				       	}
				       	else if(props.selected === ME) {
				       		let myPosition = {
					  			id:-1,
						      	position: pos.coords,
			      				name: 'Me',
			    				thumbnailPath: ''
						      };
						    _.remove(this.state.markars, {id:-1});  
						    this.setState({ 
					        	...this.state,
					        	markars: [myPosition]
					        });
					        this.watchLocation();
				       	}
				  	}, (err)=>{
		    			console.log('[ERROR]: Geolocation error ',err);
		    			this.fallbackLocation();
		    		});
				  }
				});
			}
		}
		else {
			if(mapLoaded == true) {
				this.addMarkers(props);
			}
			else {
				navigator.geolocation.getCurrentPosition((pos)=>{
					this.setState({ 
			        	region: {
			        		latitude: pos.coords.latitude,
				            longitude: pos.coords.longitude,
				            latitudeDelta: LATITUDE_DELTA,
				            longitudeDelta: LONGITUDE_DELTA,
			        	},
			        	markars: []
			        });
			        this.addMarkers(props);
				}, (err)=>{
					console.log('[ERROR]: Geolocation error ',err);
				});
			}
		}
	}
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
		    thumbnailPath: ''
	      };
	      if (!isEqual(myPosition.position, myLastPositionCoord)) {
	      	_.remove(this.state.markars, {id:-1});
	        this.setState({ 
	        	...this.state,
	        	region: {
	        		latitude: position.coords.latitude,
		            longitude: position.coords.longitude,
		            latitudeDelta: this.latDelta,
		            longitudeDelta: this.longDelta,
	        	},
	        	markars: [...this.state.markars, myPosition]
	        });
	        this._setMyAddress({lat:position.coords.latitude, lng:position.coords.longitude});
	      }
	    }, (err)=>{
	    	console.log('[ERROR]: Geolocation error ',err);
	    	this.fallbackLocation();
	    });
	}

	fallbackLocation(props) {
		navigator.geolocation.getCurrentPosition((pos)=>{
	  		this.setState({ 
	        	region: {
	        		latitude: pos.coords.latitude,
		            longitude: pos.coords.longitude,
		            latitudeDelta: LATITUDE_DELTA,
		            longitudeDelta: LONGITUDE_DELTA,
	        	},
	        	markars: []
	        });
	       	if(props.selected === ALL_FRIEND) {
	       		let myPosition = {
		  			id:-1,
			      	position: pos.coords,
      				name: 'Me',
    				thumbnailPath: ''
			      };
			    _.remove(this.state.markars, {id:-1});  
			    this.setState({ 
		        	...this.state,
		        	markars: [...this.state.markars, myPosition]
		        });
		        this.addMarkers(props);
		        this.watchLocation();
	       	}
	       	else if(props.selected === ME) {
	       		let myPosition = {
		  			id:-1,
			      	position: pos.coords,
      				name: 'Me',
    				thumbnailPath: ''
			      };
			    _.remove(this.state.markars, {id:-1});  
			    this.setState({ 
		        	...this.state,
		        	markars: [myPosition]
		        });
		        this.watchLocation();
	       	}
	       	else {
	       		this.addMarkers(props);
	       	}
		}, (err)=>{
			console.log('[ERROR]: Geolocation error ',err);
		});
	}

	addMarkers(props) {
		let markerArray = [];
		try {
			if(props.subscribedTo!==undefined && props.subscribedTo!==null
			&& props.subscribedTo.length>0){
				if(props.selected === ALL_FRIEND) {
					props.subscribedTo.forEach((item)=>{
						if(item!==undefined && item!==null
							&& item.loc!==undefined && item.loc!==null) {
							let m = {
								id: item.recordID,
								position: item.loc,
								name: item.givenName,
								thumbnailPath: item.thumbnailPath
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
							thumbnailPath: obj.thumbnailPath,
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
				        this._speakLocation(m.name, {lat:obj.loc.latitude, lng:obj.loc.longitude});
						if(this.props.selected>0){
							if(this.state.showRoute!==undefined && this.state.showRoute!==null
								&& this.state.showRoute === true) {
								let routeList = this.state.routes;
								routeList.push({latitude: obj.loc.latitude,
				            		longitude: obj.loc.longitude});
								this.setState({ 
						        	...this.state,
						        	routes: routeList
						        });
							}
						}
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
		catch(e) {
			console.log(e);
			this.setState({ 
	        	region: {
	        		latitude: LATITUDE,
		            longitude: LONGITUDE,
		            latitudeDelta: LATITUDE_DELTA,
		            longitudeDelta: LONGITUDE_DELTA,
	        	},
	        	markars: []
	        });
		}
	}

	focusMap(markers, animated) {
	    console.log('Markers received to populate map: ', markers);
	    if(this.map!==undefined && this.map!==null &&
	    	markers!==undefined && markers!==null && markers.length>0) {
	    	this.map.fitToSuppliedMarkers(markers, animated);
	    }
	}

	fitMap(coords, options, animated) {
	    console.log('coords received to populate map: ', coords);
	    if(this.map!==undefined && this.map!==null &&
	    	coords!==undefined && coords!==null && coords.length>0) {
	    	this.map.fitToCoordinates(coords, options, animated);
	    }
	}

	_renderBottomBar() {
		if(this.props.selected>0) {
			let obj = _.find(this.props.subscribedTo, {recordID: this.props.selected});
			let thumbnail = require('../images/icons/default.jpg');
			if(obj.thumbnailPath!==undefined && obj.thumbnailPath!==null 
				&& obj.thumbnailPath!=='') {
				thumbnail = {uri:obj.thumbnailPath};
			}
			let name = '';
			if(obj.givenName!==undefined && obj.givenName!==null 
				&& obj.givenName!=='') {
				name = obj.givenName;
			}
			if(obj.familyName!==undefined && obj.familyName!==null 
				&& obj.familyName!=='') {
				name = name + ' ' + obj.familyName;
			}
			let speed = '(Speed unknown)';
			if(obj.loc.speed!==undefined && obj.loc.speed!==null
				&& obj.loc.speed!=='') {
				speed = obj.loc.speed + ' meters/second'
			}

			return (
				<View style={styles.mapBottomBar}>
					<Image style={styles.mapBottomImage}
						source={thumbnail}/>
					<View style={styles.mapBottomTextBar}>
						<Text style={[styles.defaultFont]}>
				        	{name}
				    	</Text>
				    	<Text>{speed}</Text>
				    	{this._renderTime(obj)}
					</View>
				</View>
			);
		}
		return null;
	}

	_renderTime(obj) {
		if(obj.loc.time!==undefined && obj.loc.time!==null
			&& obj.loc.time!=='') {
			let utcTime = Number(obj.loc.time);
			let date = new Date(utcTime).toString();
			return ( <Text>{date}</Text> );
		}
		return null;
	}
	_getStrokeColor(id) {
		if(id !== -1) {
			return "rgba(204,29,35, 0.2)";
		}
		else 
			return "rgba(74,68,242, 0.2)";
	}

	_enableSpeech() {
		this.setState({...this.state, ttsEnabled: true});
		speak(WELCOME_SPEECH);
	}

	_disableSpeech() {
		this.setState({...this.state, ttsEnabled: false});
		speak(CLOSE_SPEECH);
	}

	_enableRoute() {
		let _that = this;
		this.setState({...this.state, showRoute: true});
		this.watchID = navigator.geolocation.getCurrentPosition((position) => {
	      let myPosition = {
	      	id:-1,
	      	position: position.coords,
	      	name: 'Me',
		    thumbnailPath: ''
	      };
	      let obj = _.find(this.props.subscribedTo, {recordID: this.props.selected});
	      getRoute({lat:position.coords.latitude, lng:position.coords.longitude},
	      	{lat:obj.loc.latitude, lng:obj.loc.longitude}, (res)=>{
	      		let markerArray = [myPosition, ..._that.state.markars];
	      		if(markerArray!==undefined
				&& markerArray!==null
				&& markerArray.length>0) {
					_that.setState({..._that.state, markars:markerArray});
					let markerIDs = [];
					markerArray.forEach((item)=>{
						markerIDs.push(item.id.toString());
					});
					animationTimeout = setTimeout(() => {
				      _that.setState({..._that.state, routes:res});
				      _that.fitMap(res,{edgePadding:{
				      	top: 60,
				      	right:30,
				      	bottom: 30,
  						left: 30
				      }}, true);
					}, distnce_timeout);
				}
	      	});
	    }, (err)=>{
	    	console.log('[ERROR]: Geolocation error ',err);
	    });
	}

	_disableRoute() {
		this.setState({...this.state, showRoute: false, routes:[]});
		let obj = _.find(this.props.subscribedTo, {recordID: this.props.selected});
		if(obj!==undefined && obj!==null && obj.status===STATUS_LIVE
			&& obj.loc!==undefined && obj.loc!==null) {
			let m = {
				id: obj.recordID,
				position: obj.loc,
				thumbnailPath: obj.thumbnailPath,
				name: obj.givenName
			};
			let markerArray = [m];
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
	    }
	}

	_speakLocation(name, pos) {
		let _that = this;
		let shouldSpeak = false;
		if(this.state.ttsEnabled!==undefined &&
			this.state.ttsEnabled!==null &&
			this.state.ttsEnabled===true) {
			shouldSpeak = true;
		}
		getAddress(pos, name, speak, (addrText)=>{
			_that.setState({..._that.state, selAddress:addrText});
		}, shouldSpeak);
	}

	_setMyAddress(pos) {
		let _that = this;
		getAddress(pos, '', null, (addrText)=>{
			_that.setState({..._that.state, myAddress:addrText});
		}, false);
	}

	_renderAddress() {
		let address = '';
		if(this.props.selected>0){
			address = this.state.selAddress;
		}
		else {
			address = this.state.myAddress;
		}
		if(address!=='') {
			return (
				<View style={[styles.addressPositionContainer]}>
					<Text>{address}</Text>
				</View>
			);
		}
		else {
			return null;
		}
	}

	_renderRoute() {
		if(this.props.selected>0){
			if(this.state.showRoute!==undefined && this.state.showRoute!==null
				&& this.state.showRoute === true) {
				return (
					<View style={[styles.routePositionContainer]}>
						<TouchableNativeFeedback onPress={()=>{
							this._disableRoute();
						}}
						background={TouchableNativeFeedback.Ripple('#CC39C4', true)}>
							<View style={[styles.routeEnabledContainerStyle]}>
								<MaterialCommunityIcons name="near-me" size={30} 
								style={[styles.routeEnabledStyle]} />
							</View>
						</TouchableNativeFeedback>
					</View>
				);
			}
			else {
				return (
					<View style={[styles.routePositionContainer]}>
						<TouchableNativeFeedback onPress={()=>{
							this._enableRoute();
						}}
						background={TouchableNativeFeedback.Ripple('#CC39C4', true)}>
							<View style={[styles.routeDisabledContainerStyle]}>
								<MaterialCommunityIcons name="near-me" size={30} 
								style={[styles.routeDisabledStyle]} />
							</View>
						</TouchableNativeFeedback>
					</View>
				);
			}
		}
		return null;
	}

	_renderSpeak() {
		if(this.props.selected>0){
			if(this.state.ttsEnabled!==undefined && this.state.ttsEnabled!==null
				&& this.state.ttsEnabled === true) {
				return (
					<View style={[styles.speechPositionContainer]}>
						<TouchableNativeFeedback onPress={()=>{
							this._disableSpeech();
						}}
						background={TouchableNativeFeedback.Ripple('#CC39C4', true)}>
							<View style={[styles.speechEnabledContainerStyle]}>
								<MaterialCommunityIcons name="microphone" size={30} 
								style={[styles.speechEnabledStyle]} />
							</View>
						</TouchableNativeFeedback>
					</View>
				);
			}
			else {
				return (
					<View style={[styles.speechPositionContainer]}>
						<TouchableNativeFeedback onPress={()=>{
							this._enableSpeech();
						}}
						background={TouchableNativeFeedback.Ripple('#CC39C4', true)}>
							<View style={[styles.speechDisabledContainerStyle]}>
								<MaterialCommunityIcons name="microphone-off" size={30} 
								style={[styles.speechDisabledStyle]} />
							</View>
						</TouchableNativeFeedback>
					</View>
				);
			}
		}
		return null;
	}

	_renderRouteLine() {
		if(this.props.selected>0){
			console.log('this.state.routes',this.state.routes);
			if(this.state.routes!==undefined && this.state.routes!==null
				&& this.state.routes.length>0) {
				return (
					<MapView.Polyline
			            coordinates={this.state.routes}
			            strokeColor="#4A44F2"
			            strokeWidth={4}
				     />
				);
			}
		}
		return null;
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
							<MapView.Circle
					            center={marker.position}
					            radius={100}
					            fillColor={this._getStrokeColor(marker.id)}
					            strokeColor={this._getStrokeColor(marker.id)}
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
						{this._renderRouteLine()}
					</MapView>
					{this._renderBottomBar()}
					{this._renderSpeak()}
					{this._renderRoute()}
					{this._renderAddress()}
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
export default connect(mapStateToProps)(GoogleMapView);