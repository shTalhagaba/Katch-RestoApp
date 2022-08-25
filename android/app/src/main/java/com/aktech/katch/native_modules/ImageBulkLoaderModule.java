package com.aktech.katch.native_modules;

import com.facebook.drawee.backends.pipeline.Fresco;
import com.facebook.imagepipeline.request.ImageRequest;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.google.gson.Gson;

import java.util.List;

public class ImageBulkLoaderModule extends ReactContextBaseJavaModule {
    private static ReactApplicationContext reactContext;
    public static final String REACT_CLASS = "ImageBulkLoader";

    ImageBulkLoaderModule(ReactApplicationContext context) {
        super(context);
        reactContext = context;
    }

    @Override
    public String getName() {
        return REACT_CLASS;
    }

    @ReactMethod
    public void load(String imageUrlsJSON, Promise promise) {
        try {
            Gson gson = new Gson();
            List<String> imageUrls = gson.fromJson(imageUrlsJSON, List.class);
            if(imageUrls.size() > 0){
                for (int i = 0; i < imageUrls.size(); i++) {
                    String imageUrl = imageUrls.get(i);
                    Fresco.getImagePipeline().prefetchToDiskCache(ImageRequest.fromUri(imageUrl), null);
                }
            }

            promise.resolve(imageUrls.size() + " Images Loaded From Native Side");
        } catch (Exception e) {
            promise.reject(e.getLocalizedMessage(),e.getMessage());
        }
    }
}