import React, {Component} from 'react';
import {connect} from 'react-redux';

import {VIEW_SEARCH, VIEW_MAP, VIEW_MEDIA, VIEW_ABOUT} from '../common/constants';
import Search from './search';

class ViewStateManager extends Component {
	constructor(props) {
		super(props);
	}
	render() {
		if(this.props.viewId === VIEW_SEARCH) {
			return(<Search />);
		}
		return (<Search />);
	}
}
function mapStateToProps(state) {
	let viewId = state.viewState.id;
	return { viewId }; 
}
export default connect(mapStateToProps)(ViewStateManager);