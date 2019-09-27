#import "RNOpenCvLibrary.h"


@implementation RNContrastChangingImageView
  UIImage *fetchedImgUI = nil;
  NSData *fetchedImageData = nil;
  UIImage *mUIImg = nil;

- (instancetype)init {
  if (self = [super init]) {
    _url = nil;
    fetchedImgUI = nil;
    mUIImg = nil;
    [self setContrast:1.0];
    [self setImage:mUIImg];
    return self;
  } else {
    return nil;
  }
}

- (void)setUrl:(NSString *)imgUrl {
  if (![imgUrl isEqualToString:self.url]) {
    NSLog(@"{ChangingImageView} setUrl: %@ !!!", imgUrl);
    
    [self downloadImage:imgUrl];
  }
}

- (void)setContrast:(float)value {
  NSLog(@"{ChangingImageView} setContrast: %f !!!", value);
  
  _contrast = value;
  if (!fetchedImgUI && self.url) {
    [self downloadImage:self.url];
  } else {
    [self changeImageContrast];
  }
}

- (void)downloadImage:(NSString *)imgUrl {
  NSLog(@"{ChangingImageView} downloadImage:  %@", imgUrl);
  
  dispatch_queue_t queue = dispatch_get_global_queue(DISPATCH_QUEUE_PRIORITY_HIGH, 0ul);
  dispatch_async(queue, ^{
    NSData * imageData = [NSData dataWithContentsOfURL:[NSURL URLWithString:[imgUrl stringByAddingPercentEscapesUsingEncoding:NSUTF8StringEncoding]]];
    dispatch_async(dispatch_get_main_queue(), ^{
      NSLog(@"{ChangingImageView} imageData:  %@", imageData);
      
      fetchedImgUI = [UIImage imageWithData:imageData];
      mUIImg = [UIImage imageWithData:imageData]; // posibility of blinking image
      [self changeImageContrast];
    });
  });
}

- (void) changeImageContrast {
  NSLog(@"{ChangingImageView} changeImageContrast");
  
  if (fetchedImgUI) {
    UIImage* imageUI = fetchedImgUI;
    
    cv::Mat matImage = [self cvMatFromUIImage:imageUI];
    
    cv::Scalar imgAvgVec = sum(matImage) / (matImage.cols * matImage.rows);
    double imgAvg = (imgAvgVec[0] + imgAvgVec[1] + imgAvgVec[2]) / 3;
    int brightness = -((self.contrast - 1) * imgAvg);
    
    matImage.convertTo(matImage, matImage.type(), self.contrast, brightness);
    
    NSLog(@"{ChangingImageView} mUIImg: %@", mUIImg);
    mUIImg = [self UIImageFromCVMat:matImage];
    [self setImage:mUIImg];
  }
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

