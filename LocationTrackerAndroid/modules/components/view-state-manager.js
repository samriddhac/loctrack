import React, {Component} from 'react';
import {connect} from 'react-redux';

import {VIEW_HOME, VIEW_MAP, VIEW_MEDIA, VIEW_ABOUT, VIEW_SEARCH_BOX} from '../common/constants';
import Home from './home';
import SearchBoxView from './search-box-view';

class ViewStateManager extends Component {
	constructor(props) {
		super(props);
	}
	render() {
		if(this.props.viewId === VIEW_HOME) {
			return(<Home />);
		}
		else if(this.props.viewId === VIEW_SEARCH_BOX) {
			return(<SearchBoxView />);
		}
		return (<Home />);
	}
}
function mapStateToProps(state) {
	let viewId = state.viewState.id;
	return { viewId }; 
}
export default connect(mapStateToProps)(ViewStateManager);