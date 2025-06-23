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
                    print("[ScreenTimeManager] Authorization successful")
                    resolve(true)
                } else {
                    reject("UNSUPPORTED_VERSION", "iOS 16.0 or later is required", nil)
                }
            } catch {
                reject("AUTHORIZATION_ERROR", "Authorization failed", error)
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
            do {
                store.webContent.blockedByFilter = enabled ? .auto(except: Set<WebDomain>()) : .none
                resolver(["success": true, "enabled": enabled])
            } catch {
                reject("FILTER_ERROR", "Failed to set adult content filter", error)
            }
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
                store.application.denyAppRemoval = true // block deletion during shield
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
            store.application.denyAppRemoval = false // allow deletion again
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
}
