import { NativeModules, Platform } from "react-native";

const { ScreenTimeManager: NativeScreenTimeManager } = NativeModules;

class ScreenTimeManagerService {
  isAvailable() {
    return Platform.OS === "ios" && NativeScreenTimeManager != null;
  }

  async requestAuthorization(type = "individual") {
    if (!this.isAvailable()) {
      throw new Error("ScreenTimeManager is not available on this platform");
    }
    return NativeScreenTimeManager.requestAuthorization(type);
  }

  async getAuthorizationStatus() {
    if (!this.isAvailable()) {
      return { status: "notAvailable", isAuthorized: false };
    }
    return NativeScreenTimeManager.getAuthorizationStatus();
  }

  async setAdultContentFilter(enabled: boolean) {
    if (!this.isAvailable()) {
      throw new Error("ScreenTimeManager is not available on this platform");
    }
    return NativeScreenTimeManager.setAdultContentFilter(enabled);
  }

  async getAdultContentFilterStatus() {
    if (!this.isAvailable()) {
      return { enabled: false, error: "Not available on this platform" };
    }
    return NativeScreenTimeManager.getAdultContentFilterStatus();
  }

  async displayFamilyActivityPicker(options = {}) {
    if (!this.isAvailable()) {
      throw new Error("ScreenTimeManager is not available on this platform");
    }
    const defaultOptions = {
      headerText: "Choose Apps to Block",
      ...options,
    };
    return NativeScreenTimeManager.displayFamilyActivityPicker(defaultOptions);
  }

  async setActivitySelection(selection: string) {
    if (!this.isAvailable()) {
      throw new Error("ScreenTimeManager is not available on this platform");
    }
    return NativeScreenTimeManager.setActivitySelection(selection);
  }

  async removeActivitySelection() {
    if (!this.isAvailable()) {
      throw new Error("ScreenTimeManager is not available on this platform");
    }
    return NativeScreenTimeManager.removeActivitySelection();
  }

  async setCurrentSelection(selection: string) {
    if (!this.isAvailable()) {
      throw new Error("ScreenTimeManager is not available on this platform");
    }
    return NativeScreenTimeManager.setCurrentSelection(selection);
  }

  async setAppDeletionProtection(enabled: boolean) {
    if (!this.isAvailable()) {
      throw new Error("ScreenTimeManager is not available on this platform");
    }
    return NativeScreenTimeManager.setAppDeletionProtection(enabled);
  }

  // Screen Time usage data functions
  async getScreenTimeUsageData() {
    if (!this.isAvailable()) {
      throw new Error("ScreenTimeManager is not available on this platform");
    }
    return NativeScreenTimeManager.getScreenTimeUsageData();
  }

  async getWeeklyScreenTimeUsage() {
    if (!this.isAvailable()) {
      throw new Error("ScreenTimeManager is not available on this platform");
    }
    return NativeScreenTimeManager.getWeeklyScreenTimeUsage();
  }

  async getDailyScreenTimeUsage() {
    if (!this.isAvailable()) {
      throw new Error("ScreenTimeManager is not available on this platform");
    }
    return NativeScreenTimeManager.getDailyScreenTimeUsage();
  }

  async getMostUsedApps() {
    if (!this.isAvailable()) {
      throw new Error("ScreenTimeManager is not available on this platform");
    }
    return NativeScreenTimeManager.getMostUsedApps();
  }
}

export default new ScreenTimeManagerService();
