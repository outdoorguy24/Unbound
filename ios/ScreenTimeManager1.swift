//
//  ScreenTimeManager.swift
//  nativeModule
//
//  Created by Mehroz Afzal on 10/06/2025.
//
import Foundation
import FamilyControls
import DeviceActivity
import ManagedSettings
import ManagedSettingsUI
import SwiftUI
import UIKit

@objc(ScreenTimeManager)
class ScreenTimeManager: NSObject, UIAdaptivePresentationControllerDelegate {
    private let store = ManagedSettingsStore()
    private let center = DeviceActivityCenter()

    private var pickerResolve: RCTPromiseResolveBlock?
    private var pickerReject: RCTPromiseRejectBlock?
    private var currentSelection = FamilyActivitySelection()

    private let appBundleIdentifier = "com.starrman.unbound"

    @objc
    override init() {
        super.init()
        print("[ScreenTimeManager] Initialized")
    }

    @objc
    func requestAuthorization(_ type: String,
                              resolver resolve: @escaping RCTPromiseResolveBlock,
                              rejecter reject: @escaping RCTPromiseRejectBlock) {
        print("[ScreenTimeManager] requestAuthorization called with type: \(type)")
        Task { @MainActor in
            do {
                if #available(iOS 16.0, *) {
                    try await AuthorizationCenter.shared.requestAuthorization(for: .individual)
                    print("[ScreenTimeManager] Family Controls authorization successful")
                    resolve(true)
                } else {
                    reject("UNSUPPORTED_VERSION", "iOS 16.0 or later is required", nil)
                }
            } catch {
                print("[ScreenTimeManager] Authorization failed: \(error)")
                reject("AUTHORIZATION_ERROR", "Authorization failed: \(error.localizedDescription)", error)
            }
        }
    }

    @objc
    func getAuthorizationStatus(_ resolve: @escaping RCTPromiseResolveBlock,
                                 rejecter reject: @escaping RCTPromiseRejectBlock) {
        if #available(iOS 16.0, *) {
            let status = AuthorizationCenter.shared.authorizationStatus
            let isAuthorized = (status == .approved)
            resolve(["status": String(describing: status), "isAuthorized": isAuthorized])
        } else {
            resolve(["status": "notAvailable", "isAuthorized": false])
        }
    }

    @objc
    func setAdultContentFilter(_ enabled: Bool,
                                resolver: @escaping RCTPromiseResolveBlock,
                                rejecter reject: @escaping RCTPromiseRejectBlock) {
        if #available(iOS 16.0, *) {
            if enabled {
                // Set the web content filter
                store.webContent.blockedByFilter = .auto(except: Set<WebDomain>())
                
                // Also set some additional restrictions to ensure Content & Privacy Restrictions toggle is enabled
                // This helps iOS automatically enable the master toggle
                store.media.denyExplicitContent = true
                
                print("[ScreenTimeManager] Adult content filter enabled")
                print("[ScreenTimeManager] NOTE: Ensure 'Content & Privacy Restrictions' toggle is ON in Settings")
            } else {
                // Remove all restrictions
                store.webContent.blockedByFilter = .none
                store.media.denyExplicitContent = false
                print("[ScreenTimeManager] Adult content filter disabled")
            }
            resolver(["success": true, "enabled": enabled])
        } else {
            reject("VERSION_ERROR", "iOS 16.0 or later is required", nil)
        }
    }

    @objc
    func getAdultContentFilterStatus(_ resolve: @escaping RCTPromiseResolveBlock,
                                      rejecter reject: @escaping RCTPromiseRejectBlock) {
        if #available(iOS 16.0, *) {
            let isEnabled: Bool
            switch store.webContent.blockedByFilter {
            case .auto, .specific:
                isEnabled = true
            default:
                isEnabled = false
            }
            resolve(["enabled": isEnabled])
        } else {
            resolve(["enabled": false, "error": "iOS 16.0 or later is required"])
        }
    }

    @objc
    func displayFamilyActivityPicker(_ options: NSDictionary,
                                      resolver resolve: @escaping RCTPromiseResolveBlock,
                                      rejecter reject: @escaping RCTPromiseRejectBlock) {
        if #available(iOS 16.0, *) {
            DispatchQueue.main.async {
                struct PickerView: View {
                    @Binding var selection: FamilyActivitySelection
                    let headerText: String
                    let onDismiss: () -> Void
                    var body: some View {
                        NavigationView {
                            FamilyActivityPicker(selection: $selection)
                                .navigationTitle(headerText)
                                .navigationBarItems(
                                    leading: Button("Cancel", action: onDismiss),
                                    trailing: Button("Done", action: onDismiss))
                        }
                    }
                }
                let headerText = options["headerText"] as? String ?? "Choose Apps to Block"
                let pickerView = PickerView(
                    selection: Binding(get: { self.currentSelection }, set: { self.currentSelection = $0 }),
                    headerText: headerText,
                    onDismiss: {
                        do {
                            let data = try JSONEncoder().encode(self.currentSelection)
                            let selectionString = data.base64EncodedString()
                            resolve(["selection": selectionString])
                        } catch {
                            reject("ENCODING_ERROR", "Failed to encode selection", error)
                        }
                        self.getTopViewController()?.dismiss(animated: true)
                    })
                let hostingController = UIHostingController(rootView: pickerView)
                hostingController.modalPresentationStyle = .formSheet
                self.pickerResolve = resolve
                self.pickerReject = reject
                self.getTopViewController()?.present(hostingController, animated: true)
            }
        } else {
            reject("UNSUPPORTED_VERSION", "iOS 16.0 or later is required", nil)
        }
    }

    @objc
    func setAppDeletionProtection(_ enabled: Bool,
                                  resolver resolve: @escaping RCTPromiseResolveBlock,
                                  rejecter reject: @escaping RCTPromiseRejectBlock) {
        if #available(iOS 16.0, *) {
            store.application.denyAppRemoval = enabled
            print("[ScreenTimeManager] App deletion protection \(enabled ? "enabled" : "disabled")")
            resolve(true)
        } else {
            reject("UNSUPPORTED_VERSION", "iOS 16.0 or later is required", nil)
        }
    }

    @objc
    func setActivitySelection(_ selectionString: String,
                               resolver resolve: @escaping RCTPromiseResolveBlock,
                               rejecter reject: @escaping RCTPromiseRejectBlock) {
        if #available(iOS 16.0, *) {
            guard let data = Data(base64Encoded: selectionString) else {
                reject("DECODING_ERROR", "Invalid Base64 string", nil)
                return
            }
            do {
                let decoded = try JSONDecoder().decode(FamilyActivitySelection.self, from: data)
                self.currentSelection = decoded
                store.shield.applications = decoded.applicationTokens.isEmpty ? nil : decoded.applicationTokens
                store.shield.applicationCategories = decoded.categoryTokens.isEmpty ? nil : .specific(decoded.categoryTokens)
                store.shield.webDomains = decoded.webDomainTokens.isEmpty ? nil : decoded.webDomainTokens
                store.application.denyAppRemoval = true
                print("[ScreenTimeManager] Activity restrictions + deletion block applied")
                resolve(true)
            } catch {
                reject("DECODING_ERROR", "Failed to decode selection", error)
            }
        } else {
            reject("UNSUPPORTED_VERSION", "iOS 16.0 or later is required", nil)
        }
    }

    @objc
    func removeActivitySelection(_ resolve: @escaping RCTPromiseResolveBlock,
                                  rejecter reject: @escaping RCTPromiseRejectBlock) {
        if #available(iOS 16.0, *) {
            store.shield.applications = nil
            store.shield.applicationCategories = nil
            store.shield.webDomains = nil
            store.application.denyAppRemoval = false
            print("[ScreenTimeManager] Restrictions and deletion block removed")
            resolve(true)
        } else {
            reject("UNSUPPORTED_VERSION", "iOS 16.0 or later is required", nil)
        }
    }

    @objc
    func setCurrentSelection(_ selectionString: String,
                              resolver resolve: @escaping RCTPromiseResolveBlock,
                              rejecter reject: @escaping RCTPromiseRejectBlock) {
        if #available(iOS 16.0, *) {
            guard let data = Data(base64Encoded: selectionString) else {
                reject("DECODING_ERROR", "Invalid Base64 string", nil)
                return
            }
            do {
                self.currentSelection = try JSONDecoder().decode(FamilyActivitySelection.self, from: data)
                resolve(true)
            } catch {
                reject("DECODING_ERROR", "Failed to decode selection", error)
            }
        } else {
            reject("UNSUPPORTED_VERSION", "iOS 16.0 or later is required", nil)
        }
    }

    private func getTopViewController() -> UIViewController? {
        guard let scene = UIApplication.shared.connectedScenes.first as? UIWindowScene,
              let window = scene.windows.first else { return nil }
        var top = window.rootViewController
        while let presented = top?.presentedViewController {
            top = presented
        }
        return top
    }

    func presentationControllerDidDismiss(_ presentationController: UIPresentationController) {
        if let resolve = pickerResolve {
            do {
                let data = try JSONEncoder().encode(self.currentSelection)
                let selectionString = data.base64EncodedString()
                resolve(["selection": selectionString])
            } catch {
                resolve(["selection": ""])
            }
        }
        pickerResolve = nil
        pickerReject = nil
    }

    // Screen Time usage data functions
    @objc
    func getScreenTimeUsageData(_ resolve: @escaping RCTPromiseResolveBlock,
                               rejecter reject: @escaping RCTPromiseRejectBlock) {
        if #available(iOS 16.0, *) {
            Task { @MainActor in
                do {
                    let usageData = try await self.fetchScreenTimeUsageData()
                    resolve(usageData)
                } catch {
                    reject("USAGE_DATA_ERROR", "Failed to fetch usage data", error)
                }
            }
        } else {
            reject("UNSUPPORTED_VERSION", "iOS 16.0 or later is required", nil)
        }
    }

    @objc
    func getWeeklyScreenTimeUsage(_ resolve: @escaping RCTPromiseResolveBlock,
                                 rejecter reject: @escaping RCTPromiseRejectBlock) {
        if #available(iOS 16.0, *) {
            Task { @MainActor in
                do {
                    let usageData = try await self.fetchWeeklyScreenTimeUsage()
                    resolve(usageData)
                } catch {
                    reject("WEEKLY_USAGE_ERROR", "Failed to fetch weekly usage data", error)
                }
            }
        } else {
            reject("UNSUPPORTED_VERSION", "iOS 16.0 or later is required", nil)
        }
    }

    @objc
    func getDailyScreenTimeUsage(_ resolve: @escaping RCTPromiseResolveBlock,
                                rejecter reject: @escaping RCTPromiseRejectBlock) {
        if #available(iOS 16.0, *) {
            Task { @MainActor in
                do {
                    let usageData = try await self.fetchDailyScreenTimeUsage()
                    resolve(usageData)
                } catch {
                    reject("DAILY_USAGE_ERROR", "Failed to fetch daily usage data", error)
                }
            }
        } else {
            reject("UNSUPPORTED_VERSION", "iOS 16.0 or later is required", nil)
        }
    }
    
    @objc
    func getMostUsedApps(_ resolve: @escaping RCTPromiseResolveBlock,
                        rejecter reject: @escaping RCTPromiseRejectBlock) {
        if #available(iOS 16.0, *) {
            Task { @MainActor in
                do {
                    let apps = try await self.fetchMostUsedApps()
                    resolve(apps)
                } catch {
                    reject("MOST_USED_APPS_ERROR", "Failed to fetch most used apps", error)
                }
            }
        } else {
            reject("UNSUPPORTED_VERSION", "iOS 16.0 or later is required", nil)
        }
    }

    // MARK: - Helper functions to fetch usage data
    
    @available(iOS 16.0, *)
    private func fetchScreenTimeUsageData() async throws -> [String: Any] {
        // Important: DeviceActivity framework does NOT provide APIs to query historical usage data
        // You need to set up monitoring and collect data through a DeviceActivityMonitor extension
        // For now, we'll start monitoring and return simulated data
        
        let schedule = DeviceActivitySchedule(
            intervalStart: DateComponents(hour: 0, minute: 0),
            intervalEnd: DateComponents(hour: 23, minute: 59),
            repeats: true
        )
        
        let activityName = DeviceActivityName("dailyUsageTracking")
        
        do {
            // Start monitoring with the schedule
            try center.startMonitoring(activityName, during: schedule)
            
            print("[ScreenTimeManager] Started monitoring device activity")
            
            // Note: Actual usage data collection requires a DeviceActivityMonitor extension
            // This returns simulated data for demonstration
            return try await self.collectActualUsageData()
            
        } catch {
            print("[ScreenTimeManager] Failed to start monitoring: \(error)")
            // Return estimated data as fallback
            return self.getEstimatedUsageData()
        }
    }
    
    @available(iOS 16.0, *)
    private func collectActualUsageData() async throws -> [String: Any] {
        // Simulate realistic usage data
        // In production, this data would come from your DeviceActivityMonitor extension
        
        let totalMinutes = Int.random(in: 180...360) // 3-6 hours
        let socialMedia = Int(Double(totalMinutes) * 0.4) // 40% social media
        let entertainment = Int(Double(totalMinutes) * 0.25) // 25% entertainment
        let productivity = Int(Double(totalMinutes) * 0.15) // 15% productivity
        let other = totalMinutes - socialMedia - entertainment - productivity
        
        return [
            "totalScreenTimeMinutes": totalMinutes,
            "socialMediaMinutes": socialMedia,
            "entertainmentMinutes": entertainment,
            "productivityMinutes": productivity,
            "otherMinutes": other,
            "date": ISO8601DateFormatter().string(from: Date()),
            "dataSource": "simulated",
            "note": "Requires DeviceActivityMonitor extension for real data"
        ]
    }
    
    @available(iOS 16.0, *)
    private func fetchMostUsedApps() async throws -> [[String: Any]] {
        // Set up monitoring for app usage tracking
        let schedule = DeviceActivitySchedule(
            intervalStart: DateComponents(hour: 0, minute: 0),
            intervalEnd: DateComponents(hour: 23, minute: 59),
            repeats: true
        )
        
        let activityName = DeviceActivityName("appUsageTracking")
        
        do {
            try center.startMonitoring(activityName, during: schedule)
            print("[ScreenTimeManager] Started monitoring app usage")
        } catch {
            print("[ScreenTimeManager] Failed to start app monitoring: \(error)")
        }
        
        // Return simulated data (would come from DeviceActivityMonitor extension in production)
        return try await self.generateRealisticAppUsageData()
    }
    
    @available(iOS 16.0, *)
    private func generateRealisticAppUsageData() async throws -> [[String: Any]] {
        let apps = [
            [
                "bundleIdentifier": "com.facebook.Facebook",
                "displayName": "Facebook",
                "weeklyUsageMinutes": Int.random(in: 300...600),
                "iconName": "facebook-icon"
            ],
            [
                "bundleIdentifier": "com.google.ios.youtube",
                "displayName": "YouTube",
                "weeklyUsageMinutes": Int.random(in: 180...360),
                "iconName": "youtube-icon"
            ],
            [
                "bundleIdentifier": "ph.telegra.Telegraph",
                "displayName": "Telegram",
                "weeklyUsageMinutes": Int.random(in: 120...240),
                "iconName": "telegram-icon"
            ],
            [
                "bundleIdentifier": "com.linkedin.LinkedIn",
                "displayName": "LinkedIn",
                "weeklyUsageMinutes": Int.random(in: 60...180),
                "iconName": "linkedin-icon"
            ],
            [
                "bundleIdentifier": "com.instagram.ios",
                "displayName": "Instagram",
                "weeklyUsageMinutes": Int.random(in: 240...480),
                "iconName": "instagram-icon"
            ]
        ]
        
        return apps.sorted { (app1, app2) in
            let usage1 = app1["weeklyUsageMinutes"] as? Int ?? 0
            let usage2 = app2["weeklyUsageMinutes"] as? Int ?? 0
            return usage1 > usage2
        }
    }
    
    @available(iOS 16.0, *)
    private func getEstimatedUsageData() -> [String: Any] {
        return [
            "totalScreenTimeMinutes": 240,
            "socialMediaMinutes": 120,
            "entertainmentMinutes": 60,
            "productivityMinutes": 30,
            "otherMinutes": 30,
            "date": ISO8601DateFormatter().string(from: Date()),
            "dataSource": "estimated"
        ]
    }

    @available(iOS 16.0, *)
    private func fetchWeeklyScreenTimeUsage() async throws -> [String: Any] {
        let dailyData = try await self.collectActualUsageData()
        
        let dailyTotal = dailyData["totalScreenTimeMinutes"] as? Int ?? 240
        let weeklyTotal = Int(Double(dailyTotal) * 6.5)
        
        let socialMedia = Int(Double(weeklyTotal) * 0.4)
        let entertainment = Int(Double(weeklyTotal) * 0.25)
        let productivity = Int(Double(weeklyTotal) * 0.15)
        let other = weeklyTotal - socialMedia - entertainment - productivity
        
        let weekStart = Calendar.current.date(byAdding: .day, value: -7, to: Date()) ?? Date()
        
        return [
            "totalScreenTimeMinutes": weeklyTotal,
            "socialMediaMinutes": socialMedia,
            "entertainmentMinutes": entertainment,
            "productivityMinutes": productivity,
            "otherMinutes": other,
            "weekStart": ISO8601DateFormatter().string(from: weekStart),
            "weekEnd": ISO8601DateFormatter().string(from: Date()),
            "dataSource": "simulated"
        ]
    }

    @available(iOS 16.0, *)
    private func fetchDailyScreenTimeUsage() async throws -> [String: Any] {
        return try await self.collectActualUsageData()
    }
}
