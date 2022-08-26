import React, {Component} from 'react';
import auth from '@react-native-firebase/auth';
import {
  MFPaymentRequest,
  MFExecutePaymentRequest,
  MFLanguage,
  MFMobileCountryCodeISO,
  MFCurrencyISO,
  MFProduct,
} from 'myfatoorah-reactnative';
import moment from 'moment';

export default class MFActions {

  executeRequestJson = (obj) => {
    const {
      total,
      paymentMethodId,
      vendorID,
    } = obj;
    
    const localDate = moment()
    .local()
    .format('DD/MM/YYYY  HH:mm');
    //This will never be zero , cause empty cart screen will be shown when total is zero
    const invoiceValue = parseFloat(total.replace(' KD', ''));

    const request = new MFExecutePaymentRequest(invoiceValue, paymentMethodId);

    request.customerName = auth().currentUser.displayName;
    request.customerMobile = auth().currentUser.phoneNumber.substring(4, 12);
    request.userDefinedField = JSON.stringify({userId: auth().currentUser.uid});
    request.language = "en";
    request.mobileCountryCode = MFMobileCountryCodeISO.KUWAIT;
    request.displayCurrencyIso = MFCurrencyISO.KUWAIT_KWD;
    request.supplierCode = vendorID;
    request.customerEmail = auth().currentUser.email;
    request.customerReference = `venderId ${vendorID} / ${localDate}`;
    request.callBackUrl = 'https://katchkw.com';
    request.errorUrl = 'https://katchkw.com/error';

    delete request.supplierValue;
    
    return request;
  }

  executePayment = (obj) => {
    const {
      request,
      navigation,
      onError,
      onBeforeRequest,
      onSuccess,
    } = obj;
    onBeforeRequest();
    MFPaymentRequest.sharedInstance.executePayment(navigation, request, MFLanguage.ENGLISH, (response) => {
      try{
        if (response.getError()) {
          throw response.getError()
        }else {
          const bodyString = response.getBodyString();
          const invoiceId = response.getInvoiceId();
          const paymentStatusResponse = response.getBodyJson();
          if(paymentStatusResponse.IsSuccess){
            onSuccess(invoiceId);
          }
        }
      }catch(error){
        onError(error)
      }
     
    })
  }
}