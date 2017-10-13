const GOOGLE_DIRECTION_API_KEY = 'AIzaSyDS8v-swJtOofwDjbdmcXi0wWaJC37E6rI';

export async function getRoute(from, to, callback) {
	try {
		let url = `https://maps.googleapis.com/maps/api/directions/json?origin=${from.lat},${from.lng}&destination=${to.lat},${to.lng}&key=${GOOGLE_DIRECTION_API_KEY}`;
		let response = await fetch(url);
      	let responseJson = await response.json();
      	if(callback && callback!==undefined && callback!==null) {
      		callback(convertRoutes(responseJson));
      	}
	}
	catch(error) {
      console.error(error);
    }
}

function convertRoutes(res) {
	let dist_routes = [];
	if(res!==undefined && res!==null &&
		res.routes!==undefined && res.routes!==null && res.routes.length>0) {
		res.routes.forEach((route)=>{
			if(route!==undefined && route!==null &&
			route.legs!==undefined && route.legs!==null && route.legs.length>0) {
				route.legs.forEach((leg)=>{
					if(leg!==undefined && leg!==null &&
					leg.steps!==undefined && leg.steps!==null && leg.steps.length>0) {
						leg.steps.forEach((step, index)=>{
							if(index === 0) {
								dist_routes.push({
									latitude: step.start_location.lat,
									longitude: step.start_location.lng
								});
							}
							dist_routes.push({
								latitude: step.end_location.lat,
								longitude: step.end_location.lng
							});
						});
					}
				});
			}
		});
	}
	return dist_routes;
}