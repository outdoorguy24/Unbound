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
    key: "morning",
    label: "Morning",
    image: require("../../assets/new-images/icon-morning.png"),
  },
  {
    key: "work",
    label: "Work breaks",
    image: require("../../assets/new-images/icon-work-breaks.png"),
  },
  {
    key: "evening",
    label: "Evening",
    image: require("../../assets/new-images/icon-evening.png"),
  },
  {
    key: "latenight",
    label: "Late night",
    image: require("../../assets/new-images/icon-late-night.png"),
  },
  {
    key: "all",
    label: "All of the above",
    image: require("../../assets/new-images/icon-all-above.png"),
  },
];

const Screen5 = ({ scrollTimes, toggleOption }: any) => {

  const renderItem = ({ item }: { item: typeof OPTIONS[0] }) => {
    const isActive = scrollTimes?.includes(item.key);
    return (
      <TouchableOpacity
        style={[styles.item, isActive && styles.itemActive]}
        onPress={() => toggleOption(item.key)}
        activeOpacity={1}
      >

        <View style={styles.leftRow}>
          <Image source={item.image} style={styles.iconImage} />
          <Text style={[styles.label]}>
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
            {'When do you find yourself mindlessly scrolling?'}
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

export default Screen5;