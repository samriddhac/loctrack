import {ACTION_TYPE_LOC_UPDATE} from '../actions/action-types';
const INITIAL_STATE = {}

export default function(state=INITIAL_STATE, action) {
	switch(action.type) {
		case ACTION_TYPE_LOC_UPDATE: {
			return { ...state, location:action.payload}
		}
		default: {
			return state;
		}
	}
}