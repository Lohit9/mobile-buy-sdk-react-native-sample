package com.sampleapps.bridges;


import android.util.Base64;
import android.content.Intent;
import com.shopify.buy.dataprovider.BuyClientFactory;
import com.shopify.buy.dataprovider.BuyClient;
import com.shopify.buy.ui.ProductDetailsBuilder;
import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.sampleapps.MainActivity;

public class BuySDKManager extends ReactContextBaseJavaModule {
    public BuySDKManager(ReactApplicationContext reactContext) {
        super(reactContext);
    }

    @Override
    public String getName() {
        return "BuySDKManager";
    }

    @ReactMethod
    public void showToast(String apiKey,Callback successCallback) {
        String authorize = "Basic " + Base64.encodeToString(apiKey.getBytes(), Base64.NO_WRAP) ;
        successCallback.invoke(authorize);
    }

   @ReactMethod
   public void presentProductWithId(String product_id, String shopDomain, String apikey, String channelid){
       BuyClient buyClient = BuyClientFactory.getBuyClient(shopDomain,apikey,channelid,"com.sampleapps.bridges");
       ProductDetailsBuilder builder = new ProductDetailsBuilder(this.getReactApplicationContext(),buyClient);
       Intent intent = builder.setShopDomain(shopDomain)
               .setProductId(product_id)
               .build();
       MainActivity.getActivity().startActivityForResult(intent, 1);
   }
}
