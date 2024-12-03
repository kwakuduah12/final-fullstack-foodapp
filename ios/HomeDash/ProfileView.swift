import SwiftUI

struct ProfileView: View {
    @AppStorage("authToken") private var authToken: String? // Retrieve the stored token
    @AppStorage("userRole") private var userRole: String?
    @State private var name: String = ""
    @State private var email: String = ""
    @State private var storeName: String = ""
    @State private var storeAddress: String = ""
    @State private var isLoading: Bool = true

    var body: some View {
        VStack {
            if isLoading {
                ProgressView("Loading Profile...")
            } else {
                VStack(alignment: .leading, spacing: 12) {
                    HStack(spacing: 16) {
                        // SF Symbols for placeholders
                        Image(systemName: userRole == "Merchant" ? "building.2.crop.circle" : "person.crop.circle")
                            .resizable()
                            .scaledToFit()
                            .frame(width: 60, height: 60)
                            .foregroundColor(.gray)
                            .clipShape(Circle())
                            .shadow(radius: 5)

                        VStack(alignment: .leading, spacing: 4) {
                            Text("Role: \(userRole ?? "Unknown")")
                                .font(.headline)
                            Text("Name: \(name)")
                                .font(.subheadline)
                        }
                    }

                    Text("Email: \(email)")
                        .font(.subheadline)

                    if userRole == "Merchant" {
                        Text("Store Name: \(storeName)")
                            .font(.subheadline)
                        Text("Store Address: \(storeAddress)")
                            .font(.subheadline)
                    }
                }
                .padding()
                .background(Color(hex: 0xFFE0F7FA))
                .cornerRadius(10)
                .shadow(radius: 5)
                .padding(.horizontal)
            }
            Spacer()
        }
        .padding()
        .navigationTitle("Your Profile")
        .onAppear {
            loadProfile()
        }
    }

    private func loadProfile() {
        guard let token = authToken else {
            print("No token available")
            return
        }

        let endpoint = (userRole == "Merchant") ? "http://localhost:4000/merchant/profile" : "http://localhost:4000/user/profile"
        guard let url = URL(string: endpoint) else { return }

        var request = URLRequest(url: url)
        request.httpMethod = "GET"
        request.setValue("Bearer \(token)", forHTTPHeaderField: "Authorization")

        URLSession.shared.dataTask(with: request) { data, response, error in
            if let error = error {
                print("Error fetching profile: \(error.localizedDescription)")
                return
            }

            guard let data = data,
                  let json = try? JSONSerialization.jsonObject(with: data, options: []) as? [String: Any],
                  let profileData = json["data"] as? [String: Any] else {
                print("Invalid profile response")
                return
            }

            DispatchQueue.main.async {
                self.name = profileData["name"] as? String ?? "Unknown"
                self.email = profileData["email"] as? String ?? "Unknown"
                if self.userRole == "Merchant" {
                    self.storeName = profileData["store_name"] as? String ?? "Unknown"
                    self.storeAddress = profileData["address"] as? String ?? "Unknown"
                }
                self.isLoading = false
            }
        }.resume()
    }
}

struct ProfileView_Previews: PreviewProvider {
    static var previews: some View {
        ProfileView()
    }
}
