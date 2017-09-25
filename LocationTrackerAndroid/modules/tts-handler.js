import Tts from 'react-native-android-speech';

export function speak(msg) {
	Tts.isSpeaking().then(isSpeaking => {
		if(isSpeaking!==undefined && isSpeaking!==null
			&& isSpeaking!==true) {
			Tts.speak({
			    text:msg,
			    pitch:1.5,
			    forceStop : false ,
			    language : 'en',
			    country : 'US'
			}).then(isSpeaking=>{
			    console.log(isSpeaking);
			}).catch(error=>{
			    console.log(error)
			});
		}
	});
}

export function stopSpeaking() {
	TTs.stop()
	.then(isStopped=>{
	    console.log(isStopped);
	})
	.catch(error=>{
	    console.log(error);
	});
}