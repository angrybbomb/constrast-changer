#import "RNContrastChangingImageManager.h"

@implementation RNContrastChangingImageManager

RNContrastChangingImageView* contrastChangingImageView = nil;

RCT_EXPORT_MODULE(RNContrastChangingImage)

- (UIView *)view {
  NSLog(@"view !!!");
  
  RNContrastChangingImageView* contrastChangingImage1 = [[RNContrastChangingImageView alloc] init];
  
  return contrastChangingImage1;
}

RCT_EXPORT_VIEW_PROPERTY(url, NSString *);
RCT_EXPORT_VIEW_PROPERTY(contrast, float);

@end
