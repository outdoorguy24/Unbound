//
//  UnboundDeviceActivity.swift
//  UnboundDeviceActivity
//
//  Created by Alex Starr on 10/14/25.
//

import Foundation
import DeviceActivity
import ManagedSettings

@main
struct UnboundDeviceActivity: DeviceActivityReport {
    func makeConfiguration() -> DeviceActivityReportConfiguration {
        return DeviceActivityReportConfiguration(
            // Configure the report to collect usage data
            // This will be called by the system when the device activity events are triggered
        )
    }
}

// Device Activity Event Handler
class UnboundDeviceActivityEventHandler: DeviceActivityMonitor {
    override func intervalDidStart(for activity: DeviceActivityName) {
        super.intervalDidStart(for: activity)
        print("Device Activity interval started for: \(activity)")
        
        // Handle the start of a device activity interval
        // This is where you would start collecting usage data
    }
    
    override func intervalDidEnd(for activity: DeviceActivityName) {
        super.intervalDidEnd(for: activity)
        print("Device Activity interval ended for: \(activity)")
        
        // Handle the end of a device activity interval
        // This is where you would process collected usage data
    }
    
    override func eventDidReachThreshold(_ event: DeviceActivityEvent.Name, activity: DeviceActivityName) {
        super.eventDidReachThreshold(event, activity: activity)
        print("Device Activity event reached threshold: \(event) for activity: \(activity)")
        
        // Handle when a device activity event reaches its threshold
        // This is where you would collect the actual usage data
    }
}
