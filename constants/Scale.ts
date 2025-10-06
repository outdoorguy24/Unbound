import { Dimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
const {width, height, scale: screenScale} = Dimensions.get('window');

const guidelineBaseWidth = 393;
const guidelineBaseHeight = 852;

const scale = size => (width / guidelineBaseWidth) * size;
const scaleVertical = size => (height / guidelineBaseHeight) * size;
const scaleModerate = (size, factor = 0.5) =>
  size + (scale(size) - size) * factor;

const HAS_BOTTOM_NOTCH = () => {
  const bottom = useSafeAreaInsets().bottom;
  return bottom > 0;
};

export {
  HAS_BOTTOM_NOTCH, height, scale, scaleModerate, scaleVertical, screenScale, width
};

