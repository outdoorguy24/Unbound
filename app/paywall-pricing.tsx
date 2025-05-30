import React, { useEffect } from 'react';
import { Dimensions, Linking, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
// import analytics from '@react-native-firebase/analytics'; // Uncomment when Firebase is set up
import { useRouter } from 'expo-router';
import { logScreenView } from './_firebase';

const heading = "Unlock Unbound";
const badge = "7-DAY FREE TRIAL";
const monthly = "$2/mo";
const yearly = "$20/year";
const termsUrl = 'https://yourdomain.com/terms';
const privacyUrl = 'https://yourdomain.com/privacy';

export default function PaywallPricing() {
  const router = useRouter();
  useEffect(() => {
    logScreenView('PaywallPricing');
    // analytics().logScreenView({ screen_name: 'PaywallPricing' });
  }, []);
  return (
    <View style={styles.container}>
      <View style={styles.placeholder} />
      <Text style={styles.heading}>{heading}</Text>
      <View style={styles.badge}><Text style={styles.badgeText}>{badge}</Text></View>
      <View style={styles.pricingRow}>
        <View style={styles.pricingBox}><Text style={styles.pricingText}>{monthly}</Text></View>
        <View style={styles.pricingBox}><Text style={styles.pricingText}>{yearly}</Text></View>
      </View>
      <TouchableOpacity style={styles.button} onPress={() => router.push('/signup')}>
        <Text style={styles.buttonText}>Start 7-Day Free Trial</Text>
      </TouchableOpacity>
      <View style={styles.linksRow}>
        <Text style={styles.link} onPress={() => Linking.openURL(termsUrl)}>Terms of Service</Text>
        <Text style={styles.link} onPress={() => Linking.openURL(privacyUrl)}>Privacy Policy</Text>
        <Text style={styles.link} onPress={() => {/* TODO: Restore purchase logic */}}>Restore Purchase</Text>
      </View>
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
  placeholder: {
    width: width * 0.7,
    height: width * 0.2,
    backgroundColor: '#4B3415',
    borderRadius: 24,
    marginBottom: 24,
  },
  heading: {
    color: '#2C1A05',
    fontFamily: 'Vollkorn-Bold',
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 16,
    textTransform: 'uppercase',
    letterSpacing: 1.2,
    lineHeight: 32,
  },
  badge: {
    backgroundColor: '#265C28',
    borderRadius: 16,
    paddingHorizontal: 18,
    paddingVertical: 6,
    marginBottom: 18,
  },
  badgeText: {
    color: '#F3E2C7',
    fontWeight: 'bold',
    fontSize: 16,
    letterSpacing: 1.1,
  },
  pricingRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 24,
  },
  pricingBox: {
    backgroundColor: '#4B3415',
    borderRadius: 12,
    paddingHorizontal: 24,
    paddingVertical: 16,
    marginHorizontal: 8,
  },
  pricingText: {
    color: '#F3E2C7',
    fontSize: 20,
    fontWeight: 'bold',
    fontFamily: 'Vollkorn-Bold',
  },
  button: {
    backgroundColor: '#5C3D18',
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 8,
    marginTop: 16,
    marginBottom: 24,
  },
  buttonText: {
    color: '#F3E2C7',
    fontSize: 18,
    fontWeight: 'bold',
    fontFamily: 'Vollkorn-Bold',
  },
  linksRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 12,
    flexWrap: 'wrap',
  },
  link: {
    color: '#265C28',
    fontSize: 14,
    fontWeight: 'bold',
    marginHorizontal: 8,
    textDecorationLine: 'underline',
  },
}); 