# NativeImageStuff

Basicly just follow the steps of this tutorial https://brainhub.eu/blog/opencv-react-native-image-processing/

Setup steps
1. Clone the repo
2. Run `npm i`
3. Run openCV shell script by `sh openCV.sh`. This will download and unzip archives with OpenCV library for each platform
4. Run `react-native link`

For iOS platform
- make sure the `opencv2.framework` is linked to the project
- make sure you have proper values of `Precompile Prefix Header` and `Prefix Header` set up (see Step 8  of the [tutorial](https://brainhub.eu/blog/opencv-react-native-image-processing/))


For Andoid platform
- check the `build.gradle` of openCVLibrary match the main values from `build.gradle` of your project (see Step 5 of the [tutorial](https://brainhub.eu/blog/opencv-react-native-image-processing/))
- Add module dependency (like in Step 6 of the [tutorial](https://brainhub.eu/blog/opencv-react-native-image-processing/))

Helpful links:
- https://brainhub.eu/blog/opencv-react-native-image-processing/
- https://github.com/brainhubeu/react-native-opencv-tutorial
- https://docs.opencv.org/3.4.3/d3/dc1/tutorial_basic_linear_transform.html
- https://www.opencv-srf.com/2018/02/change-contrast-of-images-and-videos.html
- https://docs.opencv.org/2.4/doc/tutorials/ios/image_manipulation/image_manipulation.html
