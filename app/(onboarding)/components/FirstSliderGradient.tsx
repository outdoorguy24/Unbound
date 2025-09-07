import React from "react";
import { Dimensions } from "react-native";
import Svg, { Defs, LinearGradient, Path, Stop } from "react-native-svg";

const { width: screenWidth, height: screenHeight } = Dimensions.get("screen");

const FirstSliderGradient = () => (
  <Svg width={screenWidth} height={screenHeight} viewBox={`0 0 ${screenWidth} ${screenHeight}`} fill="none">
    <Path 
      d={`M0.5 0H${screenWidth - 0.5}V${screenHeight}H0.5V0Z`} 
      fill="url(#paint0_linear_578_7812)"
    />
    <Defs>
      <LinearGradient 
        id="paint0_linear_578_7812" 
        x1={screenWidth / 2} 
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
