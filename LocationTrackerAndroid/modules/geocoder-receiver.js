import Geocoder from 'react-native-geocoder';
import {buildAddrText} from './utils/utilities';

var GEO_CODER_API_KEY = 'AIzaSyB2xTNBOrdr_jj9wqoAAZ6VdPE8_kTOm1s';
Geocoder.fallbackToGoogle(GEO_CODER_API_KEY);

export async function getAddress(pos, name, func, optFunc, shouldSpeak) {
	try {
		let addr = await Geocoder.geocodePosition(pos);
		let addrText = buildAddrText(addr);
		let text = `${name} is currently located at ${addrText}`;
		if(func!==undefined && func!==null && shouldSpeak===true) {
			func(text);
		}
		if(optFunc!==undefined && optFunc!==null) {
			optFunc(addrText);
		}
	}
	catch(err) {
    	console.log(err);
	}
}