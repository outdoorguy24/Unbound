import { ScreenContainer } from "@/components/ui/ScreenContainer";
import { SPACING } from "@/constants/theme";
import { useAuth } from "@/contexts/AuthContext";
import { useOnboarding } from "@/contexts/OnboardingContext";
import { saveUserProfile } from "@/lib/supabaseUserProfile";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Image,
  ImageBackground,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function ScreenProfileSetup() {
  const { user } = useAuth();
  const router = useRouter();
  const { traps, scrollTimes, concerns } = useOnboarding();
  const [firstName, setFirstName] = useState("");
  const [city, setCity] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isValidName = (name: string) => {
    const trimmed = name.trim();
    return trimmed.length >= 2 && /^[A-Za-z\s'-]+$/.test(trimmed);
  };
  
  const isValidCity = (city: string) => {
    const trimmed = city.trim();
    return trimmed.length >= 2 && /^[A-Za-z\s'-]+$/.test(trimmed);
  };

  const canSubmit = isValidName(firstName) && isValidCity(city);

  const handleSubmit = async () => {
    if (!user?.id) return;
    setLoading(true);
    setError(null);
    try {
      await saveUserProfile(user.id, firstName.trim(), city.trim(), {
        traps,
        scrollTimes,
        concerns,
      });
      router.replace("/(onboarding)/Screen13");
    } catch (e: any) {
      setError(e.message || "Failed to save profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ImageBackground source={require("../../assets/images/parchment-bg.png")} style={styles.bg} resizeMode="cover">
      <ScreenContainer style={styles.screenContainer}>
        <View style={styles.container}>
          <Text style={styles.heading}>SMART MOVE.</Text>
          <Text style={styles.description}>
            Welcome to the crew. Please give{`\n`}us a little info about you so we{`\n`}can match you with an{`\n`}
            accountability partner.
          </Text>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>First Name *</Text>
            <TextInput
              style={styles.input}
              placeholder="First Name"
              value={firstName}
              onChangeText={setFirstName}
              autoCapitalize="words"
              autoCorrect={false}
              maxLength={32}
              placeholderTextColor="#7A5A2F"
            />
          </View>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>City *</Text>
            <TextInput
              style={styles.input}
              placeholder="City"
              value={city}
              onChangeText={setCity}
              autoCapitalize="words"
              autoCorrect={false}
              maxLength={32}
              placeholderTextColor="#7A5A2F"
            />
          </View>
          {error && <Text style={styles.error}>{error}</Text>}
          <TouchableOpacity
            style={[styles.button, !canSubmit && styles.buttonDisabled]}
            onPress={handleSubmit}
            disabled={!canSubmit || loading}
          >
            {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Submit</Text>}
          </TouchableOpacity>
          <View style={{ flex: 1 }} />
          <View style={styles.fireWrap}>
            <Image source={require("../../assets/images/fire.png")} style={styles.fire} />
          </View>
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
  screenContainer: {
    backgroundColor: 'transparent',
    paddingHorizontal: 0,
    paddingTop: 0,
  },
  container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 14.4,
    alignItems: "center",
  },
  heading: {
    fontSize: 36,
    fontWeight: "bold",
    color: "#2C1A05",
    fontFamily: "Vollkorn-Bold",
    marginBottom: 16,
    marginTop: SPACING.xl,
    textAlign: "center",
  },
  description: {
    fontSize: 20,
    color: "#4B3415",
    fontFamily: "Vollkorn-Bold",
    textAlign: "center",
    marginBottom: 32,
    marginHorizontal: 8,
    lineHeight: SPACING.xl,
  },
  inputGroup: {
    width: "100%",
    marginBottom: 24,
  },
  label: {
    fontSize: 20,
    color: "#2C1A05",
    fontWeight: "bold",
    fontFamily: "Vollkorn-Bold",
    marginBottom: 6,
  },
  input: {
    borderWidth: 2,
    borderColor: "#2C1A05",
    borderRadius: 10,
    padding: 14,
    fontSize: 18,
    color: "#2C1A05",
    fontFamily: "Vollkorn-Regular",
    backgroundColor: "rgba(255,255,255,0.5)",
  },
  button: {
    backgroundColor: "#265C28",
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 24,
    width: "100%",
    alignItems: "center",
    marginTop: 8,
    marginBottom: 16,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonText: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "bold",
    fontFamily: "Vollkorn-Bold",
  },
  error: {
    color: "red",
    marginBottom: 12,
    textAlign: "center",
  },
  fireWrap: {
    width: "100%",
    alignItems: "center",
    marginBottom: 32,
    marginTop: 8,
  },
  fire: {
    width: 200,
    height: 200,
    resizeMode: "contain",
    alignSelf: "center",
    marginTop: 0,
    marginBottom: 0,
  },
});
