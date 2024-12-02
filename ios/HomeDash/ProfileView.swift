//import SwiftUI
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
//struct ProfileView: View {
//    var userRole: String
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
//                email: "merchant@example.com",
//                additionalDetails: "Store: John's Pizza"
//            )
//            .previewDisplayName("Merchant Profile")
//            
//            ProfileView(
//                userRole: "User",
//                email: "user@example.com",
//                additionalDetails: nil
//            )
//            .previewDisplayName("User Profile")
//        }
//    }
//}
//
//
//
//import SwiftUI
//
//struct ProfileView: View {
//    @State private var userRole: String = ""
//    @State private var email: String = ""
//    @State private var additionalDetails: String? = nil
//    @State private var isLoading: Bool = true
//
//    var token: String // Pass the token from AuthView
//    var isMerchant: Bool
//
//    var body: some View {
//        VStack {
//            if isLoading {
//                ProgressView("Loading Profile...")
//            } else {
//                VStack(alignment: .leading, spacing: 12) {
//                    Text("Role: \(userRole)")
//                        .font(.headline)
//                    Text("Email: \(email)")
//                        .font(.subheadline)
//                    if let details = additionalDetails {
//                        Text("Details: \(details)")
//                            .font(.subheadline)
//                            .foregroundColor(.gray)
//                    }
//                }
//                .padding()
//                .background(Color(hex: 0xFFE0F7FA))
//                .cornerRadius(10)
//                .shadow(radius: 5)
//                .padding(.horizontal)
//            }
//
//            Spacer()
//        }
//        .padding()
//        .navigationTitle("Your Profile")
//        .onAppear {
//            loadProfile()
//        }
//    }
//    func fetchProfile(
//        token: String,
//        isMerchant: Bool,
//        completion: @escaping (Result<[String: Any], Error>) -> Void
//    ) {
//        let endpoint = isMerchant ? "http://localhost:4000/merchant/profile" : "http://localhost:4000/user/profile"
//        guard let url = URL(string: endpoint) else {
//            completion(.failure(NSError(domain: "", code: 404, userInfo: [NSLocalizedDescriptionKey: "Invalid URL"])))
//            return
//        }
//
//        var request = URLRequest(url: url)
//        request.httpMethod = "GET"
//        request.setValue("Bearer \(token)", forHTTPHeaderField: "Authorization")
//
//        URLSession.shared.dataTask(with: request) { data, response, error in
//            if let error = error {
//                completion(.failure(error))
//                return
//            }
//
//            guard let data = data,
//                  let json = try? JSONSerialization.jsonObject(with: data, options: []) as? [String: Any] else {
//                completion(.failure(NSError(domain: "", code: 400, userInfo: [NSLocalizedDescriptionKey: "Invalid response"])))
//                return
//            }
//
//            completion(.success(json))
//        }.resume()
//    }
//
//    private func loadProfile() {
//        fetchProfile(token: token, isMerchant: isMerchant) { result in
//            DispatchQueue.main.async {
//                switch result {
//                case .success(let data):
//                    self.userRole = data["userRole"] as? String ?? "Unknown"
//                    self.email = data["email"] as? String ?? "Unknown"
//                    self.additionalDetails = data["additionalDetails"] as? String
//                    self.isLoading = false
//                case .failure(let error):
//                    print("Error loading profile: \(error.localizedDescription)")
//                    self.isLoading = false
//                }
//            }
//        }
//    }
//}
//
//
//struct ProfileView_Previews: PreviewProvider {
//    static var previews: some View {
//        Group {
//            ProfileView(token: token, isMerchant: true)
//            .previewDisplayName("Merchant Profile")
//
//            ProfileView()
//            .previewDisplayName("User Profile")
//        }
//    }
//}
//import SwiftUI
//
//struct ProfileView: View {
//    var userRole: String
//    var email: String
//    var additionalDetails: String? // For merchant-specific or user-specific info
//
//    var body: some View {
//        VStack {
//            Text("Profile")
//                .font(.title)
//                .fontWeight(.bold)
//                .padding(.bottom, 20)
//
//            HStack(alignment: .center, spacing: 16) {
//                // Placeholder Image
//                Image(systemName: "person.circle.fill")
//                    .resizable()
//                    .aspectRatio(contentMode: .fit)
//                    .frame(width: 80, height: 80)
//                    .foregroundColor(.blue)
//
//                // Profile Details
//                VStack(alignment: .leading, spacing: 8) {
//                    Text("Role: \(userRole)")
//                        .font(.headline)
//                        .foregroundColor(.primary)
//
//                    Text("Email: \(email)")
//                        .font(.subheadline)
//                        .foregroundColor(.secondary)
//
//                    if let details = additionalDetails {
//                        Text("Details: \(details)")
//                            .font(.subheadline)
//                            .foregroundColor(.gray)
//                    }
//                }
//            }
//            .padding()
//            .frame(maxWidth: .infinity, alignment: .leading)
//            .background(Color(hex: 0xFFE0F7FA))
//            .cornerRadius(12)
//            .shadow(radius: 5)
//            .padding(.horizontal)
//
//            Spacer()
//        }
//        .padding()
//        .navigationTitle("Your Profile")
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
//
//struct ProfileView_Previews: PreviewProvider {
//    static var previews: some View {
//        Group {
//            ProfileView(
//                userRole: "Merchant",
//                email: "merchant@example.com",
//                additionalDetails: "Store: John's Pizza"
//            )
//            .previewDisplayName("Merchant Profile")
//
//            ProfileView(
//                userRole: "User",
//                email: "user@example.com",
//                additionalDetails: nil
//            )
//            .previewDisplayName("User Profile")
//        }
//    }
//}
//import SwiftUI
//
//struct ProfileView: View {
//    @State private var userRole: String = ""
//    @State private var email: String = ""
//    @State private var additionalDetails: [String: String]? = nil
//    @State private var isLoading: Bool = true
//    @State private var errorMessage: String? = nil
//
//    var token: String // Token passed from AuthView
//    var isMerchant: Bool
//
//    var body: some View {
//        VStack {
//            if isLoading {
//                ProgressView("Loading Profile...")
//            } else if let errorMessage = errorMessage {
//                Text(errorMessage)
//                    .foregroundColor(.red)
//                    .multilineTextAlignment(.center)
//                    .padding()
//            } else {
//                // Profile Card
//                HStack(alignment: .top, spacing: 16) {
//                    Image(systemName: "person.circle.fill") // Placeholder image
//                        .resizable()
//                        .aspectRatio(contentMode: .fit)
//                        .frame(width: 80, height: 80)
//                        .foregroundColor(.blue)
//
//                    VStack(alignment: .leading, spacing: 8) {
//                        Text("Role: \(userRole)")
//                            .font(.headline)
//                        Text("Email: \(email)")
//                            .font(.subheadline)
//                            .foregroundColor(.secondary)
//                        
//                        if let details = additionalDetails {
//                            ForEach(details.sorted(by: { $0.key < $1.key }), id: \.key) { key, value in
//                                Text("\(key.capitalized): \(value)")
//                                    .font(.subheadline)
//                                    .foregroundColor(.gray)
//                            }
//                        }
//                    }
//                }
//                .padding()
//                .background(Color(hex: 0xFFE0F7FA))
//                .cornerRadius(12)
//                .shadow(radius: 5)
//                .padding(.horizontal)
//            }
//
//            Spacer()
//        }
//        .padding()
//        .navigationTitle("Your Profile")
//        .onAppear {
//            loadProfile()
//        }
//    }
//
//    private func fetchProfile(
//        token: String,
//        isMerchant: Bool,
//        completion: @escaping (Result<[String: Any], Error>) -> Void
//    ) {
//        let endpoint = isMerchant ? "http://localhost:4000/merchant/profile" : "http://localhost:4000/user/profile"
//        guard let url = URL(string: endpoint) else {
//            completion(.failure(NSError(domain: "", code: 404, userInfo: [NSLocalizedDescriptionKey: "Invalid URL"])))
//            return
//        }
//
//        var request = URLRequest(url: url)
//        request.httpMethod = "GET"
//        request.setValue("Bearer \(token)", forHTTPHeaderField: "Authorization")
//
//        URLSession.shared.dataTask(with: request) { data, response, error in
//            if let error = error {
//                completion(.failure(error))
//                return
//            }
//
//            guard let data = data,
//                  let json = try? JSONSerialization.jsonObject(with: data, options: []) as? [String: Any],
//                  let profileData = json["data"] as? [String: Any] else {
//                completion(.failure(NSError(domain: "", code: 400, userInfo: [NSLocalizedDescriptionKey: "Invalid response"])))
//                return
//            }
//
//            completion(.success(profileData))
//        }.resume()
//    }
//
//    private func loadProfile() {
//        fetchProfile(token: token, isMerchant: isMerchant) { result in
//            DispatchQueue.main.async {
//                switch result {
//                case .success(let data):
//                    self.userRole = isMerchant ? "Merchant" : "User"
//                    self.email = data["email"] as? String ?? "Unknown"
//                    
//                    if isMerchant {
//                        // For merchants, fetch store-specific details
//                        self.additionalDetails = [
//                            "Store Name": data["store_name"] as? String ?? "N/A",
//                            "Address": data["address"] as? String ?? "N/A",
//                            "Phone": data["phone_number"] as? String ?? "N/A",
//                            "Type": data["store_type"] as? String ?? "N/A"
//                        ]
//                    } else {
//                        // For users, handle any additional fields
//                        self.additionalDetails = [
//                            "Name": data["name"] as? String ?? "N/A"
//                        ]
//                    }
//
//                    self.isLoading = false
//                case .failure(let error):
//                    self.errorMessage = "Failed to load profile: \(error.localizedDescription)"
//                    self.isLoading = false
//                }
//            }
//        }
//    }
//}
//
//struct ProfileView_Previews: PreviewProvider {
//    static var previews: some View {
//        Group {
//            ProfileView(token: "mockToken", isMerchant: true)
//                .previewDisplayName("Merchant Profile")
//
//            ProfileView(token: "mockToken", isMerchant: false)
//                .previewDisplayName("User Profile")
//        }
//    }
//}
import SwiftUI

struct ProfileView: View {
    @AppStorage("authToken") private var authToken: String? // Retrieve the stored token
    @AppStorage("userRole") private var userRole: String?
    @State private var email: String = ""
    @State private var additionalDetails: String? = nil
    @State private var isLoading: Bool = true

    var body: some View {
        VStack {
            if isLoading {
                ProgressView("Loading Profile...")
            } else {
                VStack(alignment: .leading, spacing: 12) {
                    Text("Role: \(userRole ?? "Unknown")")
                        .font(.headline)
                    Text("Email: \(email)")
                        .font(.subheadline)
                    if let details = additionalDetails {
                        Text("Details: \(details)")
                            .font(.subheadline)
                            .foregroundColor(.gray)
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
            if let data = data {
                DispatchQueue.main.async {
                    if let json = try? JSONSerialization.jsonObject(with: data, options: []) as? [String: Any] {
                        self.email = json["email"] as? String ?? "Unknown"
                        self.additionalDetails = json["storeName"] as? String // Example for Merchant
                        self.isLoading = false
                    }
                }
            } else if let error = error {
                print("Error fetching profile: \(error.localizedDescription)")
            }
        }.resume()
    }
}
struct ProfileView_Previews: PreviewProvider {
    static var previews: some View {
        ProfileView()
    }
}
