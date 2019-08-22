/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, { Component } from 'react'
import { Platform, StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import OpenCV from './NativeModules/OpenCV'

const instructions = Platform.select({
  ios: 'Press Cmd+R to reload,\n' + 'Cmd+D or shake for dev menu',
  android: 'Double tap R on your keyboard to reload,\n' + 'Shake or press menu button for dev menu',
})

type Props = {}
export default class App extends Component<Props> {
  checkForBlurryImage(imageAsBase64) {
    console.log('TCL: App -> checkForBlurryImage -> OpenCV: ', OpenCV)

    return new Promise((resolve, reject) => {
      OpenCV.checkForBlurryImage(imageAsBase64, (error, dataArray) => {
        resolve(dataArray[0])
      })
    })
  }

  testMethod = () => {
    this.checkForBlurryImage(`qwer`).then(data => {
      console.log('TCL: App -> testMethod -> data', data)
    })
  }

  render() {
    return (
      <View style={styles.container}>
        <TouchableOpacity onPress={this.testMethod}>
          <Text style={styles.welcome}>Welcome to React Native!</Text>
        </TouchableOpacity>
        <Text style={styles.instructions}>To get started, edit App.js</Text>
        <Text style={styles.instructions}>{instructions}</Text>
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
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
})
