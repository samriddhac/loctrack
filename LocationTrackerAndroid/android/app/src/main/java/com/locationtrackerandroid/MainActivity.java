package com.locationtrackerandroid;

import com.facebook.react.ReactActivity;
import android.os.Bundle;
import com.cboy.rn.splashscreen.SplashScreen;
import com.bugsnag.BugsnagReactNative;

public class MainActivity extends ReactActivity {

    /**
     * Returns the name of the main component registered from JavaScript.
     * This is used to schedule rendering of the component.
     */
    @Override
    protected String getMainComponentName() {
        return "LocationTrackerAndroid";
    }

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        BugsnagReactNative.start(this);
        SplashScreen.show(this);
    }
}
