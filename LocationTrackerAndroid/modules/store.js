import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import throttle from 'lodash/throttle';
import reducers from './reducers/index';
import { saveState } from './utils/utilities';

const createStoreWithMiddleware = applyMiddleware(thunk)(createStore);
let store = createStoreWithMiddleware(reducers);
store.subscribe(throttle(()=>{
	saveState({
		contactState: {
			myContact:store.getState().contactState.myContact,
			subscribedTo:store.getState().contactState.subscribedTo,
			publishingTo:store.getState().contactState.publishingTo
		}
	});
}, 1000));
export default store;