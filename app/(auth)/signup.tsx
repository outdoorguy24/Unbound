import { ScreenContainer } from "@/components/ui/ScreenContainer";
import { COLORS, SPACING } from "@/constants/theme";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabaseClient";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
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

export default function SignupScreen() {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGoogleSignup = async () => {
    try {
      setIsLoading(true);
      await login();
    } catch (err: any) {
      setError(err.message || "Signup failed");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignup = async () => {
    setIsLoading(true);
    setError(null);
    
    // Validate email
    if (!email || !email.includes('@')) {
      setError('Please enter a valid email address');
      setIsLoading(false);
      return;
    }
    
    // Validate password
    if (!password || password.length < 4) {
      setError('Password must be at least 4 characters long');
      setIsLoading(false);
      return;
    }
    
    try {
      const { data, error } = await supabase.auth.signUp({
        email: email,
        password: password,
      });
      
      if (error) {
        if (error.message.includes('already registered')) {
          setError('An account with this email already exists. Please login instead.');
        } else {
          setError(error.message || 'Signup failed. Please try again.');
        }
        // Reset fields on error
        setEmail('');
        setPassword('');
      } else {
        // Signup successful - user will be automatically logged in
        // The AuthContext will handle the redirect to onboarding
      }
    } catch (err: any) {
      setError('Network error. Please check your connection and try again.');
      // Reset fields on error
      setEmail('');
      setPassword('');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ImageBackground source={require("../../assets/images/parchment-bg.png")} style={styles.bg} resizeMode="cover">
      <ScreenContainer style={{ backgroundColor: 'transparent', paddingHorizontal: 0, paddingTop: 0 }}>
        <View style={styles.container}>
          <Text style={styles.heading} numberOfLines={1}>Create Account</Text>
          <TouchableOpacity style={styles.googleBtn} onPress={handleGoogleSignup} disabled={isLoading}>
            <Image source={require("../../assets/images/google.png")} style={styles.googleIcon} />
            <Text style={styles.googleBtnText} numberOfLines={1}>Continue with Google</Text>
          </TouchableOpacity>
          <Text style={styles.divider} numberOfLines={1}>or manually</Text>
          {error && <Text style={styles.error} numberOfLines={2}>{error}</Text>}
          <View style={styles.inputGroup}>
            <Text style={styles.label} numberOfLines={1}>Email Address</Text>
            <TextInput
              style={styles.input}
              placeholder="Email Address"
              placeholderTextColor="#7A5A2F"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
            />
          </View>
          <View style={styles.inputGroup}>
            <Text style={styles.label} numberOfLines={1}>Password</Text>
            <View style={styles.passwordInputWrap}>
              <TextInput
                style={[styles.input, { paddingRight: 40 }]}
                placeholder="Password"
                placeholderTextColor="#7A5A2F"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                autoCapitalize="none"
              />
              <TouchableOpacity onPress={() => setShowPassword((v) => !v)} style={styles.eyeBtnAbsolute}>
                <MaterialCommunityIcons
                  name={showPassword ? "eye-off-outline" : "eye-outline"}
                  size={24}
                  color="#7A5A2F"
                />
              </TouchableOpacity>
            </View>
          </View>
          <TouchableOpacity style={styles.createBtn} onPress={handleSignup} disabled={isLoading}>
            {isLoading ? <ActivityIndicator color="#fff" /> : <Text style={styles.createBtnText} numberOfLines={1}>Create Account</Text>}
          </TouchableOpacity>
          <Text style={styles.loginRow} numberOfLines={2}>
            Already have an account ?{" "}
            <Text style={styles.loginLink} numberOfLines={1} onPress={() => router.push("/(auth)/login")}>Login</Text>
          </Text>
          <View style={{ flex: 1 }} />
          <View style={styles.mountainWrap}>
            <Image source={require("../../assets/images/mountain.png")} style={styles.mountain} />
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
  container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 48,
    alignItems: "center",
  },
  heading: {
    fontSize: 36,
    fontWeight: "bold",
    color: "#2C1A05",
    fontFamily: "Vollkorn-Bold",
    marginBottom: SPACING.xl,
    marginTop: SPACING.xl,
    textAlign: "center",
  },
  googleBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#112710",
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 24,
    width: "100%",
    marginTop: SPACING.md,
    marginBottom: SPACING.sm,
  },
  googleIcon: {
    width: 28,
    height: 28,
    marginRight: 16,
    resizeMode: "contain",
  },
  googleBtnText: {
    color: COLORS.textGold,
    fontSize: 20,
    fontWeight: "bold",
    fontFamily: "Vollkorn-Bold",
  },
  divider: {
    fontSize: 18,
    color: "#2C1A05",
    fontWeight: "bold",
    fontFamily: "Vollkorn-Bold",
    marginVertical: 18,
    textAlign: "center",
    marginBottom: SPACING.xl,
  },
  inputGroup: {
    width: "100%",
    marginBottom: SPACING.xl,
  },
  label: {
    fontSize: 18,
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
    fontSize: 16,
    color: "#2C1A05",
    fontFamily: "Vollkorn-Regular",
    backgroundColor: "rgba(255,255,255,0.5)",
  },
  passwordInputWrap: {
    position: "relative",
    width: "100%",
    justifyContent: "center",
  },
  eyeBtnAbsolute: {
    position: "absolute",
    right: 10,
    top: 0,
    bottom: 0,
    justifyContent: "center",
    height: "100%",
    zIndex: 2,
    padding: 8,
  },
  createBtn: {
    backgroundColor: "#265C28",
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 24,
    width: "100%",
    alignItems: "center",
    marginTop: SPACING.md,
    marginBottom: SPACING.xl,
  },
  createBtnText: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
    fontFamily: "Vollkorn-Bold",
  },
  loginRow: {
    fontSize: 18,
    color: "#2C1A05",
    fontFamily: "Vollkorn-Bold",
    marginBottom: 16,
    textAlign: "center",
  },
  loginLink: {
    color: "#265C28",
    fontWeight: "bold",
    textDecorationLine: "underline",
    fontFamily: "Vollkorn-Bold",
  },
  error: {
    color: "red",
    marginBottom: 12,
    textAlign: "center",
  },
  mountainWrap: {
    width: "100%",
    alignItems: "center",
    marginBottom: 32,
    marginTop: 8,
  },
  mountain: {
    width: 207,
    height: 80,
    resizeMode: "contain",
    alignSelf: "center",
    marginTop: 0,
    marginBottom: SPACING.xl,
  },
});
