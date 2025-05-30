import React from 'react';
import { Dimensions } from 'react-native';
import Svg, { Circle, Ellipse, G, Path, Polygon } from 'react-native-svg';

const { width } = Dimensions.get('window');
const HEIGHT = width * 1.3;

// Colors from the provided palette
const BG = '#F3E2C7';
const DARK = '#2C1A05';
const MID = '#4B3415';

export default function OnboardingIllustration() {
  return (
    <Svg width={width * 0.9} height={HEIGHT * 0.6} viewBox="0 0 768 576">
      {/* Mountain and stars background */}
      <G>
        <Path d="M600 300 Q700 100 768 300 L768 576 L0 576 L0 300 Q100 100 168 300 Z" fill={MID} />
        {/* Stars */}
        <Circle cx="700" cy="120" r="7" fill={BG} />
        <Circle cx="650" cy="90" r="5" fill={BG} />
        <Circle cx="600" cy="160" r="4" fill={BG} />
        <Circle cx="720" cy="200" r="6" fill={BG} />
        <Circle cx="670" cy="200" r="3" fill={BG} />
      </G>
      {/* Campfire */}
      <G>
        <Ellipse cx="690" cy="250" rx="18" ry="7" fill={DARK} />
        <Path d="M690 250 Q692 240 695 245 Q698 240 700 250 Q702 245 705 250 Q700 235 690 250" fill={BG} />
      </G>
      {/* Three men (stylized heads) */}
      <G>
        <Ellipse cx="120" cy="180" rx="70" ry="90" fill={DARK} />
        <Ellipse cx="220" cy="200" rx="60" ry="80" fill={DARK} />
        <Ellipse cx="310" cy="210" rx="55" ry="75" fill={DARK} />
        {/* Faces (simplified) */}
        <Path d="M90 170 Q110 150 130 170 Q120 180 110 170" fill={BG} />
        <Path d="M200 190 Q220 170 240 190 Q230 200 220 190" fill={BG} />
        <Path d="M290 200 Q310 180 330 200 Q320 210 310 200" fill={BG} />
      </G>
      {/* Hiker silhouette */}
      <G>
        <Path d="M600 400 Q620 350 650 400 Q670 420 700 410 Q710 430 690 450 Q670 470 650 460 Q630 450 600 400" fill={DARK} />
        <Ellipse cx="670" cy="420" rx="10" ry="20" fill={DARK} />
      </G>
      {/* Trees */}
      <G>
        <Polygon points="500,500 510,470 520,500" fill={DARK} />
        <Polygon points="530,510 540,480 550,510" fill={DARK} />
        <Polygon points="560,520 570,490 580,520" fill={DARK} />
      </G>
      {/* Foreground campfire */}
      <G>
        <Ellipse cx="120" cy="520" rx="30" ry="10" fill={DARK} />
        <Path d="M120 520 Q122 510 125 515 Q128 510 130 520 Q132 515 135 520 Q130 505 120 520" fill={BG} />
      </G>
    </Svg>
  );
} 