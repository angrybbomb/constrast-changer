package com.reactlibrary;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.Callback;

import android.graphics.Bitmap;
import android.graphics.BitmapFactory;

import org.opencv.core.Mat;
import org.opencv.core.Scalar;
import org.opencv.core.Core;

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
    public void changeImageContrast(String imageAsBase64, Double contrast, Callback errorCallback,
            Callback successCallback) {
        try {
            BitmapFactory.Options options = new BitmapFactory.Options();
            options.inDither = true;
            options.inPreferredConfig = Bitmap.Config.ARGB_8888;

            byte[] decodedString = Base64.decode(imageAsBase64, Base64.DEFAULT);
            Bitmap image = BitmapFactory.decodeByteArray(decodedString, 0, decodedString.length);

            Mat matImage = new Mat();
            Utils.bitmapToMat(image, matImage);

            Scalar imgScalVec = Core.sumElems(matImage);
            double[] imgAvgVec = imgScalVec.val;
            for (int i = 0; i < imgAvgVec.length; i++) {
                imgAvgVec[i] = imgAvgVec[i] / (matImage.cols() * matImage.rows());
            }
            double imgAvg = (imgAvgVec[0] + imgAvgVec[1] + imgAvgVec[2]) / 3;
            int brightness = -(int) ((contrast - 1) * imgAvg);
            matImage.convertTo(matImage, matImage.type(), contrast, brightness);

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