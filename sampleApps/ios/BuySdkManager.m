//
//  BuySdkManager.m
//  MobileBuySDKReactNativeSample
//
//  Created by Lohit Talasila on 2015-10-03.
//  Copyright © 2015 Facebook. All rights reserved.
//

#import "BuySdkManager.h"

@import Buy;
@interface BuySdkManager ()<BUYViewControllerDelegate>
@property (nonatomic,strong) BUYProductViewController *BuyViewController;
@property (nonatomic,copy) NSString *domain;
@property (nonatomic,copy) NSString *api;
@property (nonatomic,copy) NSString *channelid;
@property (nonatomic,copy) NSString *merchantid;

@end

@implementation BuySdkManager


RCT_EXPORT_MODULE()


RCT_EXPORT_METHOD(presentProductwithId:(NSString *)prodid)
{
    BUYClient *client = [[BUYClient alloc] initWithShopDomain:self.domain apiKey:self.api channelId:self.channelid];
    _BuyViewController = [[BUYProductViewController alloc] initWithClient:client ];
    _BuyViewController.merchantId = self.merchantid;
    _BuyViewController.delegate = self;
    [self.BuyViewController loadProduct:prodid completion:^(BOOL success, NSError *error) {
        UIWindow *window = [[UIApplication sharedApplication] keyWindow];
        UIViewController *controller = window.rootViewController;
        [controller presentViewController:self.BuyViewController animated:YES completion:nil];
    }];
    
}



RCT_EXPORT_METHOD(authorize:(NSString *)domain api:(NSString *)api channelid:(NSString *)channelid merchantid:(NSString *) merchantid:(RCTResponseSenderBlock)callback)
{
    self.domain = domain;
    self.api = api;
    self.channelid = channelid ;
    self.merchantid = merchantid ;
    NSData *data = [self.api dataUsingEncoding:NSUTF8StringEncoding];
    NSString *arr = [NSString stringWithFormat:@"%@ %@", @"Basic", [data base64EncodedStringWithOptions:0]];
    NSLog(@"the header is: %@",arr);
    callback(@[[NSNull null], arr]);
}



@end

