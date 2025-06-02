import React from 'react';
import Screen1 from './Screen1';
import Screen2 from './Screen2';
import Screen3 from './Screen3';
import Screen4 from './Screen4';
import Screen5 from './Screen5';
import Screen6 from './Screen6';
import Screen7 from './Screen7';
import Screen8 from './Screen8';
import Screen9 from './Screen9';

const screens = [
  Screen1,
  Screen2,
  Screen3,
  Screen4,
  Screen5,
  Screen6,
  Screen7,
  Screen8,
  Screen9,
];

export default function OnboardingPager() {
  // This component is now just a placeholder, as navigation is handled by each screen's Next button.
  // Optionally, you could redirect to Screen1 here if needed.
  return <Screen1 />;
} 