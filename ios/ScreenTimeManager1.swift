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
    
    // Store resolve/reject for picker completion
    private var pickerResolve: RCTPromiseResolveBlock?
    private var pickerReject: RCTPromiseRejectBlock?
    private var currentSelection = FamilyActivitySelection()
    
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
                    // In iOS 16+, authorization is simpler - there's no separate type parameter
                    try await AuthorizationCenter.shared.requestAuthorization(for: .individual)
                    print("[ScreenTimeManager] Authorization successful")
                    resolve(true)
                } else {
                    reject("UNSUPPORTED_VERSION", "iOS 16.0 or later is required", nil)
                }
            } catch {
                print("[ScreenTimeManager] Authorization failed: \(error.localizedDescription)")
                reject("AUTHORIZATION_ERROR", "Authorization failed: \(error.localizedDescription)", error)
            }
        }
    }
    
    @objc
    func getAuthorizationStatus(_ resolve: @escaping RCTPromiseResolveBlock,
                              rejecter reject: @escaping RCTPromiseRejectBlock) {
        print("[ScreenTimeManager] getAuthorizationStatus called")
        
        if #available(iOS 16.0, *) {
            let status = AuthorizationCenter.shared.authorizationStatus
            let statusString: String
            let isAuthorized: Bool
            
            switch status {
            case .notDetermined:
                statusString = "notDetermined"
                isAuthorized = false
            case .denied:
                statusString = "denied"
                isAuthorized = false
            case .approved:
                statusString = "approved"
                isAuthorized = true
            @unknown default:
                statusString = "unknown"
                isAuthorized = false
            }
            
            let result: [String: Any] = [
                "status": statusString,
                "isAuthorized": isAuthorized
            ]
            
            print("[ScreenTimeManager] Authorization status: \(statusString), isAuthorized: \(isAuthorized)")
            resolve(result)
        } else {
            let result: [String: Any] = [
                "status": "notAvailable",
                "isAuthorized": false
            ]
            resolve(result)
        }
    }
    
    // MARK: - Adult Content Filtering
    
@objc
func setAdultContentFilter(_ enabled: Bool,
                         resolver: @escaping RCTPromiseResolveBlock,
                         rejecter reject: @escaping RCTPromiseRejectBlock) {
    print("[ScreenTimeManager] setAdultContentFilter called with enabled: \(enabled)")
    
    if #available(iOS 16.0, *) {
        do {
            if enabled {
                // Enable adult content filtering
                store.webContent.blockedByFilter = .auto(except: Set<WebDomain>())
                print("[ScreenTimeManager] Adult content filter enabled")
            } else {
                // Disable adult content filtering
                store.webContent.blockedByFilter = .none
                print("[ScreenTimeManager] Adult content filter disabled")
            }
            
            // Return the current state
            resolver([
                "success": true,
                "enabled": enabled
            ])
        } catch {
            print("[ScreenTimeManager] Failed to set adult content filter: \(error.localizedDescription)")
            reject("FILTER_ERROR", "Failed to set adult content filter", error)
        }
    } else {
        reject("VERSION_ERROR", "Adult content filtering requires iOS 16.0 or later", nil)
    }
}
    
    @objc
    func getAdultContentFilterStatus(_ resolve: @escaping RCTPromiseResolveBlock,
                                   rejecter reject: @escaping RCTPromiseRejectBlock) {
        print("[ScreenTimeManager] getAdultContentFilterStatus called")
        
        if #available(iOS 16.0, *) {
            // Check if adult content filter is enabled
            let isEnabled: Bool
            
            switch store.webContent.blockedByFilter {
            case .auto:
                isEnabled = true
            case .none:
                isEnabled = false
            case .specific:
                // If specific sites are blocked, we consider the filter as enabled
                isEnabled = true
            @unknown default:
                isEnabled = false
            }
            
            print("[ScreenTimeManager] Adult content filter status: \(isEnabled)")
            resolve([
                "enabled": isEnabled
            ])
        } else {
            resolve([
                "enabled": false,
                "error": "iOS 16.0 or later is required"
            ])
        }
    }
    
    @objc
    func displayFamilyActivityPicker(_ options: NSDictionary,
                                   resolver resolve: @escaping RCTPromiseResolveBlock,
                                   rejecter reject: @escaping RCTPromiseRejectBlock) {
        print("[ScreenTimeManager] displayFamilyActivityPicker called")
        
        if #available(iOS 16.0, *) {
            DispatchQueue.main.async {
                // Create a SwiftUI view with the picker
                struct PickerView: View {
                    @Binding var selection: FamilyActivitySelection
                    let headerText: String
                    let onDismiss: () -> Void
                    
                    var body: some View {
                        NavigationView {
                            FamilyActivityPicker(selection: $selection)
                                .navigationTitle(headerText)
                                .navigationBarItems(
                                    leading: Button("Cancel") {
                                        onDismiss()
                                    },
                                    trailing: Button("Done") {
                                        onDismiss()
                                    }
                                )
                        }
                    }
                }
                
                let headerText = options["headerText"] as? String ?? "Choose Apps to Block"
                
                let pickerView = PickerView(
                    selection: Binding(
                        get: { self.currentSelection },
                        set: { self.currentSelection = $0 }
                    ),
                    headerText: headerText,
                    onDismiss: {
                        // Encode the selection to a JSON string, then to Base64 to pass to JS
                        do {
                            let encoder = JSONEncoder()
                            let data = try encoder.encode(self.currentSelection)
                            let selectionString = data.base64EncodedString()
                            print("[ScreenTimeManager] Activity selection encoded and returned.")
                            resolve(["selection": selectionString])
                        } catch {
                            print("[ScreenTimeManager] Failed to encode selection: \(error.localizedDescription)")
                            reject("ENCODING_ERROR", "Failed to encode selection", error)
                        }
                        
                        // Dismiss the picker
                        DispatchQueue.main.async {
                            if let topViewController = self.getTopViewController() {
                                topViewController.dismiss(animated: true)
                            }
                        }
                    }
                )
                
                // Create a UIHostingController to present the SwiftUI picker
                let hostingController = UIHostingController(rootView: pickerView)
                hostingController.modalPresentationStyle = .formSheet
                
                // Present the picker
                guard let topViewController = self.getTopViewController() else {
                    reject("NO_VIEW_CONTROLLER", "Could not find view controller to present picker", nil)
                    return
                }
                
                // Store callbacks for potential cancellation
                self.pickerResolve = resolve
                self.pickerReject = reject
                
                topViewController.present(hostingController, animated: true)
            }
        } else {
            reject("UNSUPPORTED_VERSION", "iOS 16.0 or later is required", nil)
        }
    }
    
    @objc
    func setActivitySelection(_ selectionString: String,
                            resolver resolve: @escaping RCTPromiseResolveBlock,
                            rejecter reject: @escaping RCTPromiseRejectBlock) {
        print("[ScreenTimeManager] setActivitySelection called")
        
        if #available(iOS 16.0, *) {
            // Decode the selection from the Base64 string
            guard let data = Data(base64Encoded: selectionString) else {
                reject("DECODING_ERROR", "Invalid Base64 string for selection", nil)
                return
            }
            
            do {
                let decoder = JSONDecoder()
                let activitySelection = try decoder.decode(FamilyActivitySelection.self, from: data)

                // Update the current selection
                self.currentSelection = activitySelection

                // Apply the selection to restrict access
                store.shield.applications = activitySelection.applicationTokens.isEmpty ? nil : activitySelection.applicationTokens
                store.shield.applicationCategories = activitySelection.categoryTokens.isEmpty ? nil : .specific(activitySelection.categoryTokens)
                store.shield.webDomains = activitySelection.webDomainTokens.isEmpty ? nil : activitySelection.webDomainTokens
                
                print("[ScreenTimeManager] Activity selection applied successfully")
                resolve(true)
            } catch {
                print("[ScreenTimeManager] Failed to decode or apply selection: \(error.localizedDescription)")
                reject("DECODING_ERROR", "Failed to decode or apply selection", error)
            }
        } else {
            reject("UNSUPPORTED_VERSION", "iOS 16.0 or later is required", nil)
        }
    }
    
    @objc
    func removeActivitySelection(_ resolve: @escaping RCTPromiseResolveBlock,
                               rejecter reject: @escaping RCTPromiseRejectBlock) {
        print("[ScreenTimeManager] removeActivitySelection called")
        
        if #available(iOS 16.0, *) {
            // Clear all restrictions
            store.shield.applications = nil
            store.shield.applicationCategories = nil
            store.shield.webDomains = nil
            
            print("[ScreenTimeManager] Activity selection removed successfully")
            resolve(true)
        } else {
            reject("UNSUPPORTED_VERSION", "iOS 16.0 or later is required", nil)
        }
    }
    
    @objc
    func setCurrentSelection(_ selectionString: String,
                           resolver resolve: @escaping RCTPromiseResolveBlock,
                           rejecter reject: @escaping RCTPromiseRejectBlock) {
        print("[ScreenTimeManager] setCurrentSelection called")
        
        if #available(iOS 16.0, *) {
            guard let data = Data(base64Encoded: selectionString) else {
                reject("DECODING_ERROR", "Invalid Base64 string for selection", nil)
                return
            }
            
            do {
                let decoder = JSONDecoder()
                self.currentSelection = try decoder.decode(FamilyActivitySelection.self, from: data)
                print("[ScreenTimeManager] Current selection updated successfully")
                resolve(true)
            } catch {
                print("[ScreenTimeManager] Failed to decode selection: \(error.localizedDescription)")
                reject("DECODING_ERROR", "Failed to decode selection", error)
            }
        } else {
            reject("UNSUPPORTED_VERSION", "iOS 16.0 or later is required", nil)
        }
    }
    
    // Helper method to get the top view controller
    private func getTopViewController() -> UIViewController? {
        guard let windowScene = UIApplication.shared.connectedScenes.first as? UIWindowScene,
              let window = windowScene.windows.first else {
            return nil
        }
        
        var topController = window.rootViewController
        
        while let presentedViewController = topController?.presentedViewController {
            topController = presentedViewController
        }
        
        return topController
    }
    
    // MARK: - UIAdaptivePresentationControllerDelegate
    
    func presentationControllerDidDismiss(_ presentationController: UIPresentationController) {
        // Handle picker dismissal
        if let resolve = pickerResolve {
            do {
                let encoder = JSONEncoder()
                let data = try encoder.encode(self.currentSelection)
                let selectionString = data.base64EncodedString()
                print("[ScreenTimeManager] Picker dismissed, selection encoded and returned.")
                resolve(["selection": selectionString])
            } catch {
                print("[ScreenTimeManager] Failed to encode selection on dismiss: \(error.localizedDescription)")
                // Resolve with an empty selection if encoding fails
                resolve(["selection": ""])
            }
        }
        
        // Clear the stored callbacks
        pickerResolve = nil
        pickerReject = nil
    }
}
