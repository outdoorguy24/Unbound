import React from "react";
import { Dimensions } from "react-native";
import Svg, { Defs, LinearGradient, Path, Stop } from "react-native-svg";

const { width: screenWidth, height: screenHeight } = Dimensions.get("screen");

const TopTextGradient = () => (
  <Svg width={screenWidth} height={screenHeight} viewBox={`0 0 ${screenWidth} ${screenHeight}`} fill="none">
    <Path 
      d={`M0.5 0H${screenWidth - 0.5}V${screenHeight}H0.5V0Z`} 
      fill="url(#paint0_linear_top)"
    />
    <Defs>
      <LinearGradient 
        id="paint0_linear_top" 
        x1={screenWidth / 2} 
        y1="0" 
        x2={screenWidth / 2} 
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
