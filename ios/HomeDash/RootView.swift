import SwiftUI

struct RootView: View {
    @AppStorage("isAuthenticated") var isAuthenticated: Bool = false
    @AppStorage("userRole") var userRole: String? // Can be "User" or "Merchant"

    var body: some View {
        if isAuthenticated {
            if userRole == "Merchant" {
                MerchantView() // Show MerchantView for merchants
            } else {
                ContentView() // Show ContentView for users
            }
        } else {
            AuthView() // Show the AuthView for login/signup
        }
    }
}

struct RootView_Previews: PreviewProvider {
    static var previews: some View {
        RootView()
    }
}
