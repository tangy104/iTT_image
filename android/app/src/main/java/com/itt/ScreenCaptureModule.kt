package com.itt

import android.app.Activity
import android.content.Context
import android.content.Intent
import android.graphics.Bitmap
import android.graphics.PixelFormat
import android.media.ImageReader
import android.media.projection.MediaProjection
import android.media.projection.MediaProjectionManager
import android.util.Base64
import android.util.Log
import android.view.Surface
import android.os.Handler
import com.facebook.react.bridge.*
import com.facebook.react.module.annotations.ReactModule

import java.io.ByteArrayOutputStream
import android.hardware.display.DisplayManager

@ReactModule(name = ScreenCaptureModule.NAME)
class ScreenCaptureModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {

    companion object {
        const val NAME = "ScreenCapture"
        const val REQUEST_CODE = 1000
    }

    private var mediaProjection: MediaProjection? = null
    private var imageReader: ImageReader? = null
    private var mediaProjectionManager: MediaProjectionManager? = null
    private var width: Int = 0
    private var height: Int = 0

    init {
        mediaProjectionManager = reactContext.getSystemService(Context.MEDIA_PROJECTION_SERVICE) as MediaProjectionManager
    }

    override fun getName(): String {
        return NAME
    }

    @ReactMethod
    fun startCapture() {
        val activity = currentActivity
        if (activity != null) {
            activity.startActivityForResult(mediaProjectionManager!!.createScreenCaptureIntent(), REQUEST_CODE)
        }
    }

    @ReactMethod
    fun onActivityResult(requestCode: Int, resultCode: Int, data: Intent?) {
        if (requestCode == REQUEST_CODE) {
            if (resultCode == Activity.RESULT_OK && data != null) {
                val serviceIntent = Intent(reactApplicationContext, ScreenCaptureService::class.java)
                reactApplicationContext.startService(serviceIntent)

                // Delay starting MediaProjection to allow service to stabilize
                Handler().postDelayed({
                    mediaProjection = mediaProjectionManager!!.getMediaProjection(resultCode, data)
                    setupImageReader()
                }, 1000) // Adjust delay time as needed (e.g., 1000 milliseconds)
            } else {
                Log.e("ScreenCaptureModule", "Screen capture permission denied")
            }
        }
    }

    private fun setupImageReader() {
        try {
            val metrics = reactApplicationContext.resources.displayMetrics
            width = metrics.widthPixels
            height = metrics.heightPixels
            val density = metrics.densityDpi

            imageReader = ImageReader.newInstance(width, height, PixelFormat.RGBA_8888, 2)
            val surface: Surface = imageReader!!.surface

            mediaProjection?.createVirtualDisplay(
                "ScreenCapture",
                width,
                height,
                density,
                DisplayManager.VIRTUAL_DISPLAY_FLAG_AUTO_MIRROR,
                surface,
                null,
                null
            )
        } catch (e: Exception) {
            Log.e("ScreenCaptureModule", "Error setting up image reader: ${e.message}", e)
        }
    }

    @ReactMethod
    fun captureScreen(quality: Int, promise: Promise) {
        try {
            if (mediaProjection == null) {
            promise.reject("MediaProjection is not initialized")
            return
            }

            val image = imageReader!!.acquireLatestImage()
            if (image == null) {
                promise.reject("Image is null")
                return
            }

            val planes = image.planes
            val buffer = planes[0].buffer
            val pixelStride = planes[0].pixelStride
            val rowStride = planes[0].rowStride
            val rowPadding = rowStride - pixelStride * width

            val bitmap = Bitmap.createBitmap(width + rowPadding / pixelStride, height, Bitmap.Config.ARGB_8888)
            bitmap.copyPixelsFromBuffer(buffer)

            // Convert bitmap to base64
            val base64Image = convertBitmapToBase64(bitmap, quality)
            val imageDataUrl = "data:image/jpeg;base64,$base64Image"
        
            // Close the acquired image to release the buffer
            image.close()

            promise.resolve(imageDataUrl)
        } catch (e: Exception) {
            Log.e("ScreenCaptureModule", "Error capturing screen: ${e.message}", e)
            promise.reject("Error capturing screen", e)
        }
    }


    @ReactMethod
    fun stopCapture() {
        try {
            mediaProjection?.stop()
            mediaProjection = null
            imageReader?.close()
            imageReader = null
        } catch (e: Exception) {
            Log.e("ScreenCaptureModule", "Error stopping capture: ${e.message}", e)
        }
    }

    private fun convertBitmapToBase64(bitmap: Bitmap, quality: Int): String {
        val outputStream = ByteArrayOutputStream()
        bitmap.compress(Bitmap.CompressFormat.JPEG, quality, outputStream)
        val byteArray = outputStream.toByteArray()
        return Base64.encodeToString(byteArray, Base64.DEFAULT)
    }
}
