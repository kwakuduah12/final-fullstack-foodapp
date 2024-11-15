//import SwiftUI
//
//// Signup Function (for actual backend signup API)
//func signup(name: String, email: String, password: String, confirmPassword: String, role: String, completion: @escaping (Result<Bool, Error>) -> Void) {
//    guard let url = URL(string: "http://localhost:4000/user/signup") else {
//        print("Invalid URL")
//        return
//    }
//    
//    var request = URLRequest(url: url)
//    request.httpMethod = "POST"
//    request.setValue("application/json", forHTTPHeaderField: "Content-Type")
//    
//    let body: [String: Any] = [
//        "name": name,
//        "email": email,
//        "password": password,
//        "confirmPassword": confirmPassword,
//        "role": role
//    ]
//    
//    do {
//        request.httpBody = try JSONSerialization.data(withJSONObject: body)
//    } catch {
//        print("Failed to encode body: \(error)")
//        return
//    }
//    
//    URLSession.shared.dataTask(with: request) { data, response, error in
//        if let error = error {
//            completion(.failure(error))
//            return
//        }
//        
//        guard let httpResponse = response as? HTTPURLResponse, httpResponse.statusCode == 200 else {
//            completion(.success(false))
//            return
//        }
//        
//        completion(.success(true))
//    }.resume()
//}
//
//// Login Function (for actual backend login API)
//func login(email: String, password: String, completion: @escaping (Result<Bool, Error>) -> Void) {
//    guard let url = URL(string: "http://localhost:4000/user/login") else {
//        print("Invalid URL")
//        return
//    }
//    
//    var request = URLRequest(url: url)
//    request.httpMethod = "POST"
//    request.setValue("application/json", forHTTPHeaderField: "Content-Type")
//    
//    let body: [String: Any] = [
//        "email": email,
//        "password": password
//    ]
//    
//    do {
//        request.httpBody = try JSONSerialization.data(withJSONObject: body)
//    } catch {
//        print("Failed to encode body: \(error)")
//        return
//    }
//    
//    URLSession.shared.dataTask(with: request) { data, response, error in
//        if let error = error {
//            completion(.failure(error))
//            return
//        }
//        
//        guard let httpResponse = response as? HTTPURLResponse, httpResponse.statusCode == 200 else {
//            completion(.success(false))
//            return
//        }
//        
//        completion(.success(true))
//    }.resume()
//}
//
//// Main AuthView with Login/Signup Integration
//struct AuthView: View {
//    @State private var isLoginMode = true
//    @State private var email = ""
//    @State private var password = ""
//    @State private var confirmPassword = ""
//    @State private var name = ""
//    @State private var selectedRole = "User" // Default role
//    
//    // Use @AppStorage to persist authentication state
//    @AppStorage("isAuthenticated") var isAuthenticated: Bool = false
//    @AppStorage("userRole") var userRole: String = "User" // To save role
//
//    var body: some View {
//        NavigationView {
//            ZStack {
//                Color(hex: 0xFFE0F7FA) // Background color code (Light Blue)
//                    .ignoresSafeArea()
//
//                VStack {
//                    Spacer()
//
//                    // Show different logos for login and signup pages
//                    if isLoginMode {
//                        Image("login") // Logo for login page
//                            .resizable()
//                            .aspectRatio(contentMode: .fit)
//                            .frame(height: 150)
//                    } else {
//                        Image("signup") // Logo for signup page
//                            .resizable()
//                            .aspectRatio(contentMode: .fit)
//                            .frame(height: 150)
//                    }
//
//                    Text("HomeDasher")
//                        .font(.largeTitle)
//                        .fontWeight(.bold)
//                        .padding(.bottom, 30)
//
//                    VStack(spacing: 20) {
//                        if !isLoginMode {
//                            TextField("Name", text: $name)
//                                .padding()
//                                .frame(maxWidth: .infinity)
//                                .background(Color.white)
//                                .cornerRadius(10)
//                        }
//                        TextField("Email", text: $email)
//                            .autocapitalization(.none)
//                            .keyboardType(.emailAddress)
//                            .disableAutocorrection(true)
//                            .padding()
//                            .frame(maxWidth: .infinity)
//                            .background(Color.white)
//                            .cornerRadius(10)
//                        
//                        SecureField("Password", text: $password)
//                            .padding()
//                            .frame(maxWidth: .infinity)
//                            .background(Color.white)
//                            .cornerRadius(10)
//
//                        if !isLoginMode {
//                            SecureField("Confirm Password", text: $confirmPassword)
//                                .padding()
//                                .frame(maxWidth: .infinity)
//                                .background(Color.white)
//                                .cornerRadius(10)
//                        }
//                    }
//                    .padding(.horizontal, 32)
//
//                    // Action Button (Login or Sign Up)
//                    Button(action: handleAction) {
//                        Text(isLoginMode ? "Login" : "Register")
//                            .font(.headline)
//                            .foregroundColor(.white)
//                            .padding()
//                            .frame(maxWidth: .infinity)
//                            .background(Color(hex: 0xFF3F51B5))
//                            .cornerRadius(10)
//                    }
//                    .padding(.horizontal, 32)
//                    .padding(.top, 20)
//
//                    Button(action: { isLoginMode.toggle() }) {
//                        Text(isLoginMode ? "Don't have an account? Register" : "Already have an account? Login")
//                            .foregroundColor(.blue)
//                    }
//                    .padding(.top, 10)
//
//                    Spacer()
//                }
//                .frame(maxWidth: .infinity, maxHeight: .infinity)
//                .padding(.horizontal, 32)
//            }
//            .navigationBarBackButtonHidden(true)
//        }
//    }
//    
//    private func handleAction() {
//        if isLoginMode {
//            // Perform login
//            login(email: email, password: password) { result in
//                switch result {
//                case .success(let success):
//                    if success {
//                        print("Login successful")
//                        isAuthenticated = true // Set to true after successful login
//                    } else {
//                        print("Login failed")
//                    }
//                case .failure(let error):
//                    print("Login error: \(error.localizedDescription)")
//                }
//            }
//        } else {
//            // Perform signup
//            signup(name: name, email: email, password: password, confirmPassword: confirmPassword, role: selectedRole) { result in
//                switch result {
//                case .success(let success):
//                    if success {
//                        print("Signup successful")
//                        userRole = selectedRole // Save role after successful signup
//                        isAuthenticated = true // Set to true after successful signup
//                    } else {
//                        print("Signup failed")
//                    }
//                case .failure(let error):
//                    print("Signup error: \(error.localizedDescription)")
//                }
//            }
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
//
//struct AuthView_Previews: PreviewProvider {
//    static var previews: some View {
//        AuthView()
//    }
//}
import SwiftUI

// Signup Function (for actual backend signup API)
func signup(name: String, email: String, password: String, confirmPassword: String, isMerchant: Bool, completion: @escaping (Result<Bool, Error>) -> Void) {
    let endpoint = isMerchant ? "http://localhost:4000/merchant/signup" : "http://localhost:4000/user/signup"
    guard let url = URL(string: endpoint) else {
        print("Invalid URL")
        return
    }
    
    var request = URLRequest(url: url)
    request.httpMethod = "POST"
    request.setValue("application/json", forHTTPHeaderField: "Content-Type")
    
    let body: [String: Any] = [
        "name": name,
        "email": email,
        "password": password,
        "confirmPassword": confirmPassword
    ]
    
    do {
        request.httpBody = try JSONSerialization.data(withJSONObject: body)
    } catch {
        print("Failed to encode body: \(error)")
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

// Login Function (for actual backend login API)
func login(email: String, password: String, isMerchant: Bool, completion: @escaping (Result<Bool, Error>) -> Void) {
    let endpoint = isMerchant ? "http://localhost:4000/merchant/login" : "http://localhost:4000/user/login"
    guard let url = URL(string: endpoint) else {
        print("Invalid URL")
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
        print("Failed to encode body: \(error)")
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

// Main AuthView with Login/Signup Integration
struct AuthView: View {
    @State private var isLoginMode = true
    @State private var email = ""
    @State private var password = ""
    @State private var confirmPassword = ""
    @State private var name = ""
    @State private var isMerchant = false
    
    // Use @AppStorage to persist authentication state
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
                                .frame(maxWidth: UIScreen.main.bounds.width * 0.9)
                                .background(Color.white)
                                .cornerRadius(10)
                        }
                        
                        TextField("Email", text: $email)
                            .autocapitalization(.none)
                            .keyboardType(.emailAddress)
                            .disableAutocorrection(true)
                            .padding()
                            .frame(maxWidth: UIScreen.main.bounds.width * 0.9)
                            .background(Color.white)
                            .cornerRadius(10)
                        
                        SecureField("Password", text: $password)
                            .autocapitalization(.none)
                            .disableAutocorrection(true)
                            .padding()
                            .frame(maxWidth: UIScreen.main.bounds.width * 0.9)
                            .background(Color.white)
                            .cornerRadius(10)
                        
                        if !isLoginMode {
                            SecureField("Confirm Password", text: $confirmPassword)
                                .autocapitalization(.none)
                                .disableAutocorrection(true)
                                .padding()
                                .frame(maxWidth: UIScreen.main.bounds.width * 0.9)
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
                            .font(.headline)
                            .foregroundColor(.white)
                            .padding()
                            .frame(maxWidth: .infinity)
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
                .frame(maxWidth: .infinity, maxHeight: .infinity)
                .padding(.horizontal, 32)
            }
            .navigationBarBackButtonHidden(true)
        }
    }
    private func handleAction() {
        if isLoginMode {
            login(email: email, password: password, isMerchant: isMerchant) { result in
                DispatchQueue.main.async {
                    switch result {
                    case .success(let success):
                        if success {
                            print("Login successful")
                            isAuthenticated = true
                            userRole = isMerchant ? "Merchant" : "User"
                        } else {
                            print("Login failed")
                        }
                    case .failure(let error):
                        print("Login error: \(error.localizedDescription)")
                    }
                }
            }
        } else {
            signup(name: name, email: email, password: password, confirmPassword: confirmPassword, isMerchant: isMerchant) { result in
                DispatchQueue.main.async {
                    switch result {
                    case .success(let success):
                        if success {
                            print("Signup successful")
                            isAuthenticated = true
                            userRole = isMerchant ? "Merchant" : "User"
                        } else {
                            print("Signup failed")
                        }
                    case .failure(let error):
                        print("Signup error: \(error.localizedDescription)")
                    }
                }
            }
        }
    }
}

// Helper for hex colors
extension Color {
    init(hex: UInt) {
        self.init(
            .sRGB,
            red: Double((hex >> 16) & 0xFF) / 255,
            green: Double((hex >> 8) & 0xFF) / 255,
            blue: Double(hex & 0xFF) / 255,
            opacity: 1.0
        )
    }
}

struct AuthView_Previews: PreviewProvider {
    static var previews: some View {
        AuthView()
    }
}
