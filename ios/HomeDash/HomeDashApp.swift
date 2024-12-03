import SwiftUI

@main
struct HomeDash: App {
    @StateObject private var cartModel = CartModel() // Initialize CartModel
    var body: some Scene {
        WindowGroup {
            ContentView() // Start with RootView
                .environmentObject(cartModel)
        }
    }
}
