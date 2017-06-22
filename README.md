Note :-

On react native background :-
If you are using react-native-maps or another lib that requires react-native-maps such as Exponent.js or airbnb's react-native-maps then aditionally to the instalation steps described here, you must also change node_modules/react-native-mauron85-background-geolocation/android/lib/build.gradle in order to gms:play-services-locations match the same version used by those libraries. (in this case 9.8.0)
