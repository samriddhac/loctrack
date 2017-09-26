import Geocoder from 'react-native-geocoder';
import {buildAddrText} from './utils/utilities';

var GEO_CODER_API_KEY = 'AIzaSyB2xTNBOrdr_jj9wqoAAZ6VdPE8_kTOm1s';
Geocoder.fallbackToGoogle(GEO_CODER_API_KEY);

export async function getAddress(pos, name, func) {
	try {
		let addr = await Geocoder.geocodePosition(pos);
		let addrText = buildAddrText(addr);
		let text = `${name} is currently located at ${addrText}`;
		func(text);
	}
	catch(err) {
    	console.log(err);
	}
}