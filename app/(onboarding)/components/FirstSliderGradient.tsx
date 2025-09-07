import React from "react";
import Svg, { Defs, LinearGradient, Path, Stop } from "react-native-svg";

const FirstSliderGradient = () => (
  <Svg width="394" height="852" viewBox="0 0 394 852" fill="none">
    <Path 
      d="M0.5 0H393.5V852H0.5V0Z" 
      fill="url(#paint0_linear_578_7812)"
    />
    <Defs>
      <LinearGradient 
        id="paint0_linear_578_7812" 
        x1="197.5" 
        y1="302.5" 
        x2="233.207" 
        y2="567.183" 
        gradientUnits="userSpaceOnUse"
      >
        <Stop stopOpacity="0" />
        <Stop offset="1" />
      </LinearGradient>
    </Defs>
  </Svg>
);

export default FirstSliderGradient;
