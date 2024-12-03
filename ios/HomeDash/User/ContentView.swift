import SwiftUI
import CoreLocation
import MapKit

struct Promotion: Identifiable {
    let id = UUID()
    let imageName: String
    let title: String
    let description: String
}

struct Notification: Identifiable {
    let id = UUID()
    let title: String
    let description: String
    let imageName: String
}

struct ContentView: View {
    @AppStorage("authToken") private var authToken: String?
    @StateObject private var locationManager = LocationManager()
    @StateObject private var cartModel = CartModel() // Initialize CartModel
    @State private var menuItems: [MenuItem] = [] // Store menu items from the merchant
    @State private var isLoading: Bool = true // Loading state for menu items
    @State private var errorMessage: String? // Error message for menu items
    @State private var searchText = ""
    @State private var showMap = false
    @State private var showNotifications = false
    @State private var region = MKCoordinateRegion(
        center: CLLocationCoordinate2D(latitude: 37.7749, longitude: -122.4194),
        span: MKCoordinateSpan(latitudeDelta: 0.05, longitudeDelta: 0.05)
    )
    
    let promotions = [
        Promotion(imageName: "pepperoni", title: "20% Off on Pizza", description: "Order any pizza and get 20% off."),
        Promotion(imageName: "burger-drink", title: "Free Drink with Burger", description: "Get a free drink with every burger."),
        Promotion(imageName: "taco-tuesday", title: "Taco Tuesday Special", description: "Buy 2 Tacos, get 1 free!")
    ]
    
    var body: some View {
        NavigationView {
            VStack(alignment: .leading) {
                // Top Row with Location, Notification, and Cart
                HStack {
                    // Current Location
                    VStack(alignment: .leading) {
                        Text("Current Location")
                            .font(.subheadline)
                            .foregroundColor(.gray)
                        Text(locationManager.city ?? "Locating...")
                            .font(.headline)
                            .fontWeight(.bold)
                            .foregroundColor(Color.blue)
                    }
                    Spacer()
                    
                    // Notification Bell
                    Button(action: {
                        showNotifications = true
                    }) {
                        Image(systemName: "bell.fill")
                            .font(.title)
                            .foregroundColor(.white)
                            .padding()
                            .background(Circle().fill(Color.orange))
                    }
                    .sheet(isPresented: $showNotifications) {
                        NotificationView()
                    }
                    
                    // Shopping Cart
                    NavigationLink(destination: CartView().environmentObject(cartModel)) {
                        Image(systemName: "cart.fill")
                            .font(.title)
                            .foregroundColor(.white)
                            .padding()
                            .background(Circle().fill(Color.green))
                    }
                }
                .padding(.horizontal)
                
                // Search Bar and Map Icon
                HStack {
                    // Search bar
                    HStack {
                        Image(systemName: "magnifyingglass")
                        TextField("Search for restaurants or food...", text: $searchText)
                            .textFieldStyle(RoundedBorderTextFieldStyle())
                    }
                    .padding(.horizontal)
                    
                    // Map Icon
                    Button(action: {
                        showMap.toggle()
                    }) {
                        Image(systemName: "map.fill")
                            .font(.title2)
                            .foregroundColor(.white)
                            .padding()
                            .background(Circle().fill(Color.blue))
                    }
                    .sheet(isPresented: $showMap) {
                        MapView(region: $region)
                    }
                }
                .padding(.top, 10)
                // Merchant Menu Section
                Text("Merchant's Menu")
                    .font(.headline)
                    .padding(.leading, 16)
                    .frame(maxWidth: .infinity, alignment: .leading)
                
                if isLoading {
                    ProgressView("Loading menu items...")
                        .padding()
                } else if let errorMessage = errorMessage {
                    Text(errorMessage)
                        .foregroundColor(.red)
                        .padding()
                } else if menuItems.isEmpty {
                    Text("No items available in the menu.")
                        .font(.subheadline)
                        .foregroundColor(.gray)
                        .padding()
                } else {
                    ScrollView(.vertical, showsIndicators: false) {
                        ForEach(menuItems) { item in
                            VStack(alignment: .leading, spacing: 8) {
                                Text(item.itemName)
                                    .font(.headline)
                                Text(item.description ?? "No description available")
                                    .font(.subheadline)
                                    .foregroundColor(.gray)
                                Text("Price: $\(String(format: "%.2f", item.price))")
                                    .font(.subheadline)
                                    .foregroundColor(.green)
                                Divider()
                            }
                            .padding()
                        }
                    }
                    .padding(.horizontal)
                }
                
                Spacer()
            }
            .navigationTitle("Explore Menu")
            .onAppear {
                fetchMenuItems()
            }
        }
        .environmentObject(cartModel)
    }
    private func fetchMenuItems() {
        guard let token = authToken else {
            errorMessage = "User not authenticated."
            isLoading = false
            return
        }
        
        // Decode the merchant ID from the token
        guard let merchantId = decodeMerchantId(from: token) else {
            errorMessage = "Invalid token format."
            isLoading = false
            return
        }
        
        let endpoint = "http://localhost:4000/menu/merchant/\(merchantId)"
        guard let url = URL(string: endpoint) else {
            errorMessage = "Invalid backend URL."
            isLoading = false
            return
        }
        
        var request = URLRequest(url: url)
        request.httpMethod = "GET"
        request.setValue("Bearer \(token)", forHTTPHeaderField: "Authorization")
        
        isLoading = true
        errorMessage = nil
        
        URLSession.shared.dataTask(with: request) { data, response, error in
            DispatchQueue.main.async {
                isLoading = false
                if let error = error {
                    errorMessage = "Error fetching menu items: \(error.localizedDescription)"
                    return
                }
                
                guard let data = data else {
                    errorMessage = "No data received from server."
                    return
                }
                
                do {
                    menuItems = try JSONDecoder().decode([MenuItem].self, from: data)
                } catch {
                    errorMessage = "Failed to decode menu items: \(error.localizedDescription)"
                }
            }
        }.resume()
    }
    
    // Helper function to decode the merchant ID from the JWT token
    private func decodeMerchantId(from token: String) -> String? {
        let parts = token.split(separator: ".")
        guard parts.count == 3,
              let payloadData = Data(base64Encoded: String(parts[1])),
              let json = try? JSONSerialization.jsonObject(with: payloadData, options: []),
              let dictionary = json as? [String: Any],
              let merchantId = dictionary["id"] as? String else {
            return nil
        }
        
        return merchantId
    }
    // NotificationView to display a list of notifications
    struct NotificationView: View {
        let notifications = [
            Notification(title: "Restaurant Recommendations", description: "We recommend trying Bella Italia near you!", imageName: "italian"),
            Notification(title: "Order Update", description: "Your order is being dropped off in 10 minutes.", imageName: "burger-drink"),
            Notification(title: "Familiar Favorites", description: "Your favorite sushi place is offering 10% off today!", imageName: "sushi"),
            Notification(title: "New Restaurant Added", description: "Check out Taco Fiesta, now available in your area.", imageName: "tacos"),
            Notification(title: "Weekly Most Ordered", description: "Pizza is the top choice this week. Order now!", imageName: "pepperoni")
        ]
        
        var body: some View {
            NavigationView {
                List(notifications) { notification in
                    HStack {
                        Image(notification.imageName)
                            .resizable()
                            .aspectRatio(contentMode: .fill)
                            .frame(width: 50, height: 50)
                            .cornerRadius(10)
                            .padding(.trailing, 10)
                        
                        VStack(alignment: .leading) {
                            Text(notification.title)
                                .font(.headline)
                            Text(notification.description)
                                .font(.subheadline)
                                .foregroundColor(.gray)
                        }
                    }
                    .padding(.vertical, 5)
                }
                .navigationTitle("Notifications")
            }
        }
    }
    
    // Custom view for promotions
    struct PromotionView: View {
        let promotion: Promotion
        
        var body: some View {
            VStack {
                Image(promotion.imageName)
                    .resizable()
                    .aspectRatio(contentMode: .fill)
                    .frame(width: 150, height: 100)
                    .cornerRadius(10)
                
                Text(promotion.title)
                    .font(.headline)
                    .padding(.top, 5)
                    .multilineTextAlignment(.center)
                
                Text(promotion.description)
                    .font(.subheadline)
                    .foregroundColor(.gray)
                    .multilineTextAlignment(.center)
                    .padding(.horizontal, 5)
            }
            .frame(width: 150)
            .background(Color.white)
            .cornerRadius(10)
            .shadow(radius: 3)
        }
    }
    
    // Custom view for food categories
    struct FoodCategoryView: View {
        var name: String
        var imageName: String
        
        var body: some View {
            VStack {
                Image(imageName)
                    .resizable()
                    .aspectRatio(contentMode: .fit)
                    .frame(width: 100, height: 100)
                    .background(Circle().fill(Color.purple.opacity(0.2)))
                Text(name)
                    .font(.caption)
                    .fontWeight(.bold)
                    .foregroundColor(.purple)
            }
            .frame(width: 120, height: 150)
            .background(Color.white)
            .cornerRadius(10)
            .shadow(radius: 5)
        }
    }
    
    // Custom view for sort tags
    struct SortTagView: View {
        var name: String
        
        var body: some View {
            Text(name)
                .font(.subheadline)
                .padding(.horizontal, 15)
                .padding(.vertical, 10)
                .background(Color.blue.opacity(0.2))
                .foregroundColor(.blue)
                .cornerRadius(20)
                .shadow(radius: 3)
        }
    }
    
    // MapView to display the user's location
    struct MapView: UIViewRepresentable {
        @Binding var region: MKCoordinateRegion
        
        func makeUIView(context: Context) -> MKMapView {
            let mapView = MKMapView()
            mapView.delegate = context.coordinator
            mapView.showsUserLocation = true
            return mapView
        }
        
        func updateUIView(_ uiView: MKMapView, context: Context) {
            uiView.setRegion(region, animated: true)
        }
        
        func makeCoordinator() -> Coordinator {
            Coordinator(self)
        }
        
        class Coordinator: NSObject, MKMapViewDelegate {
            var parent: MapView
            
            init(_ parent: MapView) {
                self.parent = parent
            }
        }
    }
    
    // Location Manager to get user's location
    class LocationManager: NSObject, ObservableObject, CLLocationManagerDelegate {
        private let locationManager = CLLocationManager()
        
        @Published var city: String? = nil
        
        override init() {
            super.init()
            locationManager.delegate = self
            locationManager.requestWhenInUseAuthorization()
            locationManager.startUpdatingLocation()
        }
        
        func locationManager(_ manager: CLLocationManager, didUpdateLocations locations: [CLLocation]) {
            guard let location = locations.first else { return }
            
            let geocoder = CLGeocoder()
            geocoder.reverseGeocodeLocation(location) { (placemarks, error) in
                if let placemark = placemarks?.first {
                    self.city = placemark.locality
                }
            }
        }
    }
}
    // Preview
    struct ContentView_Previews: PreviewProvider {
        static var previews: some View {
            ContentView()
        }
    }

