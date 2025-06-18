import { Image, ImageBackground, Pressable, StyleSheet, Text, View } from "react-native";

export default function DefendModal({ onClose }: { onClose: () => void }) {
  return (
    <View style={styles.modalOverlay}>
      <ImageBackground
        source={require("../../assets/images/parchment-bg.png")}
        style={styles.bg}
        imageStyle={styles.bgImage}
      >
        <View style={styles.container}>
          <Pressable style={styles.closeButton} onPress={onClose}>
            <Image source={require("../../assets/images/remove-circle.png")} style={styles.closeIcon} />
          </Pressable>
          <Text style={styles.title}>WARNING</Text>
          <Image source={require("../../assets/images/double-arrow.png")} style={styles.arrow} />
          <Text style={styles.body}>
            This is an act of rebellion.{"\n"}
            You&rsquo;re done being the product.{"\n"}
            Done trading your dreams for dopamine hits. Done with algorithms deciding what you want. Your future self
            will thank you.
          </Text>
          <Pressable
            style={styles.defendButton}
            onPress={() => {
              /* TODO: Start block logic */
            }}
          >
            <Text style={styles.defendButtonText}>START THE BLOCK</Text>
          </Pressable>
          <Text style={styles.fyi}>
            FYI: once you start the block, there is NO way to end it until it&rsquo;s over. O ya, you heard that right.
          </Text>
        </View>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 100,
    backgroundColor: "rgba(0,0,0,0.45)",
    justifyContent: "center",
    alignItems: "center",
  },
  bg: {
    width: 340,
    borderRadius: 28,
    overflow: "hidden",
  },
  bgImage: {
    borderRadius: 28,
    resizeMode: "cover",
  },
  container: {
    padding: 28,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 28,
    backgroundColor: "rgba(0,0,0,0.00)",
  },
  closeButton: {
    position: "absolute",
    top: 18,
    right: 18,
    zIndex: 10,
    padding: 8,
  },
  closeIcon: {
    width: 32,
    height: 32,
    tintColor: "#564110",
  },
  title: {
    fontSize: 36,
    fontFamily: "Vollkorn-Bold",
    color: "#564110",
    textAlign: "center",
    marginTop: 8,
    marginBottom: 8,
    letterSpacing: 2,
  },
  arrow: {
    width: 120,
    height: 40,
    resizeMode: "contain",
    marginVertical: 8,
  },
  body: {
    fontSize: 18,
    fontFamily: "Vollkorn-Bold",
    color: "#564110",
    textAlign: "center",
    marginVertical: 16,
    lineHeight: 30,
  },
  defendButton: {
    backgroundColor: "#564110",
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 32,
    alignItems: "center",
    marginTop: 8,
    marginBottom: 12,
    width: "100%",
  },
  defendButtonText: {
    color: "#F9E7B0",
    fontFamily: "Vollkorn-Bold",
    fontSize: 18,
    textAlign: "center",
  },
  fyi: {
    fontSize: 12,
    color: "#564110",
    fontFamily: "Vollkorn-Regular",
    textAlign: "center",
    marginTop: 8,
    marginBottom: 2,
  },
});
