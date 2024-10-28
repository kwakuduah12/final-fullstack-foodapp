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

    var body: some Scene {
        WindowGroup {
            if isAuthenticated {
                ContentView()
            } else {
                AuthView()
            }
        }
    }
}
