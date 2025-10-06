import { scale, scaleVertical } from '@/constants/Scale';
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { height } = Dimensions.get("window");

const ParadoxScreen = ({isActive, onSubmit, onLogin} : { isActive?: boolean; onSubmit?: () => void; onLogin: () => void }) => {
  const insets = useSafeAreaInsets();
  
  return (
    <View style={styles.safe}>
      <View style={{flex: 1}}>
        <Image source={require("../../assets/new-images/campfire.png")} style={styles.image} />

        <Text style={styles.title}>
          {`DIGITAL FREEDOM STARTS HERE`}
        </Text>
      </View>
      <View style={[styles.bottomCard, {marginBottom: insets.bottom + scaleVertical(16)}]}>
        <TouchableOpacity style={styles.primaryBtn} onPress={onSubmit} activeOpacity={0.9}>
          <Text style={styles.primaryText}>Get Started</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.secondaryBtn} onPress={onLogin} activeOpacity={0.9}>
          <Text style={styles.secondaryText}>Login</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#000' },
  image: {
    height: '100%',
    width: '100%',
  },
  title: {
    top: height * 0.21,
    position: 'absolute',
    color: '#FFFFFF',
    fontSize: scale(50),
    lineHeight: scale(54),
    letterSpacing: 0.5,
    fontFamily: 'Cinzel-Bold',
    marginHorizontal: scale(16),
  },
  bottomCard: {
    marginHorizontal: scale(24),
  },
  primaryBtn: {
    backgroundColor: '#BE5E19',
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: scaleVertical(20),
  },
  primaryText: {
    color: "#FFFFFF",
    fontSize: scale(16),
    textAlign: "center",
    fontFamily: "ZillaSlab-SemiBold",
    letterSpacing: 0,
  },
  secondaryBtn: {
    marginTop: scaleVertical(16),
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    backgroundColor: 'transparent',
    paddingVertical: scaleVertical(20),
  },
  secondaryText: {
    color: "#FFFFFF",
    fontSize: scale(16),
    textAlign: "center",
    fontFamily: "ZillaSlab-SemiBold",
    letterSpacing: 0,
  },
});

export default ParadoxScreen;