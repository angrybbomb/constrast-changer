/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import _ from 'lodash'
import React, { Component } from 'react'
import { StyleSheet, Text, View, TouchableOpacity, Image, Alert } from 'react-native'
import Slider from 'react-native-slider'
import ContrastChangingImage from './NativeModules/ContrastChangingImage'

const TestPicture = require('./assets/images/drivers-license.jpg')
const SLIDER_VALUE_DELAY = 15

type Props = {}
export default class App extends Component<Props> {
  state = {
    imgUrl: 'https://www.publicdomainpictures.net/pictures/20000/nahled/monarch-butterfly-on-flower.jpg',
    contrastValue: 1,
  }

  handleSave = () => {
    Alert.alert('Current Contrast Value', `${this.state.contrastValue}`)
  }

  onValueChange = value => this.setState({ contrastValue: +value.toFixed(1) })

  render() {
    const { contrastValue, imgUrl } = this.state

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
        <ContrastChangingImage style={styles.image} contrast={contrastValue} url={imgUrl} />
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
  image: {
    height: 300,
    width: 300,
  },
})
