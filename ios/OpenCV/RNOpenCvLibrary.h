#if __has_include("RCTBridgeModule.h")
#import "RCTBridgeModule.h"
#else
#import <React/RCTBridgeModule.h>
#endif

#import <UIKit/UIKit.h>
#import <opencv2/imgproc/imgproc.hpp>

@interface RNContrastChangingImageView : UIImageView

@end
