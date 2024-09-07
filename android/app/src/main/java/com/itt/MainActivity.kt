package com.itt

import expo.modules.ReactActivityDelegateWrapper
import org.devio.rn.splashscreen.SplashScreen
import com.facebook.react.ReactActivity
import com.facebook.react.ReactActivityDelegate
import com.facebook.react.defaults.DefaultNewArchitectureEntryPoint.fabricEnabled
import com.facebook.react.defaults.DefaultReactActivityDelegate

import android.app.Activity
import android.content.Intent
import android.os.Bundle
import android.util.Log

class MainActivity : ReactActivity() {

  /**
   * Returns the name of the main component registered from JavaScript. This is used to schedule
   * rendering of the component.
   */
  override fun getMainComponentName(): String = "iTT"

  /**
   * Returns the instance of the [ReactActivityDelegate]. We use [DefaultReactActivityDelegate]
   * which allows you to enable New Architecture with a single boolean flags [fabricEnabled]
   */
  override fun createReactActivityDelegate(): ReactActivityDelegate =
      ReactActivityDelegateWrapper(this, BuildConfig.IS_NEW_ARCHITECTURE_ENABLED, DefaultReactActivityDelegate(this, mainComponentName, fabricEnabled))

  override fun onCreate(savedInstanceState: Bundle?) {
    SplashScreen.show(this)  // here
    super.onCreate(null)
  }

  override fun onActivityResult(requestCode: Int, resultCode: Int, data: Intent?) {
    super.onActivityResult(requestCode, resultCode, data)
    val reactContext = reactInstanceManager?.currentReactContext
    Log.d("MainActivity", "onActivityResult - requestCode: $requestCode, resultCode: $resultCode")

    if (reactContext != null && requestCode == ScreenCaptureModule.REQUEST_CODE) {
      if (resultCode == Activity.RESULT_OK && data != null) {
        Log.d("MainActivity", "onActivityResult - resultCode OK")
        // Notify the ScreenCaptureModule of the result
        (reactContext.getNativeModule(ScreenCaptureModule::class.java) as? ScreenCaptureModule)
            ?.onActivityResult(requestCode, resultCode, data)
      } else {
        Log.e("MainActivity", "onActivityResult - resultCode not OK or data is null")
      }
    }
  }
}
