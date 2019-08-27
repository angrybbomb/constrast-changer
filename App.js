/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, { Component } from 'react'
import { Platform, StyleSheet, Text, View, TouchableOpacity, Image, ImageEditor, ImageStore, Alert } from 'react-native'
import Slider from 'react-native-slider'
import OpenCV from './NativeModules/OpenCV'

const TestPicture = require('./assets/images/drivers-license.jpg')

type Props = {}
export default class App extends Component<Props> {
  state = {
    initialImage: null,
    localImageTag: null,
    processedImage64: null,
    contrastValue: 1,
  }

  async componentDidMount() {
    try {
      const localImgUri = await Image.resolveAssetSource(TestPicture).uri

      Image.getSize(
        localImgUri,
        (width, height) => {
          ImageEditor.cropImage(
            localImgUri,
            {
              offset: { x: 0, y: 0 },
              size: { width, height },
            },
            croppedUri => {
              this.setState({ localImageTag: croppedUri })
              ImageStore.getBase64ForTag(
                croppedUri,
                localImgBase64 => {
                  this.setState({ initialImage: localImgBase64, processedImage64: localImgBase64 })
                },
                errorBase64 => {
                  console.log('TCL: App -> componentDidMount -> errorBase64', errorBase64)
                }
              )
            },
            errorCrop => {
              console.log('TCL: App -> componentDidMount -> errorCrop', errorCrop)
            }
          )
        },
        errorSize => {
          console.log('TCL: App -> componentDidMount -> errorSize', errorSize)
        }
      )
    } catch (error) {
      console.log('TCL: App -> componentDidMount -> error', error)
    }
  }

  componentWillUnmount() {
    ImageStore.removeImageForTag(this.state.localImageTag)
  }

  changeImageContrast(imageAsBase64) {
    const { contrastValue } = this.state

    return new Promise((resolve, reject) => {
      if (Platform.OS === 'android') {
        OpenCV.changeImageContrast(
          imageAsBase64,
          contrastValue,
          error => {
            console.log('TCL: App -> changeImageContrast -> error', error)
          },
          msg => {
            resolve(msg)
          }
        )
      } else {
        OpenCV.changeImageContrast(imageAsBase64, contrastValue, (error, dataArray) => {
          resolve(dataArray[0])
        })
      }
    })
  }

  handleSave = () => {
    Alert.alert('Current Contrast Value', `${this.state.contrastValue}`)
  }

  onValueChange = value =>
    this.setState({ contrastValue: +value.toFixed(1) }, () => {
      const { initialImage } = this.state
      this.changeImageContrast(initialImage).then(data => {
        if (data) {
          this.setState({ processedImage64: data })
        }
      })
    })

  render() {
    const { contrastValue, processedImage64 } = this.state

    return (
      <View style={styles.container}>
        <Text style={styles.title}>Change Contrast</Text>
        <Text style={styles.title}>{contrastValue}</Text>
        <Slider
          style={styles.slider}
          value={contrastValue}
          onValueChange={this.onValueChange}
          step={0.1}
          minimumValue={0}
          maximumValue={2}
          thumbTintColor={'#efefef'}
          minimumTrackTintColor={'#F8A136'}
          maximumTrackTintColor={'#5E82BC'}
        />
        <Text style={styles.instructions}>Move the slider left or right</Text>
        {processedImage64 && (
          <Image
            style={{ height: 300, width: 300 }}
            source={{ uri: `data:image/png;base64,${processedImage64}` }}
            resizeMode="contain"
          />
        )}
        <TouchableOpacity onPress={this.handleSave}>
          <Text style={styles.title}>Save</Text>
        </TouchableOpacity>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  title: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
  slider: {
    height: 40,
    width: '90%',
    shadowColor: '#333333',
    shadowOffset: {
      width: 1,
      height: 1,
    },
    shadowOpacity: 0.3,
    shadowRadius: 2,
  },
})
