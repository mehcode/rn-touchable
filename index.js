import React, {PropTypes} from "react";
import {
  View,
  TouchableWithoutFeedback,
  TouchableHighlight,
  TouchableNativeFeedback,
} from "react-native";
import colorShade from "color-shade";

function getHighlight(style) {
  const style = StyleSheet.flatten(style);
  let highlight
  if (style && style.backgroundColor) {
    highlight = colorShade(-0.15, style.backgroundColor);
  } else {
    highlight = "rgba(0, 0, 0, 0.15)";
  }

  return highlight;
}

function TouchableNativeFeedbackView(props) {
  // Naive approximation of _.omit
  const extraProps = Object.assign({}, props);
  delete extraProps.style;
  delete extraProps.underlayColor;
  delete extraProps.children;

  return (
    <TouchableNativeFeedback
      background={props.underlayColor}
      delayPressIn={0}
      delayPressOut={0}
      {...extraProps}
    >
      <View style={props.style}>
        {props.children}
      </View>
    </TouchableNativeFeedback>
  );
}

export default class Touchable extends React.Component {
  static propTypes = {
    // A single react-native element
    children: PropTypes.element,

    // If disabled the component is rendered with a <View/> container
    // instead of a <Touchable*/>
    disabled: PropTypes.bool,

    // If true, the component is rendered with <TouchableWithoutFeedback />
    noFeedback: PropTypes.bool,

    onPress: PropTypes.func.isRequired,
    style: View.propTypes.style,
  };

  render() {
    const highlight = getHighlight(this.props.style);

    // Determine container
    let Impl;
    if (this.props.disabled) Impl = View;
    else if (this.props.noFeedback) Impl = TouchableWithoutFeedback;
    else if (Platform.OS === "android" && Platform.Version >= 21) {
      Impl = TouchableNativeFeedback;
      highlight = TouchableNativeFeedback.ripple(highlight);
    } else {
      Impl = TouchableHighlight;
    }

    return (
      <Impl underlayColor={highlight} {...this.props}>
        {this.props.children}
      </Impl>
    );
  }
}
