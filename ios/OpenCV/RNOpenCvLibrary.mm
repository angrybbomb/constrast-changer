#import "RNOpenCvLibrary.h"
#import <React/RCTLog.h>

@implementation RNOpenCvLibrary

- (dispatch_queue_t)methodQueue
{
  return dispatch_get_main_queue();
}
RCT_EXPORT_MODULE()

RCT_EXPORT_METHOD(changeImageContrast:(NSString *)imageAsBase64 contrast:(double)contrast callback:(RCTResponseSenderBlock)callback) {
  UIImage* imageUI = [self decodeBase64ToImage:imageAsBase64];

  // NSData* imageData = [[NSData alloc] initWithContentsOfURL: [NSURL URLWithString: @"https://www.google.com.ua/search?q=image&sxsrf=ACYBGNQ0eHzaC60ij96y9xWR4Kt1EUlo2w:1568880116151&source=lnms&tbm=isch&sa=X&ved=0ahUKEwi_vZLwtdzkAhWnpYsKHT-_C3gQ_AUIEigB&biw=2088&bih=963#imgdii=Ovvz-bIIAP969M:&imgrc=G8Tx9wNoWYOx2M:"]];
  // // RCTLogInfo(@"imageData: %@", imageData);
  // // [imageData release];
  // cv::Mat matImage = cv::imdecode(cv::Mat(1, (int)[imageData length], CV_8UC1, (void*)imageData.bytes), CV_LOAD_IMAGE_UNCHANGED);
  
  cv::Mat matImage = [self cvMatFromUIImage:imageUI];

  cv::Scalar imgAvgVec = sum(matImage) / (matImage.cols * matImage.rows);
  double imgAvg = (imgAvgVec[0] + imgAvgVec[1] + imgAvgVec[2]) / 3;
  int brightness = -((contrast - 1) * imgAvg);
  
  matImage.convertTo(matImage, matImage.type(), contrast, brightness);

  UIImage* new_imageUI = [self UIImageFromCVMat:matImage];
  NSString* dstBase64 = [self encodeToBase64String:new_imageUI];
  
  id object = { dstBase64 };
  NSArray *array = [NSArray arrayWithObject:object];
  
  callback(@[[NSNull null], array]);
}

- (UIImage *)decodeBase64ToImage:(NSString *)strEncodeData {
  NSData *data = [[NSData alloc]initWithBase64EncodedString:strEncodeData options:NSDataBase64DecodingIgnoreUnknownCharacters];
  return [UIImage imageWithData:data];
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

- (NSString *)encodeToBase64String:(UIImage *)image {
  return [UIImagePNGRepresentation(image) base64EncodedStringWithOptions:NSDataBase64Encoding64CharacterLineLength];
}

@end
