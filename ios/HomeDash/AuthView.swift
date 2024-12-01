import SwiftUI

extension Color {
    init(hex: UInt, opacity: Double = 1.0) {
        self.init(
            .sRGB,
            red: Double((hex >> 16) & 0xFF) / 255,
            green: Double((hex >> 8) & 0xFF) / 255,
            blue: Double(hex & 0xFF) / 255,
            opacity: opacity
        )
    }
}
func signup(
    name: String,
    email: String,
    password: String,
    confirmPassword: String,
    isMerchant: Bool,
    storeName: String?,
    address: String?,
    phoneNumber: String?,
    storeType: String?,
    completion: @escaping (Result<Bool, Error>) -> Void
) {
    let endpoint = isMerchant ? "http://localhost:4000/merchants/signup" : "http://localhost:4000/user/signup"
    guard let url = URL(string: endpoint) else {
        completion(.failure(NSError(domain: "", code: 404, userInfo: [NSLocalizedDescriptionKey: "Invalid URL"])))
        return
    }

    var request = URLRequest(url: url)
    request.httpMethod = "POST"
    request.setValue("application/json", forHTTPHeaderField: "Content-Type")

    var body: [String: Any] = [
        "name": name,
        "email": email,
        "password": password,
        "confirmPassword": confirmPassword
    ]

    if isMerchant {
        guard let storeName = storeName, let address = address, let phoneNumber = phoneNumber, let storeType = storeType else {
            completion(.failure(NSError(domain: "", code: 400, userInfo: [NSLocalizedDescriptionKey: "Missing merchant fields"])))
            return
        }
        body["store_name"] = storeName
        body["address"] = address
        body["phone_number"] = phoneNumber
        body["store_type"] = storeType
    }

    do {
        request.httpBody = try JSONSerialization.data(withJSONObject: body)
    } catch {
        completion(.failure(error))
        return
    }

    URLSession.shared.dataTask(with: request) { data, response, error in
        if let error = error {
            completion(.failure(error))
            return
        }

        guard let httpResponse = response as? HTTPURLResponse, httpResponse.statusCode == 200 else {
            completion(.success(false))
            return
        }

        completion(.success(true))
    }.resume()
}
func login(
    email: String,
    password: String,
    isMerchant: Bool,
    completion: @escaping (Result<String, Error>) -> Void
) {
    let endpoint = isMerchant ? "http://localhost:4000/merchant/login" : "http://localhost:4000/user/login"
    guard let url = URL(string: endpoint) else {
        completion(.failure(NSError(domain: "", code: 404, userInfo: [NSLocalizedDescriptionKey: "Invalid URL"])))
        return
    }
    
    var request = URLRequest(url: url)
    request.httpMethod = "POST"
    request.setValue("application/json", forHTTPHeaderField: "Content-Type")
    
    let body: [String: Any] = [
        "email": email,
        "password": password
    ]
    
    do {
        request.httpBody = try JSONSerialization.data(withJSONObject: body)
    } catch {
        completion(.failure(error))
        return
    }
    
    URLSession.shared.dataTask(with: request) { data, response, error in
        if let error = error {
            completion(.failure(error))
            return
        }
        
        guard let data = data,
              let json = try? JSONSerialization.jsonObject(with: data, options: []) as? [String: Any],
              let token = json["token"] as? String else {
            completion(.failure(NSError(domain: "", code: 400, userInfo: [NSLocalizedDescriptionKey: "Invalid login response"])))
            return
        }
        
        completion(.success(token))
    }.resume()
    // ProfileView State Object
    struct Profile: Codable {
        var userRole: String
        var userName: String
        var email: String
        var additionalDetails: String?
    }
    
    struct AuthView: View {
        @State private var isLoginMode = true
        @State private var email = ""
        @State private var password = ""
        @State private var confirmPassword = ""
        @State private var name = ""
        @State private var isMerchant = false
        
        // Merchant-specific fields
        @State private var storeName = ""
        @State private var address = ""
        @State private var phoneNumber = ""
        @State private var storeType = ""
        
        @State private var profileData: Data?
        
        @AppStorage("isAuthenticated") var isAuthenticated: Bool = false
        @AppStorage("userRole") var userRole: String?
        
        var body: some View {
            NavigationView {
                ZStack {
                    Color(hex: 0xFFE0F7FA)
                        .ignoresSafeArea()
                    
                    VStack {
                        Spacer()
                        
                        Image(isLoginMode ? "login" : "signup")
                            .resizable()
                            .aspectRatio(contentMode: .fit)
                            .frame(height: 150)
                        
                        Text("HomeDasher")
                            .font(.largeTitle)
                            .fontWeight(.bold)
                            .padding(.bottom, 30)
                        
                        VStack(spacing: 20) {
                            if !isLoginMode {
                                TextField("Name", text: $name)
                                    .autocapitalization(.none)
                                    .disableAutocorrection(true)
                                    .padding()
                                    .background(Color.white)
                                    .cornerRadius(10)
                            }
                            
                            TextField("Email", text: $email)
                                .autocapitalization(.none)
                                .keyboardType(.emailAddress)
                                .disableAutocorrection(true)
                                .padding()
                                .background(Color.white)
                                .cornerRadius(10)
                            
                            SecureField("Password", text: $password)
                                .autocapitalization(.none)
                                .disableAutocorrection(true)
                                .padding()
                                .background(Color.white)
                                .cornerRadius(10)
                            
                            if !isLoginMode {
                                SecureField("Confirm Password", text: $confirmPassword)
                                    .autocapitalization(.none)
                                    .disableAutocorrection(true)
                                    .padding()
                                    .background(Color.white)
                                    .cornerRadius(10)
                            }
                            
                            Picker("Login as:", selection: $isMerchant) {
                                Text("User").tag(false)
                                Text("Merchant").tag(true)
                            }
                            .pickerStyle(SegmentedPickerStyle())
                            .padding(.horizontal, 32)
                        }
                        
                        Button(action: handleAction) {
                            Text(isLoginMode ? "Login" : "Register")
                                .foregroundColor(.white)
                                .padding()
                                .background(Color(hex: 0xFF3F51B5))
                                .cornerRadius(10)
                        }
                        .padding(.horizontal, 32)
                        .padding(.top, 20)
                        
                        Button(action: { isLoginMode.toggle() }) {
                            Text(isLoginMode ? "Don't have an account? Register" : "Already have an account? Login")
                                .foregroundColor(.blue)
                        }
                        .padding(.top, 10)
                        
                        Spacer()
                    }
                    .padding()
                }
                .navigationBarBackButtonHidden(true)
                .navigationDestination(isPresented: .constant(isAuthenticated)) {
                    if let profileData = profileData,
                       let profile = try? JSONDecoder().decode(Profile.self, from: profileData) {
                        ProfileView()
                    } else {
                        ContentView()
                    }
                }
            }
        }
        
        private func handleAction() {
            if isLoginMode {
                login(email: email, password: password, isMerchant: isMerchant) { result in
                    DispatchQueue.main.async {
                        switch result {
                        case .success(let token):
                            isAuthenticated = true
                            userRole = isMerchant ? "Merchant" : "User"
                            fetchProfile(token: token) // Fetch profile data
                        case .failure(let error):
                            print("Login error: \(error.localizedDescription)")
                        }
                    }
                }
            } else {
                signup(name: name,
                       email: email,
                       password: password,
                       confirmPassword: confirmPassword,
                       isMerchant: isMerchant,
                       storeName: storeName,
                       address: address,
                       phoneNumber: phoneNumber,
                       storeType: storeType
                ) { result in
                    DispatchQueue.main.async {
                        switch result {
                        case .success:
                            print("Signup successful")
                            isAuthenticated = true
                            userRole = isMerchant ? "Merchant" : "User"
                        case .failure(let error):
                            print("Signup error: \(error.localizedDescription)")
                        }
                    }
                }
            }
        }
        
        private func fetchProfile(token: String) {
            let endpoint = isMerchant ? "http://localhost:4000/merchant/profile" : "http://localhost:4000/user/profile"
            guard let url = URL(string: endpoint) else { return }
            
            var request = URLRequest(url: url)
            request.httpMethod = "GET"
            request.setValue("Bearer \(token)", forHTTPHeaderField: "Authorization")
            
            URLSession.shared.dataTask(with: request) { data, response, error in
                if let data = data {
                    DispatchQueue.main.async {
                        profileData = data
                    }
                } else if let error = error {
                    print("Profile fetch error: \(error.localizedDescription)")
                }
            }.resume()
        }
    }
    struct AuthView_Previews: PreviewProvider {
        static var previews: some View {
            AuthView()
        }
    }
}
