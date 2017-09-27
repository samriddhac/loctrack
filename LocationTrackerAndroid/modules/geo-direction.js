const GOOGLE_DIRECTION_API_KEY = 'AIzaSyDS8v-swJtOofwDjbdmcXi0wWaJC37E6rI';

export async function getRoute(from, to, callback) {
	try {
		let url = `https://maps.googleapis.com/maps/api/directions/json?origin=${from.lat},${from.lng}&destination=${to.lat},${to.lng}&key=${GOOGLE_DIRECTION_API_KEY}`;
		let response = await fetch(url);
      	let responseJson = await response.json();
      	if(callback && callback!==undefined && callback!==null) {
      		callback(responseJson);
      	}
	}
	catch(error) {
      console.error(error);
    }
}