import { useRouter } from 'expo-router';
import { useEffect } from 'react';
import { Dimensions, StyleSheet, Text, View } from 'react-native';
import OnboardingIllustration from '../components/OnboardingIllustration';

const heading = "YOU COME FROM WHO HUNTED ON OPEN PLAINS. WHO STARTED FIRES WITH STONE. WHO TOLD STORIES UNDER STARS.";
const subheading = "NOW WE SCROLL. WE SWIPE. WE SIT.";
const body = "THE WORLD HAS CHANGED BUT THE FIRE INSIDE YOU HASN'T.";

export default function Screen1() {
  const router = useRouter();
  useEffect(() => { /* logScreenView('Onboarding1'); */ }, []);
  return (
    <View style={[styles.container, { flex: 1 }]}>
      <Text style={styles.heading}>{heading}</Text>
      <OnboardingIllustration />
      <Text style={styles.subheading}>{subheading}</Text>
      <Text style={styles.body}>{body}</Text>
    </View>
  );
}

const { width } = Dimensions.get('window');
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3E2C7',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  heading: {
    color: '#2C1A05',
    fontFamily: 'Vollkorn-Bold',
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 18,
    marginTop: 24,
    textTransform: 'uppercase',
    letterSpacing: 1.2,
    lineHeight: 32,
  },
  subheading: {
    color: '#2C1A05',
    fontFamily: 'Vollkorn-Bold',
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 18,
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 1.1,
    lineHeight: 28,
  },
  body: {
    color: '#2C1A05',
    fontFamily: 'Vollkorn-Bold',
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 8,
    marginBottom: 24,
    textTransform: 'uppercase',
    letterSpacing: 1.1,
    lineHeight: 28,
  },
  button: {
    backgroundColor: '#5C3D18',
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 16,
  },
  buttonText: {
    color: '#F3E2C7',
    fontSize: 18,
    fontWeight: 'bold',
    fontFamily: 'Vollkorn-Bold',
  },
}); 