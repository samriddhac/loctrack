import {CHANGE_VIEW} from '../actions/action-types';
import {VIEW_HOME} from '../common/constants';
const INITIAL_STATE = {
	id: VIEW_HOME,
	options: {}
};
export default function (state=INITIAL_STATE, action) {
	switch(action.type) {
		case CHANGE_VIEW:
			let newState = { ...state, id:action.payload.id, options: action.payload.options };
			return newState;
		default:
			return state;
	}
}