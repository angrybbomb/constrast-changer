#import "RNOpenCvLibrary.h"
#import <React/RCTLog.h>

@implementation RNOpenCvLibrary

- (dispatch_queue_t)methodQueue
{
  return dispatch_get_main_queue();
}
RCT_EXPORT_MODULE()

RCT_EXPORT_METHOD(checkForBlurryImage:(NSString *)imageAsBase64 callback:(RCTResponseSenderBlock)callback) {
  UIImage* image = [self decodeBase64ToImage:imageAsBase64];
  BOOL isImageBlurryResult = [self isImageBlurry:image];
  
  id objects[] = { isImageBlurryResult ? @YES : @NO };
  NSUInteger count = sizeof(objects) / sizeof(id);
  NSArray *dataArray = [NSArray arrayWithObjects:objects
                                           count:count];
  
  callback(@[[NSNull null], dataArray]);
}

RCT_EXPORT_METHOD(concatenateHorizontally:(NSArray *)imagesAsBase64 callback:(RCTResponseSenderBlock)callback) {
  UIImage* image1 = [self decodeBase64ToImage:imagesAsBase64[0]];
  UIImage* image2 = [self decodeBase64ToImage:imagesAsBase64[1]];

  cv::Mat matImage1 = [self cvMatFromUIImage:image1];
  cv::Mat matImage2 = [self cvMatFromUIImage:image2];
  cv::Mat dst;

  cv::hconcat(matImage1, matImage2, dst);
  
  UIImage* dstUI = [self UIImageFromCVMat:dst];
  
  NSString* dstBase64 = [self encodeToBase64String:dstUI];
  
  id object = { dstBase64 };
  NSArray *array = [NSArray arrayWithObject:object];
  
  callback(@[[NSNull null], array]);
}

RCT_EXPORT_METHOD(concatenateVertically:(NSArray *)imagesAsBase64 callback:(RCTResponseSenderBlock)callback) {
  UIImage* image1 = [self decodeBase64ToImage:imagesAsBase64[0]];
  UIImage* image2 = [self decodeBase64ToImage:imagesAsBase64[1]];
  
  cv::Mat matImage1 = [self cvMatFromUIImage:image1];
  cv::Mat matImage2 = [self cvMatFromUIImage:image2];
  cv::Mat dst;
  
  cv::vconcat(matImage1, matImage2, dst);
  
  UIImage* dstUI = [self UIImageFromCVMat:dst];
  
  NSString* dstBase64 = [self encodeToBase64String:dstUI];
  
  id object = { dstBase64 };
  NSArray *array = [NSArray arrayWithObject:object];
  
  callback(@[[NSNull null], array]);
}

- (UIImage *)UIImageFromCVMat:(cv::Mat)cvMat {
  NSData *data = [NSData dataWithBytes:cvMat.data length:cvMat.elemSize()*cvMat.total()];
  
  CGColorSpaceRef colorSpace;
  CGBitmapInfo bitmapInfo;
  
  if (cvMat.elemSize() == 1) {
    colorSpace = CGColorSpaceCreateDeviceGray();
    bitmapInfo = kCGImageAlphaNone | kCGBitmapByteOrderDefault;
  } else {
    colorSpace = CGColorSpaceCreateDeviceRGB();
    bitmapInfo = kCGBitmapByteOrder32Little | (
                                               cvMat.elemSize() == 3? kCGImageAlphaNone : kCGImageAlphaNoneSkipFirst
                                               );
  }
  
  CGDataProviderRef provider = CGDataProviderCreateWithCFData((__bridge CFDataRef)data);
  
  // Creating CGImage from cv::Mat
  CGImageRef imageRef = CGImageCreate(
                                      cvMat.cols,                 //width
                                      cvMat.rows,                 //height
                                      8,                          //bits per component
                                      8 * cvMat.elemSize(),       //bits per pixel
                                      cvMat.step[0],              //bytesPerRow
                                      colorSpace,                 //colorspace
                                      bitmapInfo,                 // bitmap info
                                      provider,                   //CGDataProviderRef
                                      NULL,                       //decode
                                      false,                      //should interpolate
                                      kCGRenderingIntentDefault   //intent
                                      );
  
  // Getting UIImage from CGImage
  UIImage *finalImage = [UIImage imageWithCGImage:imageRef];
  CGImageRelease(imageRef);
  CGDataProviderRelease(provider);
  CGColorSpaceRelease(colorSpace);
  
  return finalImage;
}

- (cv::Mat)cvMatFromUIImage:(UIImage *)image {
  CGColorSpaceRef colorSpace = CGImageGetColorSpace(image.CGImage);
  CGFloat cols = image.size.width;
  CGFloat rows = image.size.height;
  
  if  (image.imageOrientation == UIImageOrientationLeft
       || image.imageOrientation == UIImageOrientationRight) {
    cols = image.size.height;
    rows = image.size.width;
  }
  
  cv::Mat cvMat(rows, cols, CV_8UC4); // 8 bits per component, 4 channels (color channels + alpha)
  
  CGContextRef contextRef = CGBitmapContextCreate(cvMat.data,                 // Pointer to  data
                                                  cols,                       // Width of bitmap
                                                  rows,                       // Height of bitmap
                                                  8,                          // Bits per component
                                                  cvMat.step[0],              // Bytes per row
                                                  colorSpace,                 // Colorspace
                                                  kCGImageAlphaNoneSkipLast |
                                                  kCGBitmapByteOrderDefault); // Bitmap info flags
  
  CGContextDrawImage(contextRef, CGRectMake(0, 0, cols, rows), image.CGImage);
  CGContextRelease(contextRef);
  CGColorSpaceRelease(colorSpace);
  
  //--swap channels -- //
  std::vector<cv::Mat> ch;
  cv::split(cvMat,ch);
  std::swap(ch[0],ch[2]);
  cv::merge(ch,cvMat);
  
  return cvMat;
}

- (NSString *)encodeToBase64String:(UIImage *)image {
  return [UIImagePNGRepresentation(image) base64EncodedStringWithOptions:NSDataBase64Encoding64CharacterLineLength];
}

- (UIImage *)decodeBase64ToImage:(NSString *)strEncodeData {
  NSData *data = [[NSData alloc]initWithBase64EncodedString:strEncodeData options:NSDataBase64DecodingIgnoreUnknownCharacters];
  return [UIImage imageWithData:data];
}

- (cv::Mat)convertUIImageToCVMat:(UIImage *)image {
  CGColorSpaceRef colorSpace = CGImageGetColorSpace(image.CGImage);
  CGFloat cols = image.size.width;
  CGFloat rows = image.size.height;
  
  cv::Mat cvMat(rows, cols, CV_8UC4); // 8 bits per component, 4 channels (color channels + alpha)
  
  CGContextRef contextRef = CGBitmapContextCreate(cvMat.data,                 // Pointer to  data
                                                  cols,                       // Width of bitmap
                                                  rows,                       // Height of bitmap
                                                  8,                          // Bits per component
                                                  cvMat.step[0],              // Bytes per row
                                                  colorSpace,                 // Colorspace
                                                  kCGImageAlphaNoneSkipLast |
                                                  kCGBitmapByteOrderDefault); // Bitmap info flags
  
  CGContextDrawImage(contextRef, CGRectMake(0, 0, cols, rows), image.CGImage);
  CGContextRelease(contextRef);
  
  return cvMat;
}

- (BOOL) isImageBlurry:(UIImage *) image {
  // converting UIImage to OpenCV format - Mat
  cv::Mat matImage = [self convertUIImageToCVMat:image];
  cv::Mat matImageGrey;
  // converting image's color space (RGB) to grayscale
  cv::cvtColor(matImage, matImageGrey, CV_BGR2GRAY);
  
  cv::Mat dst2 = [self convertUIImageToCVMat:image];
  cv::Mat laplacianImage;
  dst2.convertTo(laplacianImage, CV_8UC1);
  
  // applying Laplacian operator to the image
  cv::Laplacian(matImageGrey, laplacianImage, CV_8U);
  cv::Mat laplacianImage8bit;
  laplacianImage.convertTo(laplacianImage8bit, CV_8UC1);
  
  unsigned char *pixels = laplacianImage8bit.data;
  
  // 16777216 = 256*256*256
  int maxLap = -16777216;
  for (int i = 0; i < ( laplacianImage8bit.elemSize()*laplacianImage8bit.total()); i++) {
    if (pixels[i] > maxLap) {
      maxLap = pixels[i];
    }
  }
  // one of the main parameters here: threshold sets the sensitivity for the blur check
  // smaller number = less sensitive; default = 180
  int threshold = 180;
  
  return (maxLap <= threshold);
}

@end
