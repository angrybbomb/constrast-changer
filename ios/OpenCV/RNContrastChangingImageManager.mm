#import "RNContrastChangingImageManager.h"

@implementation RNContrastChangingImageManager

RNContrastChangingImageView* contrastChangingImageView = nil;

RCT_EXPORT_MODULE(RNContrastChangingImage)

- (UIView *)view {
  RNContrastChangingImageView* contrastChangingImage1 = [[RNContrastChangingImageView alloc] init];
//  [contrastChangingImage1 setUrl:@"https://www.publicdomainpictures.net/pictures/20000/nahled/monarch-butterfly-on-flower.jpg"];
//  [contrastChangingImage1 setContrast:2.0];
//  return contrastChangingImage1;
  
  NSLog(@"view !!!");
  RCTLogInfo(@"[RCT] view !!!");
  return contrastChangingImage1;
//  return [contrastChangingImage1 getView];
  
//  return [[RNContrastChangingImageView alloc] getView];
}

RCT_EXPORT_VIEW_PROPERTY(url, NSString *);
RCT_EXPORT_VIEW_PROPERTY(contrast, float);

@end
