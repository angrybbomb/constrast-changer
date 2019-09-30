package com.reactlibrary;

import com.facebook.react.uimanager.SimpleViewManager;
import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.annotations.ReactProp;


public class RNContrastChangingImageManager extends SimpleViewManager<RNContrastChangingImageView> {
    @Override
    public String getName() {
        return "RNContrastChangingImage";
    }

    @Override
    protected RNContrastChangingImageView createViewInstance(ThemedReactContext reactContext) {
        return new RNContrastChangingImageView(reactContext);
    }

    @ReactProp(name = "url")
    public void setFetchUrl(RNContrastChangingImageView view, String imgUrl) {
        view.setFetchUrl(imgUrl);
    }

    @ReactProp(name = "contrast", defaultFloat = 1f)
    public void setContrastValue(RNContrastChangingImageView view, float contrast) {
        view.setContrast(contrast);
    }

    @ReactProp(name = "resizeMode")
    public void setResizeMode(RNContrastChangingImageView view, String mode) {
        view.setResizeMode(mode);
    }
}
