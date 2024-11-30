struct ProfileView: View {
    @AppStorage("profile") var profileData: Data?
    @State private var profile: [String: Any] = [:]

    var body: some View {
        VStack {
            if let profile = profile {
                Text("Profile")
                    .font(.largeTitle)
                    .padding()
                
                if let storeName = profile["storeName"] as? String {
                    Text("Store Name: \(storeName)")
                }
                if let address = profile["address"] as? String {
                    Text("Address: \(address)")
                }
                if let email = profile["email"] as? String {
                    Text("Email: \(email)")
                }
                if let phoneNumber = profile["phoneNumber"] as? String {
                    Text("Phone: \(phoneNumber)")
                }
                if let storeType = profile["storeType"] as? String {
                    Text("Store Type: \(storeType)")
                }
            } else {
                Text("No profile data available")
            }
        }
        .onAppear {
            loadProfile()
        }
    }

    private func loadProfile() {
        if let data = profileData,
           let decodedProfile = try? JSONSerialization.jsonObject(with: data, options: []) as? [String: Any] {
            profile = decodedProfile
        }
    }
}
