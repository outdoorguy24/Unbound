import { ScreenContainer } from "@/components/ui/ScreenContainer";
import { SPACING } from "@/constants/theme";
import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { Alert, Image, ImageBackground, Linking, Platform, StyleSheet, Text, TouchableOpacity, View } from "react-native";

// Contact information
const CONTACT_PHONE = process.env.EXPO_PUBLIC_CONTACT_PHONE || "+19164207262"; // Unbound contact number
const CONTACT_EMAIL = "howdy@unboundapp.live";
const EMAIL_SUBJECT = "Thoughts about Unbound";
const EMAIL_BODY = ""; // Empty body text

export default function FounderScreen() {
  const router = useRouter();
  
  const handleSendText = () => {
    // Format the phone number to ensure it works on all devices
    const formattedPhone = CONTACT_PHONE.replace(/[^\d+]/g, '');
    Linking.openURL(`sms:${formattedPhone}`);
  };

  const handleEmail = async () => {
    // Encode the email parameters
    const emailUrl = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(EMAIL_SUBJECT)}&body=${encodeURIComponent(EMAIL_BODY)}`;
    
    // Different URL schemes for Gmail
    const gmailUrls = Platform.select({
      ios: [
        // Try different known Gmail URL schemes for iOS
        `googlegmail:///co?to=${CONTACT_EMAIL}`,
        `googlegmail://co?to=${CONTACT_EMAIL}`,
        `gmail://co?to=${CONTACT_EMAIL}`,
      ],
      android: [`googlegmail://co?to=${CONTACT_EMAIL}`]
    }) || [];

    try {
      // Check if Gmail is available first
      let canOpenGmail = false;
      let workingGmailUrl = '';
      
      // Try each Gmail URL scheme
      for (const url of gmailUrls) {
        try {
          const canOpen = await Linking.canOpenURL(url);
          if (canOpen) {
            canOpenGmail = true;
            workingGmailUrl = url;
            break;
          }
        } catch (e) {
          console.log('Error checking URL:', url, e);
        }
      }

      // If Gmail is available, show choice dialog
      if (canOpenGmail) {
        Alert.alert(
          'Choose Email App',
          'Which email app would you like to use?',
          [
            {
              text: 'Gmail',
              onPress: () => {
                const fullGmailUrl = `${workingGmailUrl}&subject=${encodeURIComponent(EMAIL_SUBJECT)}&body=${encodeURIComponent(EMAIL_BODY)}`;
                Linking.openURL(fullGmailUrl).catch(() => {
                  // Fallback to default mail if Gmail fails
                  Linking.openURL(emailUrl);
                });
              }
            },
            {
              text: 'Mail',
              onPress: () => Linking.openURL(emailUrl)
            },
            {
              text: 'Cancel',
              style: 'cancel'
            }
          ]
        );
      } else {
        // If Gmail is not available, just open default mail
        await Linking.openURL(emailUrl);
      }
    } catch (error) {
      console.log('Email error:', error);
      Alert.alert(
        'Error',
        'Could not open email app. Please make sure you have an email app installed.',
        [{ text: 'OK' }]
      );
    }
  };

  return (
    <ImageBackground source={require("../../assets/images/parchment-bg.png")} style={styles.bg}>
      <ScreenContainer style={{ backgroundColor: 'transparent', paddingHorizontal: 0, paddingTop: 0 }}>
        <View style={styles.headerRow}>
          <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
            <View style={styles.backCircle}>
              <Feather name="arrow-left" size={22} color="#F9E7B0" />
            </View>
          </TouchableOpacity>
          <Text style={styles.header} numberOfLines={1}>Talk with the Founder</Text>
        </View>
        <View style={styles.content}>
          <Image source={require("../../assets/images/founder.png")} style={styles.founderImg} />
          <Text style={styles.intro} numberOfLines={2}>
            I&rsquo;m <Text style={styles.name}>Alex</Text>, the founder of Unbound.
          </Text>
          <Text style={styles.body} numberOfLines={6}>
            This picture makes my beard and hairline look way better than it is, but I&rsquo;ll take it. I built Unbound
            because with a young family and plenty of goals, I was done watching my time disappear into a screen.
            I&rsquo;m glad you&rsquo;re here & would love to hear from you.
          </Text>
          <View style={styles.messageBox}>
            <Text style={styles.messageText} numberOfLines={3}>
              Feel free to <Text style={styles.messageHighlight}>send me your best joke</Text>, suggest a feature, or give
              feedback.
            </Text>
          </View>
          <TouchableOpacity style={styles.actionBtn} onPress={handleSendText}>
            <Image source={require("../../assets/images/message.png")} style={styles.actionIcon} />
            <Text style={styles.actionBtnText} numberOfLines={1}>Send a Text</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionBtn, { marginTop: 18 }]}
            onPress={handleEmail}
          >
            <Image source={require("../../assets/images/email.png")} style={styles.actionIcon} />
            <Text style={styles.actionBtnText} numberOfLines={1}>Email Me</Text>
          </TouchableOpacity>
        </View>
      </ScreenContainer>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  bg: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: SPACING.xxxl,
    marginBottom: 0,
    paddingHorizontal: 18,
  },
  backBtn: {
    padding: 0,
    marginRight: 16,
  },
  backCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#564110",
    borderWidth: 1.5,
    borderColor: "#E6D3A7",
    alignItems: "center",
    justifyContent: "center",
  },
  header: {
    fontSize: 27,
    fontFamily: "Vollkorn-Bold",
    color: "#2C1A05",
    textAlign: "left",
    flex: 1,
    marginLeft: SPACING.sm,
  },
  content: {
    flex: 1,
    alignItems: "center",
    paddingHorizontal: SPACING.lg,
    marginTop: SPACING.sm,
  },
  founderImg: {
    width: 180,
    height: 180,
    resizeMode: "contain",
    marginVertical: 12,
  },
  intro: {
    fontSize: 20,
    fontFamily: "Vollkorn-Bold",
    color: "#2C1A05",
    textAlign: "center",
    marginTop: SPACING.sm,
    marginBottom: SPACING.sm,
  },
  name: {
    color: "#3D7A4C",
    fontFamily: "Vollkorn-Bold",
  },
  body: {
    fontSize: 18,
    fontFamily: "Vollkorn-SemiBold",
    color: "#2C1A05",
    textAlign: "center",
    marginBottom: SPACING.md,
    marginTop: 0,
    lineHeight: 26,
  },
  messageBox: {
    backgroundColor: "#F9E7B0",
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: "#E6D3A7",
    paddingVertical: 18,
    paddingHorizontal: 18,
    marginBottom: 24,
    marginTop: 0,
    width: "100%",
  },
  messageText: {
    fontSize: 17,
    fontFamily: "Vollkorn-Bold",
    color: "#2C1A05",
    textAlign: "center",
  },
  messageHighlight: {
    color: "#3D7A4C",
    fontFamily: "Vollkorn-Bold",
  },
  actionBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#3D7A4C",
    borderRadius: SPACING.md,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.lg,
    marginHorizontal: SPACING.md,
    marginTop: 0,
    width: "100%",
    justifyContent: "center",
  },
  actionIcon: {
    width: 20,
    height: 20,
    resizeMode: "contain",
    marginRight: 14,
    tintColor: "#F9E7B0",
  },
  actionBtnText: {
    color: "#F9E7B0",
    fontFamily: "Vollkorn-Bold",
    fontSize: 18,
    textAlign: "center",
  },
});
