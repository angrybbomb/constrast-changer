#import "RNContrastChangingImageManager.h"

@implementation RNContrastChangingImageManager

RNContrastChangingImageView* contrastChangingImageView = nil;

RCT_EXPORT_MODULE(RNContrastChangingImage)

- (UIView *)view {
  return [[RNContrastChangingImageView alloc] init];
}

RCT_EXPORT_VIEW_PROPERTY(resizeMode, NSString *);
RCT_EXPORT_VIEW_PROPERTY(url, NSString *);
RCT_EXPORT_VIEW_PROPERTY(contrast, float);

@end
