import * as Analytics from 'expo-firebase-analytics';

export async function logScreenView(screenName: string) {
  await Analytics.logEvent('screen_view', { screen_name: screenName });
}

export default Analytics; 