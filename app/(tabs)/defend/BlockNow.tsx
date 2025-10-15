import { scale, scaleVertical } from "@/constants/Scale";
import { router } from "expo-router";
import React, { useState } from "react";
import {
    Dimensions,
    FlatList,
    Image,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const { width } = Dimensions.get("window"); 

const BlockNowScreen = () => {
  const insets = useSafeAreaInsets();
  const [selectedDuration, setSelectedDuration] = useState<string | null>(null);

  const DURATION_OPTIONS = [
    { id: "2", label: "2 hour block" },
    { id: "4", label: "4 hour block" },
    { id: "8", label: "8 hour block" },
    { id: "12", label: "12 hour block" },
  ];

  const DurationList = () => {
    const renderItem = ({ item }: { item: (typeof DURATION_OPTIONS)[number] }) => {
      const selected = selectedDuration === item.id;

      return (
        <TouchableOpacity
          onPress={() => setSelectedDuration(item.id)}
          activeOpacity={0.8}
          style={{
            backgroundColor: "rgba(44, 23, 7, 0.6)",
            borderRadius: 4,
            paddingHorizontal: scale(16),
            paddingVertical: scale(20),
            marginBottom: scale(16),
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <Text
            style={{
              color: "#fff",
              fontSize: scale(16),
              fontFamily: "ZillaSlab-Medium",
            }}
          >
            {item.label}
          </Text>

          <View style={{ flex: 1 }} />

          {/* Radio circle */}
          {selected ? (
            <Image 
              source={require("../../../assets/new-images/radio-selected.png")} 
              style={{ 
                width: scale(24), 
                height: scale(24) 
              }} 
            />
          ) : (
            <Image 
              source={require("../../../assets/new-images/radio-unselected.png")} 
              style={{ 
                width: scale(24), 
                height: scale(24) 
              }} 
            />
          )}
        </TouchableOpacity>
      );
    };

    return (
      <FlatList
        data={DURATION_OPTIONS}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={{ 
          marginVertical: scale(32), 
        }}
        showsVerticalScrollIndicator={false}
      />
    );
  };

  return (
    <View style={styles.safe}>
      <Image
        source={require("../../../assets/new-images/onboarding-screen-4.png")}
        style={styles.image}
      />
      <Image
        source={require("../../../assets/new-images/onboarding-overlay-full.png")}
        style={styles.overlayImage}
      />

      <View style={[styles.mainContainer, { marginTop: insets.top + scaleVertical(16) }]}>
        <TouchableOpacity
          style={styles.buttonBack}
          activeOpacity={0.8}
          onPress={() => router.back()}
        >
          <Image source={require("../../../assets/new-images/icon-back.png")} 
            // resizeMode="center" 
            style={{
              height: scale(20),
              width: scale(20),
            }}
          />
        </TouchableOpacity>
  
        <Text style={styles.slogan}>Start a block now</Text>
        <Text style={styles.description}>Choose how long you want to stay focused.</Text>
        
        <DurationList />

        <View>
          <TouchableOpacity
            style={[
              styles.primaryBtn,
              !selectedDuration && styles.buttonDisabled,
            ]}
            onPress={() => {
              if (selectedDuration) {
                router.push({
                  pathname: '/defend/StartBlockLoading',
                  params: { duration: selectedDuration, pornBlocking: 'true' } // Default to true for now
                });
              }
            }}
            activeOpacity={0.9}
            disabled={!selectedDuration}
          >
            <Text style={styles.primaryText}>{"Start now"}</Text>
          </TouchableOpacity>
        </View>
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
    height: width * 0.939
  },
  overlayImage: { 
    position: "absolute",
    width: "100%", 
    height: "120%" 
  },
  mainContainer: {
    flex: 1,
    marginHorizontal: scale(24),
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
    paddingVertical: scaleVertical(20),
    width: '100%',
    marginBottom: scaleVertical(24),
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
  buttonDisabled: {
    backgroundColor: '#312B27',
    opacity: 0.6,
  },
});

export default BlockNowScreen;