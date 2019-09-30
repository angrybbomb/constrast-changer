import React from 'react'
import PropTypes from 'prop-types'
import { requireNativeComponent } from 'react-native'

class ContrastChangingImage extends React.Component {
  render() {
    return <RNContrastChangingImage {...this.props} />
  }
}

ContrastChangingImage.propTypes = {
  url: PropTypes.string.isRequired,
  contrast: PropTypes.number.isRequired,
  /**
   * Determines how to resize the image when the frame doesn't match the raw image dimensions.
   * enum('contain', 'cover', 'stretch') with 'contain' value by default.
   */
  resizeMode: PropTypes.oneOf(['contain', 'cover', 'stretch']),
}

ContrastChangingImage.defaultProps = {
  resizeMode: 'contain',
}

var RNContrastChangingImage = requireNativeComponent('RNContrastChangingImage', ContrastChangingImage)

export default ContrastChangingImage
