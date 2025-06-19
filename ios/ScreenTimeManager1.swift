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
    
    @objc
    func displayFamilyActivityPicker(_ options: NSDictionary,
                                   resolver resolve: @escaping RCTPromiseResolveBlock,
                                   rejecter reject: @escaping RCTPromiseRejectBlock) {
        print("[ScreenTimeManager] displayFamilyActivityPicker called")
        
        if #available(iOS 16.0, *) {
            DispatchQueue.main.async {
                // Reset current selection
                self.currentSelection = FamilyActivitySelection()
                
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
                        // Handle completion - return count information instead of token strings
                        let selectionDict: [String: Any] = [
                            "applicationTokens": self.currentSelection.applicationTokens.count,
                            "categoryTokens": self.currentSelection.categoryTokens.count,
                            "webDomainTokens": self.currentSelection.webDomainTokens.count,
                            "hasSelection": !self.currentSelection.applicationTokens.isEmpty || 
                                           !self.currentSelection.categoryTokens.isEmpty || 
                                           !self.currentSelection.webDomainTokens.isEmpty
                        ]
                        
                        print("[ScreenTimeManager] Activity selection updated: \(selectionDict)")
                        resolve(selectionDict)
                        
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
    func setActivitySelection(_ selectionDict: NSDictionary,
                            resolver resolve: @escaping RCTPromiseResolveBlock,
                            rejecter reject: @escaping RCTPromiseRejectBlock) {
        print("[ScreenTimeManager] setActivitySelection called")
        
        if #available(iOS 16.0, *) {
            // Apply the selection to restrict access using the stored selection
            store.shield.applications = currentSelection.applicationTokens.isEmpty ? nil : currentSelection.applicationTokens
            store.shield.applicationCategories = currentSelection.categoryTokens.isEmpty ? nil : .specific(currentSelection.categoryTokens)
            store.shield.webDomains = currentSelection.webDomainTokens.isEmpty ? nil : currentSelection.webDomainTokens
            
            print("[ScreenTimeManager] Activity selection applied successfully")
            resolve(true)
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
        // Handle picker dismissal - return count information instead of token strings
        if let resolve = pickerResolve {
            let selectionDict: [String: Any] = [
                "applicationTokens": currentSelection.applicationTokens.count,
                "categoryTokens": currentSelection.categoryTokens.count,
                "webDomainTokens": currentSelection.webDomainTokens.count,
                "hasSelection": !currentSelection.applicationTokens.isEmpty || 
                               !currentSelection.categoryTokens.isEmpty || 
                               !currentSelection.webDomainTokens.isEmpty
            ]
            
            print("[ScreenTimeManager] Picker dismissed with selection: \(selectionDict)")
            resolve(selectionDict)
        }
        
        // Clear the stored callbacks
        pickerResolve = nil
        pickerReject = nil
    }
}
