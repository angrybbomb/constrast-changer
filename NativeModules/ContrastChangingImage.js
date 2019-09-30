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
  resizeMode: PropTypes.string,
}

ContrastChangingImage.defaultProps = {
  resizeMode: 'contain',
}

var RNContrastChangingImage = requireNativeComponent('RNContrastChangingImage', ContrastChangingImage)

export default ContrastChangingImage
