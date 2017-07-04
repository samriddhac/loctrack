import {SET_FCM_TOKEN} from '../actions/action-types';

const INITIAL_STATE = {};

export default function(state=INITIAL_STATE, action) {
	switch(action.type) {
		case SET_FCM_TOKEN: 
			return {...state,  fcmToken:action.payload};
		default:
			return state; 
	}
}