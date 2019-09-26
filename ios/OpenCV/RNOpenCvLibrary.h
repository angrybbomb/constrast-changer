#if __has_include("RCTBridgeModule.h")
#import "RCTBridgeModule.h"
#else
#import <React/RCTBridgeModule.h>
#endif

#import <UIKit/UIKit.h>
#import <opencv2/imgproc/imgproc.hpp>
#import <React/RCTLog.h>

@interface RNContrastChangingImageView : UIImageView {
  UIImageView *mUIImageView;
  UIImage *mUIImg;
  UIImage *fetchedImgUI;
//  NSString *url;
//  float contrast;
}
@property (nonatomic, retain, setter = setUrl:) NSString *url;
@property (nonatomic, setter = setContrast:) float contrast;
- (void)setUrl:(NSString *)imgUrl;
- (void)setContrast:(float)value;

- (void) changeImageContrast;
- (UIImageView *)getView;
@end
