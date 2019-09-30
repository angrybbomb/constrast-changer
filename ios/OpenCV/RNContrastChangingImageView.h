#if __has_include("RCTBridgeModule.h")
#import "RCTBridgeModule.h"
#else
#import <React/RCTBridgeModule.h>
#endif

#import <UIKit/UIKit.h>
#import <opencv2/imgproc/imgproc.hpp>

@interface RNContrastChangingImageView : UIImageView {
  NSData *fetchedImageData;
}
@property (nonatomic, retain, setter = setResizeMode:) NSString *resizeMode;
@property (nonatomic, retain, setter = setUrl:) NSString *url;
@property (nonatomic, setter = setContrast:) float contrast;
@end
