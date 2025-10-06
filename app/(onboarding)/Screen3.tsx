import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  Dimensions,
} from 'react-native';
import { scale, scaleVertical } from '@/constants/Scale';

const { height } = Dimensions.get("window");

const Screen3 = () => {
  
  return (
    <View style={styles.safe}>
      <Image source={require("../../assets/new-images/onboarding-screen-3.png")} style={styles.image} />
      <Image source={require("../../assets/new-images/onboarding-overlay.png")} style={styles.overlayImage} />
      
      <View style={styles.textContainer}>
        <Text style={styles.slogan}>
          {'which is why This app is an act of rebellion'}
        </Text>
        <Text style={styles.slogan2}>
          {'Society wants a bunch of screen-addicted consumers. But you’re here to create, explore, & build.'}
        </Text>
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
    height: '75%',
    width: '100%',
  },

  overlayImage: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  textContainer: {
    position: "absolute",
    top: height < 700 ? height * 0.61 : height * 0.59,
    alignItems: "center",
    marginHorizontal: scale(24),
  },
  slogan: {
    color: "#FFF",
    fontSize: scale(25),
    textAlign: "center",
    fontFamily: "Cinzel-Bold",
    letterSpacing: 0.5,
  },
  slogan2: {
    color: "#FFF",
    fontSize: scale(20),
    opacity: 0.7,
    textAlign: "center",
    fontFamily: "ZillaSlab-Regular",
    letterSpacing: 0.5,
    marginTop: scaleVertical(10),
  },
});

export default Screen3;

// import { ScreenContainer } from "@/components/ui/ScreenContainer";
// import { COLORS, LAYOUT, SPACING, TYPOGRAPHY } from "@/constants/theme";
// import { Image, ImageBackground, StyleSheet, Text, View } from "react-native";

// export default function Screen3() {
//   return (
//     <ImageBackground
//       source={require("../../assets/images/parchment-bg.png")}
//       style={styles.background}
//       resizeMode="cover"
//     >
//       <ScreenContainer style={styles.screenContainer}>
//         <View style={styles.content}>
//           <View style={styles.illustrationContainer}>
//             <Image source={require("../../assets/images/onboarding/slotmachine.png")} style={styles.illustration} />
//           </View>
//           <View style={styles.headingContainer}>
//             <Text style={styles.heading}>Every minute on your phone is a minute{"\n"}you&apos;ll never get back.</Text>
//           </View>
//           <Text style={styles.body}>
//             You&apos;re giving away your life one swipe at a time to billionaire tech overlords who don&apos;t care about
//             your goals. We are the pawns in their battle to see who can extract our attention in the most addictive way
//             for <Text style={styles.underline}>profit</Text>.
//           </Text>
//         </View>
//       </ScreenContainer>
//     </ImageBackground>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//   },
//   background: {
//     flex: 1,
//   },
//   screenContainer: {
//     backgroundColor: 'transparent',
//     paddingHorizontal: 0,
//     paddingTop: 0,
//   },
//   content: {
//     flex: 1,
//     alignItems: "center",
//     justifyContent: "flex-start",
//     paddingHorizontal: LAYOUT.paddingHorizontal,
//     paddingTop: SPACING.md * 0.5,
//     paddingBottom: SPACING.xl,
//   },
//   illustrationContainer: {
//     width: "100%",
//     alignItems: "center",
//     marginBottom: SPACING.md,
//     marginTop: SPACING.md,
//   },
//   illustration: {
//     width: "100%",
//     aspectRatio: 1.2,
//     height: undefined,
//     resizeMode: "contain",
//     marginBottom: SPACING.sm,
//     marginTop: SPACING.xl,
//   },
//   headingContainer: {
//     backgroundColor: "#2C1A05",
//     paddingVertical: SPACING.md,
//     paddingHorizontal: SPACING.lg,
//     borderRadius: 12,
//     marginBottom: SPACING.lg,
//     borderWidth: 1,
//     borderColor: "#E6D3A7",
//     width: '100%',
//   },
//   heading: {
//     fontFamily: TYPOGRAPHY.heading.fontFamily,
//     fontSize: 28,
//     lineHeight: 36,
//     fontWeight: "900",
//     color: "#F3E2C7",
//     textAlign: "center",
//   },
//   body: {
//     fontFamily: TYPOGRAPHY.body.fontFamily,
//     fontSize: 18,
//     lineHeight: 30,
//     color: COLORS.textPrimary,
//     textAlign: "center",
//     marginBottom: SPACING.xl,
//     fontWeight: "bold",
//   },
//   underline: {
//     textDecorationLine: "underline",
//   },
// });
