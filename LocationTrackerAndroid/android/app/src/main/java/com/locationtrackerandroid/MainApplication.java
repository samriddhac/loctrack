package com.locationtrackerandroid;

import android.app.Application;

import com.facebook.react.ReactApplication;
import com.react.rnspinkit.RNSpinkitPackage;
import com.dieam.reactnativepushnotification.ReactNativePushNotificationPackage;
import com.bugsnag.BugsnagReactNative;
import com.cboy.rn.splashscreen.SplashScreenReactPackage;
import com.airbnb.android.react.maps.MapsPackage;
import com.oblador.vectoricons.VectorIconsPackage;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;
import com.marianhello.react.BackgroundGeolocationPackage; 
import com.dieam.reactnativepushnotification.ReactNativePushNotificationPackage;
import com.mihir.react.tts.*;
import com.devfd.RNGeocoder.RNGeocoderPackage;
import cl.json.RNSharePackage;

import java.util.Arrays;
import java.util.List;

import com.rt2zz.reactnativecontacts.ReactNativeContacts; 

public class MainApplication extends Application implements ReactApplication {

  private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {
    @Override
    public boolean getUseDeveloperSupport() {
      return BuildConfig.DEBUG;
    }

    @Override
    protected List<ReactPackage> getPackages() {
      return Arrays.<ReactPackage>asList(
          new MainReactPackage(),
            new RNSpinkitPackage(),
            BugsnagReactNative.getPackage(),
            new SplashScreenReactPackage(),
          new MapsPackage(),
          new VectorIconsPackage(),
          new ReactNativeContacts(),
          new BackgroundGeolocationPackage(),
          new ReactNativePushNotificationPackage(),
          new RCTTextToSpeechModule(),
          new RNGeocoderPackage(),
          new RNSharePackage()
      );
    }
  };

  @Override
  public ReactNativeHost getReactNativeHost() {
    return mReactNativeHost;
  }

  @Override
  public void onCreate() {
    super.onCreate();
    SoLoader.init(this, /* native exopackage */ false);
  }
}
