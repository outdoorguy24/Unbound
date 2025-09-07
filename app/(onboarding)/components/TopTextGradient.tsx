import React from "react";
import Svg, { Defs, LinearGradient, Path, Stop } from "react-native-svg";

const TopTextGradient = () => (
  <Svg width="394" height="852" viewBox="0 0 394 852" fill="none">
    <Path 
      d="M0.5 0H393.5V852H0.5V0Z" 
      fill="url(#paint0_linear_top)"
    />
    <Defs>
      <LinearGradient 
        id="paint0_linear_top" 
        x1="197.5" 
        y1="0" 
        x2="197.5" 
        y2="500" 
        gradientUnits="userSpaceOnUse"
      >
        <Stop offset="0" stopOpacity="1"/>
        <Stop offset="0.7" stopOpacity="0.4"/>
        <Stop offset="1" stopOpacity="0"/>
      </LinearGradient>
    </Defs>
  </Svg>
);

export default TopTextGradient;
