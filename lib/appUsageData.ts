
export interface AppUsageData {
  appId: string;
  appName: string;
  usageMinutes: number;
  category?: string;
}

/**
 * Collect app usage data from ScreenTime API and store in Supabase
 * This function will be called periodically to collect fresh app usage data
 */
export async function collectAndStoreAppUsageData(userId: string): Promise<AppUsageData[]> {
  try {
    console.log('Collecting app usage data from ScreenTime API...');
    
    // TODO: Implement real ScreenTime API data collection
    // This will need to be implemented when the app is live on App Store
    // and ScreenTime APIs are working properly
    
    // For now, return empty array
    // In the future, this should:
    // 1. Call ScreenTime API to get app usage data
    // 2. Format the data into AppUsageData interface
    // 3. Store in Supabase using storeAppUsageData()
    // 4. Return the formatted data
    
    console.log('ScreenTime API data collection not yet implemented');
    return [];
    
  } catch (error) {
    console.error('Error collecting app usage data:', error);
    return [];
  }
}

/**
 * Get app usage data from ScreenTime API (real-time)
 * This will be used to display current app usage without storing
 */
export async function getCurrentAppUsageData(): Promise<AppUsageData[]> {
  try {
    console.log('Getting current app usage data from ScreenTime API...');
    
    // TODO: Implement real ScreenTime API data fetching
    // This should call the native ScreenTime APIs to get current usage data
    
    console.log('ScreenTime API data fetching not yet implemented');
    return [];
    
  } catch (error) {
    console.error('Error getting current app usage data:', error);
    return [];
  }
}

/**
 * Format app usage data for display in the UI
 */
export function formatAppUsageDataForDisplay(apps: AppUsageData[]): any[] {
  return apps.map(app => ({
    id: app.appId,
    name: app.appName,
    icon: getAppIcon(app.appName),
    minutes: app.usageMinutes,
  }));
}

/**
 * Get app icon based on app name
 * This should be expanded to handle more apps
 */
function getAppIcon(appName: string): any {
  const iconMap: { [key: string]: any } = {
    'facebook': require("../assets/new-images/facebook-icon.png"),
    'youtube': require("../assets/new-images/youtube-icon.png"),
    'instagram': require("../assets/new-images/instagram.png"),
    'linkedin': require("../assets/new-images/linkedin-icon.png"),
    'telegram': require("../assets/new-images/telegram-icon.png"),
    'twitter': require("../assets/new-images/twitter-icon.png"),
    'tiktok': require("../assets/new-images/tiktok-icon.png"),
    'snapchat': require("../assets/new-images/snapchat-icon.png"),
    'whatsapp': require("../assets/new-images/whatsapp-icon.png"),
    'messenger': require("../assets/new-images/messenger-icon.png"),
  };
  
  const normalizedName = appName.toLowerCase().replace(/\s+/g, '');
  return iconMap[normalizedName] || require("../assets/new-images/facebook-icon.png"); // fallback
}

/**
 * Schedule periodic app usage data collection
 * This should be called when the app becomes active
 */
export async function scheduleAppUsageDataCollection(userId: string): Promise<void> {
  try {
    console.log('Scheduling app usage data collection...');
    
    // TODO: Implement periodic data collection
    // This should:
    // 1. Set up a timer to collect data every hour/day
    // 2. Only collect if user has granted ScreenTime permissions
    // 3. Store data in Supabase for dashboard display
    
    console.log('App usage data collection scheduling not yet implemented');
    
  } catch (error) {
    console.error('Error scheduling app usage data collection:', error);
  }
}
