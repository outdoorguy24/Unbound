import { NativeModules } from 'react-native';

const { ScreenTimeManager } = NativeModules;

interface ScreenTimeManagerModule {
  requestAuthorization(type: string): Promise<boolean>;
  getAuthorizationStatus(): Promise<{ status: 'approved' | 'denied' | 'notDetermined' | 'unknown'; isAuthorized: boolean }>;
  displayFamilyActivityPicker(options: { headerText: string }): Promise<{ selection?: string }>;
  setActivitySelection(selectionString: string): Promise<boolean>;
  removeActivitySelection(): Promise<boolean>;
  setAdultContentFilter(enabled: boolean): Promise<{ success: boolean; enabled: boolean }>;
  getAdultContentFilterStatus(): Promise<{ enabled: boolean; error?: string }>;
}

if (!ScreenTimeManager) {
  console.error(
    'Native module "ScreenTimeManager" not found. Make sure you have linked the library and rebuilt the app.'
  );
}

export default ScreenTimeManager as ScreenTimeManagerModule; 