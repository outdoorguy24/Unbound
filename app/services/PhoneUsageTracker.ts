import { recordPhoneUsageData } from "@/lib/userTracking";
import { AppState, AppStateStatus } from "react-native";
import ScreenTimeManager from "./ScreenTimeManager";

class PhoneUsageTrackerService {
  private static instance: PhoneUsageTrackerService;
  private isTracking = false;
  private lastCollectionDate: string | null = null;
  private collectionInterval: NodeJS.Timeout | null = null;
  private currentUserId: string | null = null;

  static getInstance(): PhoneUsageTrackerService {
    if (!PhoneUsageTrackerService.instance) {
      PhoneUsageTrackerService.instance = new PhoneUsageTrackerService();
    }
    return PhoneUsageTrackerService.instance;
  }

  async startTracking(userId: string) {
    if (this.isTracking) {
      console.log("Phone usage tracking already started");
      return;
    }

    this.isTracking = true;
    this.currentUserId = userId;
    console.log("Starting phone usage tracking for user:", userId);

    // Set up app state listener to collect data when app becomes active
    AppState.addEventListener("change", this.handleAppStateChange);

    // Set up weekly collection interval (check every day at 9 AM)
    this.setupWeeklyCollection(userId);

    // Collect initial data if needed
    await this.collectWeeklyData(userId);
  }

  stopTracking() {
    if (!this.isTracking) {
      return;
    }

    this.isTracking = false;
    this.currentUserId = null;
    console.log("Stopping phone usage tracking");

    // Remove app state listener
    AppState.removeEventListener("change", this.handleAppStateChange);

    // Clear collection interval
    if (this.collectionInterval) {
      clearInterval(this.collectionInterval);
      this.collectionInterval = null;
    }
  }

  private handleAppStateChange = async (nextAppState: AppStateStatus) => {
    if (nextAppState === "active" && this.currentUserId) {
      // App became active, check if we need to collect data
      console.log("App became active, checking for data collection");
      await this.collectWeeklyData(this.currentUserId);
    }
  };

  private setupWeeklyCollection(userId: string) {
    // Check every hour if it's time to collect weekly data
    this.collectionInterval = setInterval(async () => {
      const now = new Date();
      const currentHour = now.getHours();
      const currentDate = now.toISOString().split("T")[0];

      // Collect data once per day at 9 AM
      if (currentHour === 9 && this.lastCollectionDate !== currentDate) {
        await this.collectWeeklyData(userId);
        this.lastCollectionDate = currentDate;
      }
    }, 60 * 60 * 1000); // Check every hour
  }

  private async collectWeeklyData(userId: string) {
    try {
      console.log("Collecting weekly phone usage data for user:", userId);

      // Check if Screen Time is available
      if (!ScreenTimeManager.isAvailable()) {
        console.log("Screen Time not available, skipping data collection");
        return;
      }

      // Check authorization status
      const authStatus = await ScreenTimeManager.getAuthorizationStatus();
      if (!authStatus.isAuthorized) {
        console.log("Screen Time not authorized, skipping data collection");
        return;
      }

      // Fetch weekly usage data
      const weeklyData = await ScreenTimeManager.getWeeklyScreenTimeUsage();
      console.log(
        "📊 RAW NATIVE MODULE DATA:",
        JSON.stringify(weeklyData, null, 2)
      );

      const usageData = {
        totalScreenTimeMinutes: weeklyData.totalScreenTimeMinutes || 0,
        socialMediaMinutes: weeklyData.socialMediaMinutes || 0,
        entertainmentMinutes: weeklyData.entertainmentMinutes || 0,
        productivityMinutes: weeklyData.productivityMinutes || 0,
        otherMinutes: weeklyData.otherMinutes || 0,
        isBaseline: false, // This is weekly data, not baseline
      };

      // Record the weekly usage data
      await recordPhoneUsageData(userId, usageData);
      console.log(
        "📊 EXACT SCREEN TIME DATA SAVED TO DB:",
        JSON.stringify(usageData, null, 2)
      );
    } catch (error) {
      console.error("Failed to collect weekly phone usage data:", error);
    }
  }

  // Manual data collection method (can be called from dashboard refresh)
  async collectDataNow(userId: string) {
    await this.collectWeeklyData(userId);
  }

  // Get the last collection date
  getLastCollectionDate(): string | null {
    return this.lastCollectionDate;
  }

  // Check if tracking is active
  isTrackingActive(): boolean {
    return this.isTracking;
  }
}

export default PhoneUsageTrackerService.getInstance();
