//
//  HomeDashApp.swift
//  HomeDash
//
//  Created by Kwaku Duah De-Graft on 10/2/24.
//

import SwiftUI

@main
struct HomeDashApp: App {
    @AppStorage("isAuthenticated") var isAuthenticated: Bool = false
    @AppStorage("userRole") var userRole: String = "User" // Store user role ("User" or "Merchant")

    var body: some Scene {
        WindowGroup {
            if isAuthenticated {
                if userRole == "Merchant" {
                    MerchantView() // Display MerchantView if the user is a merchant
                } else {
                    ContentView() // Display ContentView for regular users
                }
            } else {
                AuthView()
            }
        }
    }
}

