import SwiftUI

func signup(name: String, email: String, password: String, completion: @escaping (Result<Bool, Error>) -> Void) {
    // Backend URL for signup
    guard let url = URL(string: "http://localhost:4000/user/signup") else {
        print("Invalid URL")
        return
    }
    
    var request = URLRequest(url: url)
    request.httpMethod = "POST"
    request.setValue("application/json", forHTTPHeaderField: "Content-Type")
    
    // The body data for the signup request
    let body: [String: Any] = [
        "name": name,
        "email": email,
        "password": password
    ]
    
    // Convert the body dictionary to JSON data
    do {
        request.httpBody = try JSONSerialization.data(withJSONObject: body)
    } catch {
        print("Failed to encode body: \(error)")
        return
    }
    
    // Send the request
    URLSession.shared.dataTask(with: request) { data, response, error in
        if let error = error {
            completion(.failure(error))
            return
        }
        
        // Handle response
        guard let httpResponse = response as? HTTPURLResponse, httpResponse.statusCode == 201 else {
            completion(.success(false)) // Assume 201 is the success status code for signup
            return
        }
        
        completion(.success(true)) // Signup successful
    }.resume()
}

func login(email: String, password: String, completion: @escaping (Result<Bool, Error>) -> Void) {
    // Backend URL for login
    guard let url = URL(string: "http://localhost:4000/user/login") else {
        print("Invalid URL")
        return
    }
    
    var request = URLRequest(url: url)
    request.httpMethod = "POST"
    request.setValue("application/json", forHTTPHeaderField: "Content-Type")
    
    // The body data for the login request
    let body: [String: Any] = [
        "email": email,
        "password": password
    ]
    
    // Convert the body dictionary to JSON data
    do {
        request.httpBody = try JSONSerialization.data(withJSONObject: body)
    } catch {
        print("Failed to encode body: \(error)")
        return
    }
    
    // Send the request
    URLSession.shared.dataTask(with: request) { data, response, error in
        if let error = error {
            completion(.failure(error))
            return
        }
        
        // Handle response
        guard let httpResponse = response as? HTTPURLResponse, httpResponse.statusCode == 200 else {
            completion(.success(false)) // Assume 200 is the success status code for login
            return
        }
        
        completion(.success(true)) // Login successful
    }.resume()
}

struct AuthView: View {
    @State private var isLoginMode = true
    @State private var email = ""
    @State private var password = ""
    @State private var confirmPassword = ""
    @State private var name = ""
    @State private var isAuthenticated = false

    var body: some View {
        NavigationView {
            ZStack {
                Color(hex: 0xFFE0F7FA) // Background color code (Light Blue)
                    .ignoresSafeArea()

                VStack {
                    Spacer()

                    // Show different logos for login and signup pages
                    if isLoginMode {
                        Image("login") // Logo for login page
                            .resizable()
                            .aspectRatio(contentMode: .fit)
                            .frame(height: 150)
                    } else {
                        Image("signup") // Logo for signup page
                            .resizable()
                            .aspectRatio(contentMode: .fit)
                            .frame(height: 150)
                    }

                    // App name
                    Text("HomeDasher")
                        .font(.largeTitle)
                        .fontWeight(.bold)
                        .padding(.bottom, 30)

                    VStack(spacing: 20) {
                        // Name field (only in Sign Up mode)
                        if !isLoginMode {
                            TextField("Name", text: $name)
                                .padding()
                                .frame(maxWidth: .infinity)
                                .background(Color.white)
                                .cornerRadius(10)
                        }
                        // Email field
                        TextField("Email", text: $email)
                            .autocapitalization(.none)
                            .keyboardType(.emailAddress)
                            .disableAutocorrection(true)
                            .padding()
                            .frame(maxWidth: .infinity)
                            .background(Color.white)
                            .cornerRadius(10)
                        
                        // Password field
                        SecureField("Password", text: $password)
                            .padding()
                            .frame(maxWidth: .infinity)
                            .background(Color.white)
                            .cornerRadius(10)
                        
                        // Confirm Password field (only in Sign Up mode)
                        if !isLoginMode {
                            SecureField("Confirm Password", text: $confirmPassword)
                                .padding()
                                .frame(maxWidth: .infinity)
                                .background(Color.white)
                                .cornerRadius(10)
                        }
                    }
                    .padding(.horizontal, 32)

                    // Action Button (Login or Sign Up)
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

                    // Social login buttons
                    HStack(spacing: 20) {
                        SmallSocialLoginButton(imageName: "google_logo", color: .red) {
                            print("Google login tapped")
                        }
                        SmallSocialLoginButton(imageName: "facebook_logo", color: .blue) {
                            print("Facebook login tapped")
                        }
                        SmallSocialLoginButton(iconName: "applelogo", color: .black) {
                            print("Apple login tapped")
                        }
                    }
                    .padding(.vertical, 10)

                    // Toggle between Login and Signup
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
            // Perform login action
            isAuthenticated = true
        } else {
            // Perform sign-up action
            if password == confirmPassword {
                isAuthenticated = true
            } else {
                print("Passwords do not match")
            }
        }
    }
}

struct SmallSocialLoginButton: View {
    var imageName: String? = nil
    var iconName: String? = nil
    var color: Color
    var action: () -> Void
    
    var body: some View {
        Button(action: action) {
            if let imageName = imageName {
                Image(imageName)
                    .resizable()
                    .aspectRatio(contentMode: .fit)
                    .frame(width: 24, height: 24)
                    .padding()
                    .background(color)
                    .clipShape(Circle())
            } else if let iconName = iconName {
                Image(systemName: iconName)
                    .font(.title2)
                    .foregroundColor(.white)
                    .padding()
                    .background(color)
                    .clipShape(Circle())
            }
        }
    }
}

// Keep the hex color extension here
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
