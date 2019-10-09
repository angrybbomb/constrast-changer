package com.reactlibrary;

import android.content.Context;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.os.AsyncTask;
import android.support.v7.widget.AppCompatImageView;

import org.opencv.android.Utils;
import org.opencv.core.Core;
import org.opencv.core.Mat;
import org.opencv.core.Scalar;

import java.io.IOException;
import java.io.InputStream;
import java.net.HttpURLConnection;
import java.net.URL;
import java.net.MalformedURLException;
import java.util.concurrent.ExecutionException;


public class RNContrastChangingImageView extends AppCompatImageView {

    private Bitmap fetchedImageData = null;
    private String fetchUrl = null;
    private double contrast = 1;

    public RNContrastChangingImageView(Context context) {
        super(context);
    }

    public void setFetchUrl(String imgUrl) {
        if (imgUrl != this.fetchUrl) {
            this.fetchUrl = imgUrl;
            downloadImage(imgUrl);
        }
    }

    public void setContrast(double contrastVal) {
        this.contrast = contrastVal;

        if (this.fetchedImageData != null) {
            this.updateImageContrast();
        }
    }

    public void setResizeMode(String mode) {
        switch (mode) {
            case "cover":
                this.setScaleType(ScaleType.CENTER_CROP);
                break;
            case "stretch":
                this.setScaleType(ScaleType.FIT_XY);
                break;
            case "contain":
            default:
                this.setScaleType(ScaleType.FIT_CENTER);
                break;
        }
    }

    private void updateImageContrast() {
        try {
            Mat matImage = new Mat();
            Utils.bitmapToMat(this.fetchedImageData, matImage);

            Scalar imgScalVec = Core.sumElems(matImage);
            double[] imgAvgVec = imgScalVec.val;
            for (int i = 0; i < imgAvgVec.length; i++) {
                imgAvgVec[i] = imgAvgVec[i] / (matImage.cols() * matImage.rows());
            }
            double imgAvg = (imgAvgVec[0] + imgAvgVec[1] + imgAvgVec[2]) / 3;
            int brightness = -(int) ((this.contrast - 1) * imgAvg);
            matImage.convertTo(matImage, matImage.type(), this.contrast, brightness);

            Bitmap resultImage = Bitmap.createBitmap(
                this.fetchedImageData.getWidth(),
                this.fetchedImageData.getHeight(),
                this.fetchedImageData.getConfig()
            );
            Utils.matToBitmap(matImage, resultImage);

            this.setImageBitmap(resultImage);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    private void downloadImage(String imgUrl) {
        DownloadImage task = new DownloadImage();

        Bitmap result = null;
        try {
            result = task.execute(imgUrl).get();
        }
        catch (InterruptedException | ExecutionException e) {
            e.printStackTrace();
        }

        this.fetchedImageData = result;
        this.setImageBitmap(result);
    }

    class DownloadImage extends AsyncTask<String, Void, Bitmap> {
        @Override
        protected Bitmap doInBackground(String... imgUrls) {
            URL url;
            HttpURLConnection httpURLConnection;

            try {
                url = new URL(imgUrls[0]);
                httpURLConnection = (HttpURLConnection) url.openConnection();
                httpURLConnection.connect();
                InputStream in =httpURLConnection.getInputStream();
                Bitmap myBitmap = BitmapFactory.decodeStream(in);
                return myBitmap;
            }
            catch (MalformedURLException e) {
                e.printStackTrace();
                return null;
            } catch (IOException e) {
                e.printStackTrace();
                return null;
            }
        }
    }
}
