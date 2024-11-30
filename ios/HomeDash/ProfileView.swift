import SwiftUI

struct ProfileView: View {
    @AppStorage("profile") var profileData: Data?
    @State private var profile: [String: Any] = [:]

    var body: some View {
        VStack {
            if profile.isEmpty {
                Text("No profile data available")
            } else {
                Text("Profile")
                    .font(.largeTitle)
                    .padding()
                
                if let storeName = profile["store_name"] as? String {
                    Text("Store Name: \(storeName)")
                }
                if let address = profile["address"] as? String {
                    Text("Address: \(address)")
                }
                if let email = profile["email"] as? String {
                    Text("Email: \(email)")
                }
                if let phoneNumber = profile["phone_number"] as? String {
                    Text("Phone: \(phoneNumber)")
                }
                if let storeType = profile["store_type"] as? String {
                    Text("Store Type: \(storeType)")
                }
            }
        }
        .onAppear {
            loadProfile()
        }
    }

    private func loadProfile() {
        guard let data = profileData else { return }
        if let decodedProfile = try? JSONSerialization.jsonObject(with: data, options: []) as? [String: Any] {
            profile = decodedProfile
        }
    }
}

//import SwiftUI
//struct ProfileView: View {
//    @AppStorage("profile") var profileData: Data?
//    @State private var profile: [String: Any] = [:]
//
//    var body: some View {
//        VStack {
//            if let profile = profile {
//                Text("Profile")
//                    .font(.largeTitle)
//                    .padding()
//                
//                if let storeName = profile["storeName"] as? String {
//                    Text("Store Name: \(storeName)")
//                }
//                if let address = profile["address"] as? String {
//                    Text("Address: \(address)")
//                }
//                if let email = profile["email"] as? String {
//                    Text("Email: \(email)")
//                }
//                if let phoneNumber = profile["phoneNumber"] as? String {
//                    Text("Phone: \(phoneNumber)")
//                }
//                if let storeType = profile["storeType"] as? String {
//                    Text("Store Type: \(storeType)")
//                }
//            } else {
//                Text("No profile data available")
//            }
//        }
//        .onAppear {
//            loadProfile()
//        }
//    }
//
//    private func loadProfile() {
//        if let data = profileData,
//           let decodedProfile = try? JSONSerialization.jsonObject(with: data, options: []) as? [String: Any] {
//            profile = decodedProfile
//        }
//    }
//}
//import SwiftUI
//
//struct ProfileView: View {
//    var userRole: String
//    var userName: String
//    var email: String
//    var additionalDetails: String? // For merchant-specific or user-specific info
//    
//    var body: some View {
//        VStack(alignment: .leading, spacing: 20) {
//            Text("Profile")
//                .font(.largeTitle)
//                .fontWeight(.bold)
//                .padding(.bottom)
//            
//            Text("Role: \(userRole)")
//                .font(.headline)
//            
//            Text("Name: \(userName)")
//                .font(.subheadline)
//            
//            Text("Email: \(email)")
//                .font(.subheadline)
//            
//            if let details = additionalDetails {
//                Text("Details: \(details)")
//                    .font(.subheadline)
//            }
//            
//            Spacer()
//        }
//        .padding()
//        .background(Color(hex: 0xFFE0F7FA)) // Add background color if desired
//        .cornerRadius(10)
//        .shadow(radius: 5)
//        .navigationTitle("Your Profile")
//    }
//}
//
//struct ProfileView_Previews: PreviewProvider {
//    static var previews: some View {
//        Group {
//            ProfileView(
//                userRole: "Merchant",
//                userName: "John Doe",
//                email: "merchant@example.com",
//                additionalDetails: "Store: John's Pizza"
//            )
//            .previewDisplayName("Merchant Profile")
//            
//            ProfileView(
//                userRole: "User",
//                userName: "Jane Smith",
//                email: "user@example.com",
//                additionalDetails: nil
//            )
//            .previewDisplayName("User Profile")
//        }
//    }
//}
//
//// Helper for hex colors
//extension Color {
//    init(hex: UInt) {
//        self.init(
//            .sRGB,
//            red: Double((hex >> 16) & 0xFF) / 255,
//            green: Double((hex >> 8) & 0xFF) / 255,
//            blue: Double(hex & 0xFF) / 255,
//            opacity: 1.0
//        )
//    }
//}
