import {ACTION_TYPE_LOC_UPDATE} from './action-types';

export function updateLocation(data) {
	return {
		type:ACTION_TYPE_LOC_UPDATE,
		payload:data
	};
}