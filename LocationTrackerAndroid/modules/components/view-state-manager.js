import React, {Component} from 'react';
import {connect} from 'react-redux';

import {VIEW_HOME, VIEW_MAP, VIEW_MEDIA, VIEW_ABOUT, 
	VIEW_SEARCH_BOX, VIEW_REGISTER} from '../common/constants';
import Home from './home';
import SearchBoxView from './search-box-view';
import GoogleMap from './google-map';
import Register from './register';
import Display from 'react-native-display';

class ViewStateManager extends Component {
	constructor(props) {
		super(props);
	}
	render() {
		if(this.props.viewId === VIEW_HOME) {
			return(<Home />);
		}
		if(this.props.viewId === VIEW_REGISTER) {
			return(<Register />);
		}
		else if(this.props.viewId === VIEW_SEARCH_BOX) {
			return(<SearchBoxView />);
		}
		else if(this.props.viewId === VIEW_MAP) {
			return(<GoogleMap />);
		}
		return (<Home />);
	}
}
function mapStateToProps(state) {
	let viewId = state.viewState.id;
	return { viewId }; 
}
export default connect(mapStateToProps)(ViewStateManager);