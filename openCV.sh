wget https://sourceforge.net/projects/opencvlibrary/files/opencv-ios/3.4.1/opencv-3.4.1-ios-framework.zip
unzip -a opencv-3.4.1-ios-framework.zip
cd ios
cp -r ./../opencv2.framework ./
cd ..
rm -rf opencv-3.4.1-ios-framework.zip
rm -rf opencv2.framework/
