import React, {Component} from 'react';
import {connect} from 'react-redux';

import {VIEW_HOME, VIEW_MAP, VIEW_MEDIA, VIEW_ABOUT, 
	VIEW_SEARCH_BOX, VIEW_REGISTER, VIEW_PRIVACY_POLICY
	} from '../common/constants';
import HomeView from './home-view';
import SearchView from './search-view';
import Register from './register';
import PrivacyPolicy from './privacy-policy';

class ViewStateManager extends Component {
	constructor(props) {
		super(props);
	}
	render() {
		if(this.props.viewId === VIEW_HOME) {
			return(<HomeView options={this.props.options}/>);
		}
		if(this.props.viewId === VIEW_REGISTER) {
			return(<Register options={this.props.options}/>);
		}
		else if(this.props.viewId === VIEW_SEARCH_BOX) {
			return(<SearchView options={this.props.options}/>);
		}
		else if(this.props.viewId === VIEW_PRIVACY_POLICY) {
			return(<PrivacyPolicy options={this.props.options}/>);
		}
		return (<HomeView options={this.props.options}/>);
	}
}
function mapStateToProps(state) {
	let viewId = state.viewState.id;
	let options = state.viewState.options;
	return { viewId, options }; 
}
export default connect(mapStateToProps)(ViewStateManager);