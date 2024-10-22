//import SwiftUI
//
//@main
//struct MyApp: App {
//    var body: some Scene {
//        WindowGroup {
//            SplashView() // Start with the splash screen
//        }
//    }
//}
//
//// Splash View (Displays for 3 seconds)
//struct SplashView: View {
//    @State private var isActive = false
//    
//    var body: some View {
//        if isActive {
//            MainAppView() // Navigate to main app after splash
//        } else {
//            ZStack {
//                Color.black
//                    .ignoresSafeArea()
//
//                // Logo or animation in the splash screen
//                VStack {
//                    Image(systemName: "bolt.fill") // Placeholder for your logo
//                        .resizable()
//                        .scaledToFit()
//                        .frame(width: 100, height: 100)
//                        .foregroundColor(.white)
//
//                    Text("HomeDasher")
//                        .font(.largeTitle)
//                        .fontWeight(.bold)
//                        .foregroundColor(.white)
//                }
//            }
//            .onAppear {
//                // Simulate 3 seconds of splash screen delay
//                DispatchQueue.main.asyncAfter(deadline: .now() + 3) {
//                    withAnimation {
//                        isActive = true
//                    }
//                }
//            }
//        }
//    }
//}
//
//// Main App View (Decides whether to show ContentView or AuthView)
//struct MainAppView: View {
//    @State private var isAuthenticated = false // Track authentication state
//    
//    var body: some View {
//        if isAuthenticated {
//            ContentView() // Show the content if already authenticated
//        } else {
//            AuthView() // Show the login/signup page if not authenticated
//        }
//    }
//}
//
//// ContentView (Placeholder for your main content view)
//struct ContentView: View {
//    var body: some View {
//        Text("Main App Content")
//            .font(.largeTitle)
//            .padding()
//    }
//}
//
//// AuthView (Your existing login/signup logic)
//struct AuthView: View {
//    @State private var isLoginMode = true
//    @State private var email = ""
//    @State private var password = ""
//    @State private var confirmPassword = ""
//    @State private var name = ""
//    @State private var isAuthenticated = false
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
//                    // App name
//                    Text("HomeDasher")
//                        .font(.largeTitle)
//                        .fontWeight(.bold)
//                        .padding(.bottom, 30)
//
//                    VStack(spacing: 20) {
//                        // Name field (only in Sign Up mode)
//                        if !isLoginMode {
//                            TextField("Name", text: $name)
//                                .padding()
//                                .frame(maxWidth: .infinity)
//                                .background(Color.white)
//                                .cornerRadius(10)
//                        }
//                        // Email field
//                        TextField("Email", text: $email)
//                            .autocapitalization(.none)
//                            .keyboardType(.emailAddress)
//                            .disableAutocorrection(true)
//                            .padding()
//                            .frame(maxWidth: .infinity)
//                            .background(Color.white)
//                            .cornerRadius(10)
//                        
//                        // Password field
//                        SecureField("Password", text: $password)
//                            .padding()
//                            .frame(maxWidth: .infinity)
//                            .background(Color.white)
//                            .cornerRadius(10)
//                        
//                        // Confirm Password field (only in Sign Up mode)
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
//                    // Social login buttons
//                    HStack(spacing: 20) {
//                        SmallSocialLoginButton(imageName: "google_logo", color: .red) {
//                            print("Google login tapped")
//                        }
//                        SmallSocialLoginButton(imageName: "facebook_logo", color: .blue) {
//                            print("Facebook login tapped")
//                        }
//                        SmallSocialLoginButton(iconName: "applelogo", color: .black) {
//                            print("Apple login tapped")
//                        }
//                    }
//                    .padding(.vertical, 10)
//
//                    // Toggle between Login and Signup
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
//            // Perform login action
//            isAuthenticated = true
//        } else {
//            // Perform sign-up action
//            if password == confirmPassword {
//                isAuthenticated = true
//            } else {
//                print("Passwords do not match")
//            }
//        }
//    }
//}
//
//// Helper to convert hex to Color
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
//// Small Social Login Button Component
//struct SmallSocialLoginButton: View {
//    var imageName: String? = nil
//    var iconName: String? = nil
//    var color: Color
//    var action: () -> Void
//    
//    var body: some View {
//        Button(action: action) {
//            if let imageName = imageName {
//                Image(imageName)
//                    .resizable()
//                    .aspectRatio(contentMode: .fit)
//                    .frame(width: 24, height: 24)
//                    .padding()
//                    .background(color)
//                    .clipShape(Circle())
//            } else if let iconName = iconName {
//                Image(systemName: iconName)
//                    .font(.title2)
//                    .foregroundColor(.white)
//                    .padding()
//                    .background(color)
//                    .clipShape(Circle())
//            }
//        }
//    }
//}

import SwiftUI

struct SplashView: View {
    @State private var isActive = false
    
    var body: some View {
        if isActive {
            MainAppView() // Navigate to main app after splash
        } else {
            ZStack {
                Color.black
                    .ignoresSafeArea()

                VStack {
                    Image(systemName: "bolt.fill") // Placeholder for your logo
                        .resizable()
                        .scaledToFit()
                        .frame(width: 100, height: 100)
                        .foregroundColor(.white)

                    Text("HomeDasher")
                        .font(.largeTitle)
                        .fontWeight(.bold)
                        .foregroundColor(.white)
                }
            }
            .onAppear {
                // Simulate 3 seconds of splash screen delay
                DispatchQueue.main.asyncAfter(deadline: .now() + 3) {
                    withAnimation {
                        isActive = true
                    }
                }
            }
        }
    }
}

struct MainAppView: View {
    @State private var isAuthenticated = false // Track authentication state
    
    var body: some View {
        if isAuthenticated {
            ContentView() // Show the content if already authenticated
        } else {
            AuthView() // Show the login/signup page if not authenticated
        }
    }
}

struct SplashView_Previews: PreviewProvider {
    static var previews: some View {
        SplashView()
    }
}
