import {CHANGE_VIEW} from '../actions/action-types';
import {VIEW_SEARCH} from '../common/constants';
const INITIAL_STATE = {
	id: VIEW_SEARCH
};
export default function (state=INITIAL_STATE, action) {
	switch(action.type) {
		case CHANGE_VIEW:
			let newState = { ...state, id:action.payload};
			return newState;
		default:
			return state;
	}
}