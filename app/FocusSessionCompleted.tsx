import { scale, scaleVertical } from "@/constants/Scale";
import { router } from "expo-router";
import React, { useState } from "react";
import {
    Dimensions,
    FlatList,
    Image,
    LayoutChangeEvent,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const { width } = Dimensions.get("window"); 

const FocusSessionCompletedScreen = () => {
  const insets = useSafeAreaInsets();

  const DAYS = ["S", "M", "T", "W", "T", "F", "S"];

  type Props = {
    completed?: number[]; // indices 0..6 (Sun..Sat)
    fireIcon?: any;       // require(...) or { uri }
    sidePadding?: number; // horizontal padding inside the card
    radius?: number;
  };

  const StreakBar: React.FC<Props> = ({
    completed = [0, 1, 2, 3, 4],
    fireIcon = require("../assets/new-images/streak-fire-icon.png"), // <- replace with your asset
    sidePadding = 12,
    radius = 8,
  }) => {
    const [cardW, setCardW] = useState(0);

    const onLayout = (e: LayoutChangeEvent) => {
      setCardW(e.nativeEvent.layout.width);
    };

    const innerW = Math.max(cardW - sidePadding * 2, 0);
    const baseW = innerW > 0 ? Math.floor(innerW / 7) : 0;
    const remainder = innerW - baseW * 7; // add this to the last tile to avoid clipping

    return (
      <View
        onLayout={onLayout}
        style={{
          marginTop: scale(20),
          width: "100%",
          backgroundColor: "rgb(23,23,23)",
          borderRadius: radius,
          paddingHorizontal: sidePadding,
          paddingVertical: scale(16),
        }}
      >
        {innerW > 0 && (
          <FlatList
            data={DAYS.map((d, i) => ({ day: d, index: i }))}
            keyExtractor={(it) => String(it.index)}
            horizontal
            scrollEnabled={false}
            showsHorizontalScrollIndicator={false}
            renderItem={({ item, index }) => {
              const isDone = completed.includes(item.index);
              const width = baseW + (index === 6 ? remainder : 0);
              return (
                <View
                  style={{
                    width,
                    alignItems: "center",
                    justifyContent: "flex-start",
                  }}
                >
                  {isDone ? (
                    <Image
                      source={fireIcon}
                      style={{ width: 28, height: 28 }}
                      resizeMode="contain"
                    />
                  ) : (
                    <View
                      style={{
                        marginVertical: 5,
                        width: 18,
                        height: 18,
                        borderRadius: 14,
                        backgroundColor: "rgb(42, 42, 42)",
                      }}
                    />
                  )}
                  <Text
                    style={{
                      marginTop: 12,
                      color: "rgba(255, 255, 255, 0.6)",
                      fontSize: scale(14),
                      fontFamily: "ZillaSlab-Medium",
                    }}
                  >
                    {item.day}
                  </Text>
                </View>
              );
            }}
          />
        )}
      </View>
    );
  };
  return (
    <View style={styles.safe}>
      <Image
        source={require("../assets/new-images/focus-session-completed-bg.png")}
        style={styles.image}
      />
      <Image
        source={require("../assets/new-images/focus-session-completed-overlay.png")}
        style={styles.overlayImage}
      />
      <Image
        source={require("../assets/new-images/share-black-bg.png")}
        style={{ 
          position: "absolute",
          width: 40, 
          height: 40,
          top: insets.top + scale(16),
          right: scale(24),

        }}
      />

      <View style={[styles.mainContainer]}>  
        <Text 
          style={[{
            color: "#FFF",
            fontSize: scale(54),
            fontFamily: "Cinzel-Bold",
            letterSpacing: 0.5,
          }]}>
          nice, man.
        </Text>

        <Text 
          style={[{
            color: "#FFF",
            fontSize: scale(22),
            fontFamily: "ZillaSlab-Medium",
            letterSpacing: 0.5,
            marginTop: -6
          }]}>
          You stayed focused for
        </Text>
        
        <Text 
          style={[{
            color: "#FFF",
            fontSize: scale(46),
            fontFamily: "ZillaSlab-SemiBold",
            letterSpacing: 1.5,
            // marginTop: scale(4),
          }]}>
          05:00 hrs
        </Text>

        <Text 
          style={[{
            color: "#FFF",
            fontSize: scale(16),
            fontFamily: "ZillaSlab-Bold",
            letterSpacing: 0.5,
            marginTop: scale(6),
          }]}>
          {'2 '}
            <Text 
              style={[{
                color: "#FFF",
                fontSize: scale(16),
                fontFamily: "ZillaSlab-Regular",
                letterSpacing: 0.5,
              }]}>
              {'sessions left to hit your goal!🔥'}
            </Text>
        </Text>
        
        <StreakBar />

        <TouchableOpacity
          style={[
            styles.primaryBtn,
            {marginBottom: insets.bottom + scaleVertical(17)}
          ]}
          onPress={() => {
            router.navigate('/(tabs)/camp')
          }}
          activeOpacity={0.9}
        >
          <Text style={styles.primaryText}>{"Go to Dashboard"}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  safe: { 
    flex: 1, 
    backgroundColor: "#000" 
  },
  image: { 
    position: "absolute", 
    width: "100%", 
    height: width * 1.28
  },
  overlayImage: { 
    position: "absolute",
    width: "100%", 
    height: "105%" 
  },
  mainContainer: {
    position: 'absolute',
    right: scale(24),
    left: scale(24),
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  slogan: {
    marginTop: scale(24),
    color: "#FFF",
    fontSize: scale(32),
    fontFamily: "Cinzel-Regular",
  },
  description: {
    marginTop: scale(4),
    color: "rgba(255,255,255,0.7)",
    fontSize: scale(16),
    fontFamily: "ZillaSlab-Medium",
  },

  primaryBtn: {
    backgroundColor: '#BE5E19',
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: scaleVertical(18),
    width: '100%',
    marginTop: scaleVertical(24),
  },
  primaryText: {
    color: "#FFFFFF",
    fontSize: scale(18),
    textAlign: "center",
    fontFamily: "ZillaSlab-SemiBold",
    letterSpacing: 0,
  },
  buttonBack: {
    backgroundColor: "#000",
    width: scale(40),
    aspectRatio: 1,
    borderRadius: scale(20),
    justifyContent: "center",
    alignItems: "center",
  },
});

export default FocusSessionCompletedScreen;