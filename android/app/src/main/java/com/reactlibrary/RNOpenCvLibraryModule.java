package com.reactlibrary;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.Callback;

import android.graphics.Bitmap;
import android.graphics.BitmapFactory;

import org.opencv.core.CvType;
import org.opencv.core.Mat;

import org.opencv.android.Utils;

import android.util.Base64;
import java.io.ByteArrayOutputStream;

public class RNOpenCvLibraryModule extends ReactContextBaseJavaModule {

    private final ReactApplicationContext reactContext;

    public RNOpenCvLibraryModule(ReactApplicationContext reactContext) {
        super(reactContext);
        this.reactContext = reactContext;
    }

    @Override
    public String getName() {
        return "RNOpenCvLibrary";
    }

    @ReactMethod
    public void changeImageContrast(String imageAsBase64, Double alpha, Callback errorCallback, Callback successCallback) {
        try {
            BitmapFactory.Options options = new BitmapFactory.Options();
            options.inDither = true;
            options.inPreferredConfig = Bitmap.Config.ARGB_8888;

            byte[] decodedString = Base64.decode(imageAsBase64, Base64.DEFAULT);
            Bitmap image = BitmapFactory.decodeByteArray(decodedString, 0, decodedString.length);


            Mat matImage = new Mat();
            Utils.bitmapToMat(image, matImage);

            matImage.convertTo(matImage, matImage.type(), alpha, 0);

            Bitmap resultImage = Bitmap.createBitmap(image.getWidth(), image.getHeight(), image.getConfig());
            Utils.matToBitmap(matImage, resultImage);

            ByteArrayOutputStream stream = new ByteArrayOutputStream();
            resultImage.compress(Bitmap.CompressFormat.PNG, 100, stream);
            byte[] byteArray = stream.toByteArray();
            resultImage.recycle();

            String resultAsBase64 = Base64.encodeToString(byteArray, 1);

            successCallback.invoke(resultAsBase64);
        } catch (Exception e) {
            errorCallback.invoke(e.getMessage());
        }
    }
}