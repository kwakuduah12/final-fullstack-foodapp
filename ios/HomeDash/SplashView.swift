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
