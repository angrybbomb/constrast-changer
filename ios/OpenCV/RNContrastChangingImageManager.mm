#import "RNContrastChangingImageManager.h"

@implementation RNContrastChangingImageManager

RCT_EXPORT_MODULE(RNContrastChangingImage)

- (UIView *)view {
  return [[RNContrastChangingImageView alloc] init];
}

@end
