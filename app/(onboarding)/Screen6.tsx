import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  Dimensions,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import { scale, scaleVertical } from '@/constants/Scale';

const { width, height } = Dimensions.get("window");

const OPTIONS = [
  {
    key: "choose_screen_over_friends",
    label: "Choosing the screen over friends, family & hobbies",
    image: require("../../assets/new-images/icon-choosing-screen.png"),
  },
  {
    key: "brain_feels_fried",
    label: "Brain feels fried and scattered",
    image: require("../../assets/new-images/icon-brain-fried.png"),
  },
  {
    key: "turning_lazy",
    label: "Turning into a lazy POS",
    image: require("../../assets/new-images/icon-turning-lazy.png"),
  },
  {
    key: "wasting_life",
    label: "Feeling like I’m wasting my life",
    image: require("../../assets/new-images/icon-wasting-life.png"),
  },
  {
    key: "all",
    label: "All of the above",
    image: require("../../assets/new-images/icon-all-above.png"),
  },
];

const Screen6 = ({ concerns, toggleOption }: any) => {

  const renderItem = ({ item }: { item: typeof OPTIONS[0] }) => {
    const isActive = concerns?.includes(item.key);
    return (
      <TouchableOpacity
        style={[styles.item, isActive && styles.itemActive]}
        onPress={() => toggleOption(item.key)}
        activeOpacity={1}
      >

        <View style={styles.leftRow}>
          <Image source={item.image} style={styles.iconImage} />
          <Text style={[styles.label]} numberOfLines={0}>
            {item.label}
          </Text>
        </View>

        {isActive ? (
          <Image
            source={require("../../assets/new-images/checked-box.png")}
            style={styles.checkbox}
          />
        ) : (
          <Image
            source={require("../../assets/new-images/unchecked-box.png")}
            style={styles.checkbox}
          />
        )}
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.safe}>
      <Image source={require("../../assets/new-images/onboarding-screen-4.png")} style={styles.image} />
      <Image source={require("../../assets/new-images/onboarding-overlay-full.png")} style={styles.overlayImage} />
      
        <View style={styles.textContainer}>
          <Text style={styles.slogan}>
            {'What scares you the most about phone addiction?'}
          </Text>
          <FlatList
            style={styles.listView}
            data={OPTIONS}
            keyExtractor={(item) => item.key}
            renderItem={renderItem}
          />
        </View>
      </View>
  );
};

const styles = StyleSheet.create({
  safe: { 
    flex: 1, 
    backgroundColor: '#000' 
  },
  image: {
    width: '100%',
    height: width * 0.939,
  },

  overlayImage: {
    position: 'absolute',
    width: '100%',
    height: '120%',
  },
  textContainer: {
    position: "absolute",
    top: scaleVertical(130),
    bottom: 0,
    left: scale(24),
    right: scale(24),    
  },
  slogan: {
    color: "#FFF",
    fontSize: scale(30),
    fontFamily: "ZillaSlab-Medium",
    letterSpacing: 0,
  },
  listView: {
    flex: 1,
    marginTop: scaleVertical(23),
    marginBottom: height < 700 ? scaleVertical(16) : 0,
  },
  item: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "rgba(44, 23, 7, 0.6)",
    borderRadius: 6,
    marginBottom: scaleVertical(12),
    borderWidth: 2,
    borderColor: "transparent",
  },
  itemActive: {
    borderColor: "rgba(255, 202, 145, 1)",
  },
  leftRow: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  label: {
    flex: 1,
    color: "#FFF",
    fontSize: scale(16),
    fontFamily: "ZillaSlab-Medium",
    letterSpacing: 0,
    marginLeft: scale(20),
    marginRight: scale(10),
  },
  checkbox: {
    width: scale(24),
    height: scale(24),
    marginRight: scaleVertical(12),
  },
  iconImage: {
    marginVertical: scaleVertical(12),
    marginLeft: scaleVertical(10),
    width: scale(40),
    height: scale(40),
  },
});

export default Screen6;