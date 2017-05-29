import {SET_MY_LOCATION} from '../actions/action-types';

const INITIAL_STATE = {
	current:{}
};

export default function(state=INITIAL_STATE, action) {
	switch(action.type) {
		case SET_MY_LOCATION: 
			return {...state,  current:action.payload};
		default:
			return state; 
	}
}